// Tests for src/lib/logic.ts — scoring, weakness map, drill plan,
// timer helpers, and strict validation of AI-generated question JSON.
import { describe, expect, it } from "vitest";
import {
  buildDrillPlanFallback,
  computeWeaknessMap,
  formatDuration,
  inferenceSourceLabel,
  parseGeneratedQuestions,
  parseGeneratedQuestionsText,
  remainingSeconds,
  scoreSession,
  sessionInferenceSource,
  sessionSourceInfo,
  shuffle,
  verifiedTagText,
} from "./logic";
import type { AnsweredQuestion, Question } from "./types";

function q(subtopic: string, id: string): Question {
  return {
    id,
    subtest: "matematika",
    subtopic,
    text: "Soal contoh untuk pengujian.",
    options: ["A", "B", "C", "D"],
    answerIndex: 0,
    explanation: "Pembahasan contoh untuk pengujian.",
    source: "contoh",
  };
}

function answered(subtopic: string, correct: boolean, id: string): AnsweredQuestion {
  return { question: q(subtopic, id), selectedIndex: correct ? 0 : 1, correct };
}

describe("scoreSession", () => {
  it("scores all-correct as 100", () => {
    expect(scoreSession([answered("Aljabar", true, "1"), answered("Geometri", true, "2")])).toEqual({
      correct: 2,
      total: 2,
      score: 100,
    });
  });

  it("scores partial results and rounds", () => {
    const r = scoreSession([
      answered("Aljabar", true, "1"),
      answered("Aljabar", false, "2"),
      answered("Aljabar", false, "3"),
    ]);
    expect(r).toEqual({ correct: 1, total: 3, score: 33 });
  });

  it("scores an empty session as 0", () => {
    expect(scoreSession([])).toEqual({ correct: 0, total: 0, score: 0 });
  });

  it("counts unanswered questions as wrong", () => {
    const a = answered("Aljabar", false, "1");
    a.selectedIndex = null;
    expect(scoreSession([a]).correct).toBe(0);
  });
});

describe("computeWeaknessMap", () => {
  it("groups by subtopic and sorts weakest first", () => {
    const map = computeWeaknessMap([
      answered("Aljabar", true, "1"),
      answered("Aljabar", false, "2"),
      answered("Geometri", true, "3"),
      answered("Geometri", true, "4"),
    ]);
    expect(map).toEqual([
      { subtopic: "Aljabar", total: 2, correct: 1, percent: 50 },
      { subtopic: "Geometri", total: 2, correct: 2, percent: 100 },
    ]);
  });

  it("returns an empty map for an empty session", () => {
    expect(computeWeaknessMap([])).toEqual([]);
  });

  it("handles a subtopic with zero correct", () => {
    const map = computeWeaknessMap([answered("Statistika", false, "1")]);
    expect(map[0]).toEqual({ subtopic: "Statistika", total: 1, correct: 0, percent: 0 });
  });
});

describe("buildDrillPlanFallback", () => {
  it("builds 7 days with day 7 as retest", () => {
    const plan = buildDrillPlanFallback([
      { subtopic: "Aljabar", total: 4, correct: 1, percent: 25 },
      { subtopic: "Geometri", total: 4, correct: 4, percent: 100 },
    ]);
    expect(plan.source).toBe("aturan");
    expect(plan.days).toHaveLength(7);
    expect(plan.days[6].subtopic).toBe("Tryout ulang");
    // Weakest subtopic (Aljabar) gets the first days.
    expect(plan.days[0].subtopic).toBe("Aljabar");
    expect(plan.days[1].subtopic).toBe("Aljabar");
    for (const d of plan.days) {
      expect(d.day).toBeGreaterThanOrEqual(1);
      expect(d.day).toBeLessThanOrEqual(7);
      expect(d.focus.length).toBeGreaterThan(0);
      expect(d.target.length).toBeGreaterThan(0);
    }
  });

  it("works with an empty weakness map", () => {
    const plan = buildDrillPlanFallback([]);
    expect(plan.days).toHaveLength(7);
    expect(plan.days[6].subtopic).toBe("Tryout ulang");
  });
});

describe("timer helpers", () => {
  it("remainingSeconds counts down and clamps at 0", () => {
    expect(remainingSeconds(10_000, 2_500)).toBe(7);
    expect(remainingSeconds(10_000, 10_000)).toBe(0);
    expect(remainingSeconds(10_000, 99_000)).toBe(0);
  });

  it("formatDuration renders MM:SS", () => {
    expect(formatDuration(0)).toBe("00:00");
    expect(formatDuration(75)).toBe("01:15");
    expect(formatDuration(600)).toBe("10:00");
    expect(formatDuration(1125)).toBe("18:45");
    expect(formatDuration(-5)).toBe("00:00");
  });
});

describe("shuffle", () => {
  it("preserves all elements without mutating the input", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("parseGeneratedQuestions", () => {
  const valid = {
    questions: [
      {
        text: "Berapakah 2 + 2 dalam soal ini?",
        options: ["3", "4", "5", "6"],
        answerIndex: 1,
        subtopic: "Aljabar",
        explanation: "2 + 2 = 4, jadi jawabannya 4.",
      },
    ],
  };

  it("accepts a valid payload", () => {
    const out = parseGeneratedQuestions(valid, "matematika", "ai", "ai-x");
    expect(out).toHaveLength(1);
    expect(out?.[0].id).toBe("ai-x-0");
    expect(out?.[0].source).toBe("ai");
    expect(out?.[0].answerIndex).toBe(1);
  });

  it("rejects an out-of-range answerIndex", () => {
    const bad = { questions: [{ ...valid.questions[0], answerIndex: 4 }] };
    expect(parseGeneratedQuestions(bad, "matematika", "ai", "ai-x")).toBeNull();
  });

  it("rejects fewer than 4 options", () => {
    const bad = { questions: [{ ...valid.questions[0], options: ["3", "4", "5"] }] };
    expect(parseGeneratedQuestions(bad, "matematika", "ai", "ai-x")).toBeNull();
  });

  it("rejects more than 5 options", () => {
    const bad = {
      questions: [{ ...valid.questions[0], options: ["1", "2", "3", "4", "5", "6"] }],
    };
    expect(parseGeneratedQuestions(bad, "matematika", "ai", "ai-x")).toBeNull();
  });

  it("rejects a missing explanation", () => {
    const { explanation: _omit, ...rest } = valid.questions[0];
    expect(parseGeneratedQuestions({ questions: [rest] }, "matematika", "ai", "ai-x")).toBeNull();
  });

  it("rejects an empty questions array and non-objects", () => {
    expect(parseGeneratedQuestions({ questions: [] }, "matematika", "ai", "ai-x")).toBeNull();
    expect(parseGeneratedQuestions(null, "matematika", "ai", "ai-x")).toBeNull();
    expect(parseGeneratedQuestions("nonsense", "matematika", "ai", "ai-x")).toBeNull();
  });
});

describe("parseGeneratedQuestionsText", () => {
  it("parses JSON wrapped in ```json fences", () => {
    const text = '```json\n{"questions": [{"text": "Berapakah 2 + 2 dalam soal ini?", "options": ["3", "4", "5", "6"], "answerIndex": 1, "subtopic": "Aljabar", "explanation": "2 + 2 = 4, jadi jawabannya 4."}]}\n```';
    const out = parseGeneratedQuestionsText(text, "matematika", "ai", "ai-x");
    expect(out).toHaveLength(1);
  });

  it("parses JSON with surrounding prose", () => {
    const text =
      'Berikut soalnya: {"questions": [{"text": "Berapakah 2 + 2 dalam soal ini?", "options": ["3", "4", "5", "6"], "answerIndex": 1, "subtopic": "Aljabar", "explanation": "2 + 2 = 4, jadi jawabannya 4."}]} Semoga membantu!';
    expect(parseGeneratedQuestionsText(text, "matematika", "ai", "ai-x")).toHaveLength(1);
  });

  it("rejects invalid JSON and wrong shapes", () => {
    expect(parseGeneratedQuestionsText("bukan json sama sekali", "matematika", "ai", "ai-x")).toBeNull();
    expect(parseGeneratedQuestionsText('{"foo": 1}', "matematika", "ai", "ai-x")).toBeNull();
  });
});

describe("sessionSourceInfo (P0-3/P0-4)", () => {
  function seedQ(id: string): Question {
    return { ...q("Statistika", id), source: "contoh", verified: true, verifiedBy: "audit" };
  }
  function aiQ(id: string): Question {
    return {
      ...q("Statistika", id),
      source: "ai",
      verified: true,
      verifiedBy: "validator",
    };
  }

  it("labels an all-seed session 'Soal contoh' with 'diaudit manusia' provenance", () => {
    expect(sessionSourceInfo([seedQ("s1"), seedQ("s2")])).toEqual({
      label: "Soal contoh",
      provenance: "diaudit manusia",
    });
  });

  it("labels an all-AI session 'Dibuat AI' with 'lolos validasi otomatis' provenance", () => {
    expect(sessionSourceInfo([aiQ("a1"), aiQ("a2")])).toEqual({
      label: "Dibuat AI",
      provenance: "lolos validasi otomatis",
    });
  });

  it("labels a mixed session explicitly and never calls a seed question AI-made", () => {
    const info = sessionSourceInfo([seedQ("s1"), aiQ("a1")]);
    expect(info.label).toBe("Dibuat AI + soal contoh");
    expect(info.provenance).toBe("terverifikasi");
  });

  it("does not claim human audit for an unverified AI question", () => {
    const info = sessionSourceInfo([{ ...aiQ("a1"), verified: false, verifiedBy: undefined }]);
    expect(info.provenance).not.toBe("diaudit manusia");
  });
});

describe("verifiedTagText (P0-4)", () => {
  it("returns 'Diaudit manusia' for an audited seed question", () => {
    const seed: Question = {
      ...q("Statistika", "s1"),
      source: "contoh",
      verified: true,
      verifiedBy: "audit",
    };
    expect(verifiedTagText(seed)).toBe("✓ Diaudit manusia");
  });

  it("returns 'Lolos validasi otomatis' for a validator-passed AI question", () => {
    const ai: Question = {
      ...q("Statistika", "a1"),
      source: "ai",
      verified: true,
      verifiedBy: "validator",
    };
    expect(verifiedTagText(ai)).toBe("✓ Lolos validasi otomatis");
  });

  it("falls back to the generic tag for a verified question without provenance", () => {
    const legacy: Question = { ...q("Statistika", "l1"), source: "ai", verified: true };
    expect(verifiedTagText(legacy)).toBe("✓ Terverifikasi");
  });

  it("returns null for an unverified question (no tag shown)", () => {
    expect(verifiedTagText({ ...q("Statistika", "u1"), verified: false })).toBeNull();
  });
});

describe("sessionSourceInfo — unaudited seed provenance (P0-2, GPT round 2)", () => {
  function seedAudited(id: string): Question {
    return { ...q("Statistika", id), source: "contoh", verified: true, verifiedBy: "audit" };
  }
  function seedUnaudited(id: string): Question {
    // A sample question whose ID is not in VERIFIED_SAMPLE_IDS: served
    // without the verified badge (see sampleSet).
    return { ...q("Statistika", id), source: "contoh", verified: false };
  }
  function aiValidated(id: string): Question {
    return { ...q("Statistika", id), source: "ai", verified: true, verifiedBy: "validator" };
  }

  it("labels an all-audited seed session 'diaudit manusia'", () => {
    expect(sessionSourceInfo([seedAudited("s1"), seedAudited("s2")])).toEqual({
      label: "Soal contoh",
      provenance: "diaudit manusia",
    });
  });

  it("does NOT claim full verification when one seed question is unaudited", () => {
    const info = sessionSourceInfo([seedAudited("s1"), seedUnaudited("s2")]);
    expect(info.label).toBe("Soal contoh");
    expect(info.provenance).toBe("sebagian terverifikasi");
    expect(info.provenance).not.toBe("terverifikasi");
    expect(info.provenance).not.toBe("diaudit manusia");
  });

  it("labels a fully unaudited seed session 'sebagian terverifikasi'", () => {
    const info = sessionSourceInfo([seedUnaudited("s1"), seedUnaudited("s2")]);
    expect(info.label).toBe("Soal contoh");
    expect(info.provenance).toBe("sebagian terverifikasi");
  });

  it("keeps AI-validator questions distinct from audited seed in a mixed session", () => {
    const seed = seedAudited("s1");
    const ai = aiValidated("a1");
    const info = sessionSourceInfo([seed, ai]);
    expect(info.label).toBe("Dibuat AI + soal contoh");
    expect(info.provenance).toBe("terverifikasi");
    // The per-question tags carry the distinction the session label cannot.
    expect(verifiedTagText(seed)).toBe("✓ Diaudit manusia");
    expect(verifiedTagText(ai)).toBe("✓ Lolos validasi otomatis");
  });
});

describe("sessionInferenceSource (P0-1, GPT round 2)", () => {
  function seedQ(id: string): Question {
    return { ...q("Statistika", id), source: "contoh", verified: true, verifiedBy: "audit" };
  }
  function aiQ(id: string): Question {
    return { ...q("Statistika", id), source: "ai", verified: true, verifiedBy: "validator" };
  }

  it("hides the inference source for a 100% seed session, even when a source is set", () => {
    expect(sessionInferenceSource([seedQ("s1"), seedQ("s2")], "IN_CLOUD")).toBeNull();
    expect(sessionInferenceSource([seedQ("s1")], "ON_DEVICE")).toBeNull();
    expect(sessionInferenceSource([seedQ("s1")], "MIXED")).toBeNull();
  });

  it("shows the inference source for a mixed seed+AI session, honestly", () => {
    expect(sessionInferenceSource([seedQ("s1"), aiQ("a1")], "IN_CLOUD")).toBe("IN_CLOUD");
    expect(sessionInferenceSource([seedQ("s1"), aiQ("a1")], "MIXED")).toBe("MIXED");
  });

  it("shows the inference source for an all-AI session", () => {
    expect(sessionInferenceSource([aiQ("a1"), aiQ("a2")], "ON_DEVICE")).toBe("ON_DEVICE");
  });

  it("returns null when there is no inference source at all", () => {
    expect(sessionInferenceSource([aiQ("a1")], null)).toBeNull();
    expect(sessionInferenceSource([seedQ("s1")], null)).toBeNull();
  });
});

describe("inferenceSourceLabel (P1-3 display)", () => {
  it("labels ON_DEVICE / IN_CLOUD / MIXED in Indonesian UI terms", () => {
    expect(inferenceSourceLabel("ON_DEVICE")).toBe("on-device");
    expect(inferenceSourceLabel("IN_CLOUD")).toBe("cloud");
    expect(inferenceSourceLabel("MIXED")).toBe("campuran");
  });
});
