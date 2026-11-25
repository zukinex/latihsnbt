// Tests for the verified sample-question bank (src/lib/sample-questions.ts)
// and the shuffled-subset selection in src/lib/ai.ts (sampleSet).
import { describe, expect, it } from "vitest";
import { sampleSet } from "./ai";
import { SAMPLE_QUESTIONS, sampleQuestionsFor } from "./sample-questions";
import { SUBTESTS, type SubtestId } from "./types";

describe("sample question bank", () => {
  it("has 30 questions, 15 per subtest", () => {
    expect(SAMPLE_QUESTIONS).toHaveLength(30);
    expect(sampleQuestionsFor("matematika")).toHaveLength(15);
    expect(sampleQuestionsFor("literasi")).toHaveLength(15);
  });

  it("has exactly 3 questions per subtopic per subtest", () => {
    (Object.keys(SUBTESTS) as SubtestId[]).forEach((st) => {
      for (const topic of SUBTESTS[st].subtopics) {
        const n = sampleQuestionsFor(st).filter((q) => q.subtopic === topic).length;
        expect(n).toBe(3);
      }
    });
  });

  it("has unique ids, valid answerIndex, 4-5 options, explanations, source contoh", () => {
    const ids = new Set<string>();
    for (const q of SAMPLE_QUESTIONS) {
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(q.options.length).toBeLessThanOrEqual(5);
      expect(q.answerIndex).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex).toBeLessThan(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(0);
      expect(q.text.length).toBeGreaterThan(0);
      expect(q.source).toBe("contoh");
      expect(SUBTESTS[q.subtest].subtopics).toContain(q.subtopic);
    }
  });

  it("spreads correct answers across option positions", () => {
    const counts = [0, 0, 0, 0, 0];
    for (const q of SAMPLE_QUESTIONS) counts[q.answerIndex] += 1;
    // No position holds more than a third of the keys.
    for (const c of counts) expect(c).toBeLessThanOrEqual(10);
    expect(counts[4]).toBeGreaterThan(0);
  });
});

describe("sampleSet", () => {
  it("returns a shuffled subset of the requested count", () => {
    const set = sampleSet("matematika", 5);
    expect(set.questions).toHaveLength(5);
    expect(set.inferenceSource).toBeNull();
    const ids = new Set(set.questions.map((q) => q.id));
    expect(ids.size).toBe(5);
  });

  it("returns all 15 questions for a tryout", () => {
    expect(sampleSet("literasi", 15).questions).toHaveLength(15);
  });

  it("returns at most the available questions when count exceeds the bank", () => {
    expect(sampleSet("matematika", 99).questions).toHaveLength(15);
  });

  it("varies the selection across calls (does not always show the same first 5)", () => {
    const firstIds = new Set<string>();
    for (let i = 0; i < 20; i++) {
      firstIds.add(sampleSet("matematika", 5).questions[0].id);
    }
    expect(firstIds.size).toBeGreaterThan(1);
  });

  it("puts the focus subtopic first for per-topic drills", () => {
    const set = sampleSet("matematika", 5, ["Peluang"]);
    expect(set.questions.slice(0, 3).every((q) => q.subtopic === "Peluang")).toBe(true);
    expect(set.questions).toHaveLength(5);
  });
});
