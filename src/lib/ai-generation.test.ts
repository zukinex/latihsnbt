// Integration tests for generateQuestions (ai.ts): validation gate,
// one regeneration for the shortfall only, Verified Bank fallback, soft
// 90s batch budget, and student cancellation.
//
// The Firebase AI SDK is mocked (no network, no real model). The Verified
// Question Bank is REAL (static audited seed + stubbed localStorage), so
// these tests prove the whole fallback chain end-to-end.
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

const mockState = vi.hoisted(() => ({
  generateContent: vi.fn() as Mock<(...args: unknown[]) => Promise<unknown>>,
  prompts: [] as string[],
}));

vi.mock("firebase/ai", () => ({
  getAI: () => ({}),
  GoogleAIBackend: class {},
  InferenceMode: {
    PREFER_ON_DEVICE: "PREFER_ON_DEVICE",
    PREFER_IN_CLOUD: "PREFER_IN_CLOUD",
    ONLY_IN_CLOUD: "ONLY_IN_CLOUD",
  },
  ThinkingLevel: {
    MINIMAL: "MINIMAL",
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
  },
  Schema: {
    object: () => ({}),
    array: () => ({}),
    string: () => ({}),
    number: () => ({}),
  },
  getGenerativeModel: () => ({
    generateContent: async (prompt: string) => {
      mockState.prompts.push(prompt);
      return mockState.generateContent(prompt);
    },
  }),
}));

vi.mock("./firebase", () => ({ getFirebaseApp: () => ({}) }));

// Minimal browser stub for the runtime bank (vitest runs in Node).
const localStore = new Map<string, string>();
(globalThis as unknown as { window: unknown }).window = globalThis;
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => localStore.get(k) ?? null,
  setItem: (k: string, v: string) => {
    localStore.set(k, v);
  },
  removeItem: (k: string) => {
    localStore.delete(k);
  },
};

import { generateQuestions } from "./ai";
import { sessionInferenceSource } from "./logic";
import type { Question } from "./types";
import { getBankStats } from "./verified-bank";

function aiResponse(questions: Record<string, unknown>[]) {
  return {
    response: {
      text: () => JSON.stringify({ questions }),
      inferenceSource: "IN_CLOUD",
    },
  };
}

function aiResponseWithSource(questions: Record<string, unknown>[], source: string) {
  return {
    response: {
      text: () => JSON.stringify({ questions }),
      inferenceSource: source,
    },
  };
}

function validMath(id: string, n: number): Record<string, unknown> {
  // Small math questions whose explanation derives exactly the keyed
  // value, so the deterministic validator marks them VALID.
  const fixtures: Record<number, { text: string; options: string[]; answerIndex: number; explanation: string; subtopic: string }> = {
    1: {
      text: "Rata-rata dari 4, 6, 8, dan 10 adalah berapa?",
      options: ["6", "7", "8", "9"],
      answerIndex: 1,
      explanation: "Jumlahnya 4 + 6 + 8 + 10 = 28. Rata-rata = 28 / 4 = 7.",
      subtopic: "Statistika",
    },
    2: {
      text: "Berapakah hasil dari 2 + 3 × 4?",
      options: ["14", "20", "24", "10"],
      answerIndex: 0,
      explanation: "Perkalian dulu: 3 × 4 = 12. Lalu 2 + 12 = 14.",
      subtopic: "Fungsi dan pertumbuhan",
    },
    3: {
      text: "Luas persegi dengan panjang sisi 5 cm adalah berapa?",
      options: ["20", "25", "30", "10"],
      answerIndex: 1,
      explanation: "Luas persegi = s × s = 5 × 5 = 25.",
      subtopic: "Optimasi",
    },
    4: {
      text: "Jika x + 7 = 15, maka nilai x adalah berapa?",
      options: ["7", "8", "9", "22"],
      answerIndex: 1,
      explanation: "x = 15 - 7 = 8.",
      subtopic: "Barisan dan deret",
    },
    5: {
      text: "Setengah dari 36 adalah berapa?",
      options: ["12", "18", "24", "9"],
      answerIndex: 1,
      explanation: "36 / 2 = 18.",
      subtopic: "Statistika",
    },
  };
  const f = fixtures[n];
  return { ...f, id };
}

function invalidMath(id: string): Record<string, unknown> {
  // Key says 8, but the explanation itself derives 7.
  return {
    id,
    text: "Rata-rata dari 4, 6, 8, dan 10 adalah berapa?",
    options: ["6", "7", "8", "9"],
    answerIndex: 2,
    explanation: "Jumlahnya 4 + 6 + 8 + 10 = 28. Rata-rata = 28 / 4 = 7.",
    subtopic: "Statistika",
  };
}

beforeEach(() => {
  localStore.clear();
  mockState.generateContent.mockReset();
  mockState.prompts.length = 0;
});

describe("generateQuestions — validation gate and regeneration", () => {
  it("returns an all-valid batch, all verified, nothing from the bank", async () => {
    mockState.generateContent.mockResolvedValue(
      aiResponse([validMath("ai-1", 1), validMath("ai-2", 2), validMath("ai-3", 3)]),
    );
    const stages: string[] = [];
    const set = await generateQuestions("matematika", 3, "tryout", undefined, {
      onProgress: (s) => stages.push(s),
    });
    expect(set.questions).toHaveLength(3);
    expect(set.questions.every((q: Question) => q.verified === true)).toBe(true);
    expect(set.fromBank).toBe(0);
    expect(set.generationFailed).toBe(false);
    expect(mockState.generateContent).toHaveBeenCalledTimes(1);
    expect(stages).toEqual(["generating"]);
    // Fresh valid questions are persisted into the runtime bank.
    expect(getBankStats("matematika").runtimeCount).toBe(3);
  });

  it("regenerates exactly once, for the shortfall only", async () => {
    mockState.generateContent
      .mockResolvedValueOnce(
        aiResponse([validMath("ai-1", 1), invalidMath("ai-2"), invalidMath("ai-3")]),
      )
      .mockResolvedValueOnce(aiResponse([validMath("ai-4", 4), validMath("ai-5", 5)]));
    const stages: string[] = [];
    const set = await generateQuestions("matematika", 3, "tryout", undefined, {
      onProgress: (s) => stages.push(s),
    });
    expect(set.questions).toHaveLength(3);
    expect(set.fromBank).toBe(0);
    expect(mockState.generateContent).toHaveBeenCalledTimes(2);
    expect(mockState.prompts[0]).toContain("Buatkan 3 soal");
    expect(mockState.prompts[1]).toContain("Buatkan 2 soal");
    expect(stages).toEqual(["generating", "regenerating"]);
  });

  it("fills from the bank when both generations are all invalid", async () => {
    mockState.generateContent
      .mockResolvedValueOnce(
        aiResponse([invalidMath("ai-1"), invalidMath("ai-2"), invalidMath("ai-3")]),
      )
      .mockResolvedValueOnce(
        aiResponse([invalidMath("ai-4"), invalidMath("ai-5"), invalidMath("ai-6")]),
      );
    const stages: string[] = [];
    const set = await generateQuestions("matematika", 3, "tryout", undefined, {
      onProgress: (s) => stages.push(s),
    });
    expect(set.questions).toHaveLength(3);
    expect(set.fromBank).toBe(3);
    expect(set.questions.every((q: Question) => q.id.startsWith("contoh-"))).toBe(true);
    expect(set.questions.every((q: Question) => q.verified === true)).toBe(true);
    expect(mockState.generateContent).toHaveBeenCalledTimes(2);
    expect(stages).toEqual(["generating", "regenerating", "bank"]);
  });
});

describe("generateQuestions — transport failure and cancellation", () => {
  it("fills from the bank on a 429 (no retry) and reports the failure", async () => {
    mockState.generateContent.mockRejectedValue(
      new Error("[429 Too Many Requests] Generate content requests per day limit exceeded"),
    );
    const set = await generateQuestions("matematika", 3, "tryout");
    expect(set.questions).toHaveLength(3);
    expect(set.fromBank).toBe(3);
    expect(set.generationFailed).toBe(true);
    expect(set.questions.every((q: Question) => q.id.startsWith("contoh-"))).toBe(true);
    // A 429 is never retried: exactly one generation attempt.
    expect(mockState.generateContent).toHaveBeenCalledTimes(1);
  });

  it("fills from the bank when the AI output cannot be parsed", async () => {
    mockState.generateContent.mockResolvedValue({
      response: { text: () => "bukan JSON sama sekali", inferenceSource: "IN_CLOUD" },
    });
    const set = await generateQuestions("matematika", 3, "tryout");
    expect(set.questions).toHaveLength(3);
    expect(set.fromBank).toBe(3);
    expect(set.generationFailed).toBe(true);
  });

  it("cancels via an external signal without calling the model", async () => {
    const controller = new AbortController();
    controller.abort();
    const set = await generateQuestions("matematika", 3, "tryout", undefined, {
      signal: controller.signal,
    });
    expect(set.questions).toHaveLength(3);
    expect(set.fromBank).toBe(3);
    expect(set.generationFailed).toBe(true);
    expect(mockState.generateContent).not.toHaveBeenCalled();
  });
});

describe("generateQuestions — provenance and unique IDs (P0-4/P0-7)", () => {
  it("marks fresh AI questions verifiedBy 'validator'", async () => {
    mockState.generateContent.mockResolvedValue(
      aiResponse([validMath("ai-1", 1), validMath("ai-2", 2)]),
    );
    const set = await generateQuestions("matematika", 2, "tryout");
    expect(set.questions).toHaveLength(2);
    expect(set.questions.every((q: Question) => q.verifiedBy === "validator")).toBe(true);
  });

  it("marks bank-filled questions verifiedBy 'audit'", async () => {
    mockState.generateContent
      .mockResolvedValueOnce(aiResponse([invalidMath("ai-1"), invalidMath("ai-2")]))
      .mockResolvedValueOnce(aiResponse([invalidMath("ai-3"), invalidMath("ai-4")]));
    const set = await generateQuestions("matematika", 2, "tryout");
    expect(set.fromBank).toBe(2);
    expect(set.questions.every((q: Question) => q.verifiedBy === "audit")).toBe(true);
  });

  it("gives two separate calls disjoint question IDs (same mock IDs in)", async () => {
    mockState.generateContent.mockResolvedValue(
      aiResponse([validMath("ai-1", 1), validMath("ai-2", 2), validMath("ai-3", 3)]),
    );
    const first = await generateQuestions("matematika", 3, "tryout");
    const second = await generateQuestions("matematika", 3, "tryout");
    const allIds = [...first.questions, ...second.questions].map((q: Question) => q.id);
    expect(new Set(allIds).size).toBe(6);
  });
});

describe("generateQuestions — bank-only subtests (P1-12)", () => {
  it("serves literasi straight from the bank without calling the model", async () => {
    const stages: string[] = [];
    const set = await generateQuestions("literasi", 5, "tryout", undefined, {
      onProgress: (s) => stages.push(s),
    });
    expect(mockState.generateContent).not.toHaveBeenCalled();
    expect(set.bankOnly).toBe(true);
    expect(set.fromBank).toBe(5);
    expect(set.inferenceSource).toBeNull();
    expect(set.questions).toHaveLength(5);
    expect(set.questions.every((q: Question) => q.id.startsWith("contoh-"))).toBe(true);
    expect(set.questions.every((q: Question) => q.verifiedBy === "audit")).toBe(true);
    expect(stages).toEqual(["bank"]);
  });

  it("serves a focused literasi drill from the bank, focus subtopics first", async () => {
    const set = await generateQuestions("literasi", 3, "drill", ["Simpulan"]);
    expect(mockState.generateContent).not.toHaveBeenCalled();
    expect(set.bankOnly).toBe(true);
    expect(set.questions).toHaveLength(3);
    expect(set.questions.every((q: Question) => q.subtopic === "Simpulan")).toBe(true);
  });
});

describe("generateQuestions — per-batch inference sources (P1-3, GPT round 2)", () => {
  // Each case: first batch yields 1 valid question (shortfall 2 triggers
  // the regeneration), second batch yields the remaining 2 — no bank
  // fill, so the reported source comes purely from the two batches.
  // The AI-question count is asserted too: the source must describe the
  // questions actually in the session, not just the mock responses.
  async function twoBatchSet(firstSource: string, secondSource: string) {
    mockState.generateContent
      .mockResolvedValueOnce(
        aiResponseWithSource(
          [validMath("ai-1", 1), invalidMath("ai-2"), invalidMath("ai-3")],
          firstSource,
        ),
      )
      .mockResolvedValueOnce(
        aiResponseWithSource([validMath("ai-4", 4), validMath("ai-5", 5)], secondSource),
      );
    const set = await generateQuestions("matematika", 3, "tryout");
    expect(set.questions).toHaveLength(3);
    expect(set.fromBank).toBe(0);
    expect(set.questions.filter((q: Question) => q.source === "ai")).toHaveLength(3);
    expect(mockState.generateContent).toHaveBeenCalledTimes(2);
    return set;
  }

  it("both batches on-device → ON_DEVICE", async () => {
    const set = await twoBatchSet("ON_DEVICE", "ON_DEVICE");
    expect(set.inferenceSource).toBe("ON_DEVICE");
  });

  it("both batches cloud → IN_CLOUD", async () => {
    const set = await twoBatchSet("IN_CLOUD", "IN_CLOUD");
    expect(set.inferenceSource).toBe("IN_CLOUD");
  });

  it("first batch on-device, second cloud → MIXED (never all-cloud)", async () => {
    const set = await twoBatchSet("ON_DEVICE", "IN_CLOUD");
    expect(set.inferenceSource).toBe("MIXED");
  });

  it("first batch cloud, second on-device → MIXED (never all-on-device)", async () => {
    const set = await twoBatchSet("IN_CLOUD", "ON_DEVICE");
    expect(set.inferenceSource).toBe("MIXED");
  });
});

describe("generateQuestions — source only from contributing batches (P0, GPT round 3)", () => {
  // Every assertion checks the AI-question COUNT in the returned set, not
  // just the mock's response source: a batch that contributes nothing must
  // not colour the session's inference source.
  function aiCount(set: { questions: Question[] }): number {
    return set.questions.filter((q: Question) => q.source === "ai").length;
  }

  it("first ON_DEVICE contributes nothing, second IN_CLOUD contributes → IN_CLOUD", async () => {
    mockState.generateContent
      .mockResolvedValueOnce(
        aiResponseWithSource(
          [invalidMath("ai-1"), invalidMath("ai-2"), invalidMath("ai-3")],
          "ON_DEVICE",
        ),
      )
      .mockResolvedValueOnce(
        aiResponseWithSource(
          [validMath("ai-4", 1), validMath("ai-5", 2), validMath("ai-6", 3)],
          "IN_CLOUD",
        ),
      );
    const set = await generateQuestions("matematika", 3, "tryout");
    expect(aiCount(set)).toBe(3);
    expect(set.fromBank).toBe(0);
    expect(set.inferenceSource).toBe("IN_CLOUD");
  });

  it("first IN_CLOUD contributes, second ON_DEVICE contributes nothing → IN_CLOUD", async () => {
    mockState.generateContent
      .mockResolvedValueOnce(
        aiResponseWithSource(
          [validMath("ai-1", 1), invalidMath("ai-2"), invalidMath("ai-3")],
          "IN_CLOUD",
        ),
      )
      .mockResolvedValueOnce(
        aiResponseWithSource([invalidMath("ai-4"), invalidMath("ai-5")], "ON_DEVICE"),
      );
    const set = await generateQuestions("matematika", 3, "tryout");
    expect(aiCount(set)).toBe(1);
    expect(set.fromBank).toBe(2);
    expect(set.inferenceSource).toBe("IN_CLOUD");
  });

  it("first IN_CLOUD contributes nothing, second ON_DEVICE contributes → ON_DEVICE", async () => {
    mockState.generateContent
      .mockResolvedValueOnce(
        aiResponseWithSource(
          [invalidMath("ai-1"), invalidMath("ai-2"), invalidMath("ai-3")],
          "IN_CLOUD",
        ),
      )
      .mockResolvedValueOnce(
        aiResponseWithSource(
          [validMath("ai-4", 1), validMath("ai-5", 2), validMath("ai-6", 3)],
          "ON_DEVICE",
        ),
      );
    const set = await generateQuestions("matematika", 3, "tryout");
    expect(aiCount(set)).toBe(3);
    expect(set.fromBank).toBe(0);
    expect(set.inferenceSource).toBe("ON_DEVICE");
  });

  it("both batches contribute nothing → bank fills all, no AI source shown", async () => {
    mockState.generateContent
      .mockResolvedValueOnce(
        aiResponseWithSource(
          [invalidMath("ai-1"), invalidMath("ai-2"), invalidMath("ai-3")],
          "ON_DEVICE",
        ),
      )
      .mockResolvedValueOnce(
        aiResponseWithSource(
          [invalidMath("ai-4"), invalidMath("ai-5"), invalidMath("ai-6")],
          "IN_CLOUD",
        ),
      );
    const set = await generateQuestions("matematika", 3, "tryout");
    expect(aiCount(set)).toBe(0);
    expect(set.fromBank).toBe(3);
    expect(set.inferenceSource).toBeNull();
    // The display rule agrees: a seed-only session shows no AI source.
    expect(sessionInferenceSource(set.questions, set.inferenceSource)).toBeNull();
  });
});
