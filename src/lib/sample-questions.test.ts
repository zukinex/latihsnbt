// Tests for the verified sample-question bank (src/lib/sample-questions.ts)
// and the shuffled-subset selection in src/lib/ai.ts (sampleSet).
import { describe, expect, it } from "vitest";
import { sampleSet } from "./ai";
import { SAMPLE_QUESTIONS, sampleQuestionsFor } from "./sample-questions";
import { SUBTESTS, type SubtestId } from "./types";

describe("sample question bank", () => {
  it("has 100 questions: 15 for the two original subtests, 14 for the five newer ones", () => {
    expect(SAMPLE_QUESTIONS).toHaveLength(100);
    expect(sampleQuestionsFor("matematika")).toHaveLength(15);
    expect(sampleQuestionsFor("literasi")).toHaveLength(15);
    expect(sampleQuestionsFor("penalaran-umum")).toHaveLength(14);
    expect(sampleQuestionsFor("pengetahuan-umum")).toHaveLength(14);
    expect(sampleQuestionsFor("bacaan-menulis")).toHaveLength(14);
    expect(sampleQuestionsFor("pengetahuan-kuantitatif")).toHaveLength(14);
    expect(sampleQuestionsFor("literasi-inggris")).toHaveLength(14);
  });

  it("covers each subtopic the expected number of times", () => {
    const expected: Record<SubtestId, Record<string, number>> = {
      matematika: {
        "Fungsi dan pertumbuhan": 3,
        Peluang: 3,
        Optimasi: 3,
        "Barisan dan deret": 3,
        Statistika: 3,
      },
      literasi: {
        Simpulan: 3,
        "Sikap penulis": 3,
        "Evaluasi argumen": 3,
        "Struktur teks": 3,
        Inferensi: 3,
      },
      "penalaran-umum": { Induktif: 5, Deduktif: 5, Kuantitatif: 4 },
      "pengetahuan-umum": { Leksikal: 5, "Informasi umum": 5, "Pengetahuan umum": 4 },
      "bacaan-menulis": {
        "Pemilihan gagasan": 5,
        "Penataan gagasan": 5,
        "Perbaikan gagasan": 4,
      },
      "pengetahuan-kuantitatif": {
        Bilangan: 4,
        Aljabar: 4,
        "Geometri dan pengukuran": 3,
        "Data dan peluang": 3,
      },
      "literasi-inggris": {
        "Main idea": 4,
        Inference: 4,
        "Vocabulary in context": 3,
        "Author's purpose": 3,
      },
    };
    (Object.keys(SUBTESTS) as SubtestId[]).forEach((st) => {
      for (const [topic, n] of Object.entries(expected[st])) {
        expect(sampleQuestionsFor(st).filter((q) => q.subtopic === topic)).toHaveLength(n);
      }
      // every subtopic in the registry is covered by the bank
      for (const topic of SUBTESTS[st].subtopics) {
        expect(expected[st][topic]).toBeGreaterThan(0);
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
    for (const c of counts) expect(c).toBeLessThanOrEqual(33);
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

  it("returns 14 questions for a new-subtest tryout (bank smaller than 15, no error)", () => {
    expect(sampleSet("penalaran-umum", 15).questions).toHaveLength(14);
    expect(sampleSet("literasi-inggris", 15).questions).toHaveLength(14);
  });

  it("returns 5 drill questions for a new subtest", () => {
    expect(sampleSet("bacaan-menulis", 5).questions).toHaveLength(5);
  });

  it("returns at most the available questions when count exceeds the bank", () => {
    expect(sampleSet("matematika", 99).questions).toHaveLength(15);
    expect(sampleSet("penalaran-umum", 99).questions).toHaveLength(14);
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
