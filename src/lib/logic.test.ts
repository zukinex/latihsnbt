// Tests for src/lib/logic.ts — scoring, weakness map, drill plan,
// timer helpers, and strict validation of AI-generated question JSON.
import { describe, expect, it } from "vitest";
import {
  buildDrillPlanFallback,
  computeWeaknessMap,
  formatDuration,
  parseGeneratedQuestions,
  parseGeneratedQuestionsText,
  remainingSeconds,
  scoreSession,
  shuffle,
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
