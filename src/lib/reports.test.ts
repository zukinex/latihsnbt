// Tests for the crowd-validated report system (reports.ts).
// The agreement/threshold/correction logic is pure and tested without
// Firestore; the submitReport fallback (no Firebase app) is tested with a
// stubbed browser (window + Map-based localStorage).
import { beforeEach, describe, expect, it } from "vitest";
import {
  REPORT_AGREEMENT_THRESHOLD,
  applyCorrection,
  applyCorrections,
  countAgreements,
  findConfirmedCorrection,
  getDeviceId,
  submitReport,
  type StoredReport,
  type WrongKind,
} from "./reports";
import { isReported } from "./storage";
import type { Question } from "./types";

function stubBrowser() {
  const store = new Map<string, string>();
  const ls = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key: (i: number) => [...store.keys()][i] ?? null,
  };
  (globalThis as unknown as Record<string, unknown>).window = globalThis;
  (globalThis as unknown as Record<string, unknown>).self = globalThis;
  (globalThis as unknown as Record<string, unknown>).localStorage = ls;
  return store;
}

function makeReport(
  questionId: string,
  deviceId: string,
  option: number | null,
  kind: WrongKind = "key",
  note = "",
): StoredReport {
  return {
    questionId,
    subtest: "matematika",
    subtopic: "Aljabar",
    text: "Soal contoh?",
    wrongKind: kind,
    proposedAnswerIndex: option,
    note,
    deviceId,
    reportedAt: "2026-11-28T00:00:00.000Z",
  };
}

function tenAgreeing(questionId: string, option: number, note = ""): StoredReport[] {
  return Array.from({ length: 10 }, (_, i) => makeReport(questionId, `device-${i}`, option, "key", note));
}

function sampleQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: "q1",
    subtest: "matematika",
    subtopic: "Aljabar",
    text: "Berapa 2 + 2?",
    options: ["1", "2", "3", "4"],
    answerIndex: 0,
    explanation: "Penjelasan lama.",
    source: "contoh",
    ...overrides,
  };
}

describe("report agreement counting", () => {
  it("counts ten distinct devices agreeing on one option", () => {
    expect(countAgreements(tenAgreeing("q1", 3), "q1")).toEqual({ option: 3, count: 10 });
  });

  it("counts nine as nine — below the threshold", () => {
    const reports = Array.from({ length: 9 }, (_, i) => makeReport("q1", `device-${i}`, 3));
    expect(countAgreements(reports, "q1")).toEqual({ option: 3, count: 9 });
  });

  it("counts one device once even when it re-reports", () => {
    const reports = [
      makeReport("q1", "device-a", 3, "key", "catatan pertama"),
      makeReport("q1", "device-a", 3, "key", "catatan kedua"),
    ];
    expect(countAgreements(reports, "q1")).toEqual({ option: 3, count: 1 });
  });

  it("splits the count when devices disagree on the option", () => {
    const reports = [
      ...Array.from({ length: 6 }, (_, i) => makeReport("q1", `d-a${i}`, 3)),
      ...Array.from({ length: 4 }, (_, i) => makeReport("q1", `d-b${i}`, 1)),
    ];
    expect(countAgreements(reports, "q1")).toEqual({ option: 3, count: 6 });
  });

  it("ignores non-key reports and reports without a proposed option", () => {
    const reports = [
      ...tenAgreeing("q1", 3),
      makeReport("q1", "device-x", null, "unclear"),
      makeReport("q1", "device-y", 3, "explanation"),
      makeReport("q1", "device-z", null, "key"),
    ];
    expect(countAgreements(reports, "q1")).toEqual({ option: 3, count: 10 });
  });

  it("returns null when no key reports exist for the question", () => {
    expect(countAgreements([makeReport("q1", "d1", null, "unclear")], "q1")).toBeNull();
    expect(countAgreements(tenAgreeing("q2", 3), "q1")).toBeNull();
  });
});

describe("confirmed corrections", () => {
  it("confirms a fix at exactly ten agreeing devices", () => {
    expect(REPORT_AGREEMENT_THRESHOLD).toBe(10);
    const c = findConfirmedCorrection(tenAgreeing("q1", 3), "q1");
    expect(c).not.toBeNull();
    expect(c?.questionId).toBe("q1");
    expect(c?.correctAnswerIndex).toBe(3);
    expect(c?.reportCount).toBe(10);
  });

  it("does not confirm below ten", () => {
    const reports = Array.from({ length: 9 }, (_, i) => makeReport("q1", `device-${i}`, 3));
    expect(findConfirmedCorrection(reports, "q1")).toBeNull();
  });

  it("picks the most common correction note as the explanation", () => {
    const reports = [
      ...Array.from({ length: 6 }, (_, i) => makeReport("q1", `d-a${i}`, 3, "key", "Jawaban benar 4.")),
      ...Array.from({ length: 4 }, (_, i) => makeReport("q1", `d-b${i}`, 3, "key", "Harusnya D.")),
    ];
    expect(findConfirmedCorrection(reports, "q1")?.explanation).toBe("Jawaban benar 4.");
  });

  it("leaves the explanation null when no agreeing report wrote a note", () => {
    expect(findConfirmedCorrection(tenAgreeing("q1", 3), "q1")?.explanation).toBeNull();
  });
});

describe("correction overlay", () => {
  it("overrides the key and explanation and marks the question corrected", () => {
    const corrections = new Map([
      [
        "q1",
        {
          questionId: "q1",
          correctAnswerIndex: 3,
          explanation: "Jawaban benar 4.",
          reportCount: 10,
          agreedAt: "2026-11-28T00:00:00.000Z",
        },
      ],
    ]);
    const fixed = applyCorrection(sampleQuestion(), corrections);
    expect(fixed.answerIndex).toBe(3);
    expect(fixed.explanation).toBe("Jawaban benar 4.");
    expect(fixed.corrected).toBe(true);
    expect(fixed.id).toBe("q1");
    expect(fixed.options).toEqual(["1", "2", "3", "4"]);
  });

  it("keeps the original explanation when the correction has none", () => {
    const corrections = new Map([
      [
        "q1",
        {
          questionId: "q1",
          correctAnswerIndex: 3,
          explanation: null,
          reportCount: 10,
          agreedAt: "2026-11-28T00:00:00.000Z",
        },
      ],
    ]);
    expect(applyCorrection(sampleQuestion(), corrections).explanation).toBe("Penjelasan lama.");
  });

  it("returns the question untouched when there is no correction", () => {
    const q = sampleQuestion();
    expect(applyCorrection(q, new Map())).toBe(q);
    expect(applyCorrections([q], new Map())).toEqual([q]);
  });
});

describe("device id and local fallback", () => {
  beforeEach(() => {
    stubBrowser();
  });

  it("keeps the same device id across calls", () => {
    expect(getDeviceId()).toBe(getDeviceId());
    expect(getDeviceId().length).toBeGreaterThan(0);
  });

  it("saves the report locally and never confirms without Firestore", async () => {
    const result = await submitReport({
      questionId: "q1",
      subtest: "matematika",
      subtopic: "Aljabar",
      text: "Berapa 2 + 2?",
      wrongKind: "key",
      proposedAnswerIndex: 3,
      note: "Jawaban benar 4.",
    });
    expect(result.submitted).toBe(true);
    expect(result.confirmed).toBe(false);
    expect(isReported("q1")).toBe(true);
  });
});
