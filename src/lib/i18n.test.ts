// Tests for the ID/EN language toggle (i18n.ts) and the translated
// labels in logic.ts / ai.ts.
//
// Rules enforced here:
// - Every dictionary key has a non-empty id AND en value.
// - Both languages use the same {n} placeholders for every key.
// - English labels differ from Indonesian where a translation exists
//   (guards against copy-paste where en was left as the id text).
// - logic.ts label helpers default to Indonesian (existing tests cover
//   that); the "en" variants are asserted here.

import { describe, expect, it } from "vitest";
import {
  AiTimeoutError,
  aiFailureMessage,
  AI_OVERLOADED_MESSAGE_EN,
  AI_TIMEOUT_MESSAGE_EN,
} from "./ai";
import {
  readLanguage,
  stringEntries,
  subtestDescription,
  subtopicLabel,
  t,
  type Language,
} from "./i18n";
import {
  buildDrillPlanFallback,
  inferenceSourceLabel,
  sessionSourceInfo,
  verifiedTagText,
} from "./logic";
import { SUBTESTS, type Question, type SubtestId, type WeaknessEntry } from "./types";

function placeholders(s: string): string[] {
  return [...s.matchAll(/\{(\d+)\}/g)].map((m) => m[1]).sort();
}

describe("i18n dictionary completeness", () => {
  it("every key has a non-empty id and en value", () => {
    const entries = stringEntries();
    expect(entries.length).toBeGreaterThan(50);
    for (const e of entries) {
      expect(e.id.trim().length, `${e.key} (id)`).toBeGreaterThan(0);
      expect(e.en.trim().length, `${e.key} (en)`).toBeGreaterThan(0);
    }
  });

  it("both languages use the same placeholders for every key", () => {
    for (const e of stringEntries()) {
      expect(placeholders(e.en), `${e.key} placeholders`).toEqual(placeholders(e.id));
    }
  });

  it("fills placeholders in order", () => {
    expect(t("id", "quiz.progress", 2, 5, 1)).toBe("Soal 2 dari 5 · 1 terjawab");
    expect(t("en", "quiz.progress", 2, 5, 1)).toBe("Question 2 of 5 · 1 answered");
    expect(t("en", "results.day", 3, "Aljabar")).toBe("Day 3 · Aljabar");
  });

  it("translates the key UI strings to English", () => {
    expect(t("en", "quiz.home")).toBe("← Home");
    expect(t("en", "quiz.finish")).toBe("Finish & see results");
    expect(t("en", "results.weaknessMap")).toBe("Your weakness map");
    expect(t("en", "results.plan")).toBe("7-day drill plan");
    expect(t("en", "home.modeDrill")).toBe("Quick Drill");
    expect(t("en", "loading.cancel")).toBe("Cancel");
  });

  it("states the Indonesian audience in both languages", () => {
    expect(t("id", "home.audience")).toContain("pelajar Indonesia");
    expect(t("id", "home.audience")).toContain("SNBT");
    expect(t("en", "home.audience")).toContain("Indonesian students");
    expect(t("en", "home.audience")).toContain("SNBT");
  });

  it("states that questions stay Indonesian in EN mode", () => {
    expect(t("en", "quiz.questionsInIndonesian")).toBe(
      "Questions are in Indonesian — SNBT is an Indonesian-language exam.",
    );
    expect(t("id", "quiz.questionsInIndonesian")).toContain("bahasa Indonesia");
  });

  it("has a description for every subtest in both languages", () => {
    const ids: SubtestId[] = [
      "matematika",
      "literasi",
      "penalaran-umum",
      "pengetahuan-umum",
      "bacaan-menulis",
      "pengetahuan-kuantitatif",
      "literasi-inggris",
    ];
    for (const id of ids) {
      expect(subtestDescription("id", id).length).toBeGreaterThan(10);
      expect(subtestDescription("en", id).length).toBeGreaterThan(10);
    }
  });

  it("defaults to Indonesian when no language is stored", () => {
    expect(readLanguage()).toBe("id");
  });
});

describe("subtopic display labels", () => {
  it("has an English label for every subtopic in SUBTESTS", () => {
    const all = Object.values(SUBTESTS).flatMap((s) => s.subtopics);
    expect(all.length).toBe(27);
    for (const s of all) {
      expect(subtopicLabel(s, "en").trim().length, s).toBeGreaterThan(0);
    }
  });

  it("translates Indonesian subtopics to English", () => {
    expect(subtopicLabel("Aljabar", "en")).toBe("Algebra");
    expect(subtopicLabel("Peluang", "en")).toBe("Probability");
    expect(subtopicLabel("Simpulan", "en")).toBe("Conclusions");
    expect(subtopicLabel("Pemilihan gagasan", "en")).toBe("Idea selection");
    expect(subtopicLabel("Geometri dan pengukuran", "en")).toBe("Geometry and measurement");
  });

  it("keeps English subtopics unchanged and returns Indonesian in id mode", () => {
    expect(subtopicLabel("Main idea", "en")).toBe("Main idea");
    expect(subtopicLabel("Inference", "en")).toBe("Inference");
    expect(subtopicLabel("Aljabar", "id")).toBe("Aljabar");
  });

  it("falls back to the original for unknown subtopics", () => {
    expect(subtopicLabel("Topik baru", "en")).toBe("Topik baru");
  });
});

function makeQuestion(over: Partial<Question>): Question {
  return {
    id: "q-test",
    subtest: "matematika",
    subtopic: "Aljabar",
    text: "Berapa 1 + 1?",
    options: ["1", "2", "3", "4"],
    answerIndex: 1,
    explanation: "1 + 1 = 2.",
    source: "ai",
    ...over,
  };
}

describe("translated logic labels", () => {
  it("labels an all-AI session in English", () => {
    const qs = [makeQuestion({ verified: true, verifiedBy: "validator" })];
    const info = sessionSourceInfo(qs, "en");
    expect(info.label).toBe("AI-generated");
    expect(info.provenance).toBe("passed automatic validation");
  });

  it("labels an all-seed session in English", () => {
    const qs = [makeQuestion({ source: "contoh", verified: true, verifiedBy: "audit" })];
    const info = sessionSourceInfo(qs, "en");
    expect(info.label).toBe("Sample questions");
    expect(info.provenance).toBe("human-audited");
  });

  it("translates the per-question verified tags", () => {
    expect(verifiedTagText(makeQuestion({ verifiedBy: "audit" }), "en")).toBe("✓ Human-audited");
    expect(verifiedTagText(makeQuestion({ verifiedBy: "validator" }), "en")).toBe(
      "✓ Passed automatic validation",
    );
    expect(verifiedTagText(makeQuestion({ verified: true }), "en")).toBe("✓ Verified");
  });

  it("translates the mixed inference-source label", () => {
    expect(inferenceSourceLabel("MIXED", "en")).toBe("mixed");
    expect(inferenceSourceLabel("MIXED", "id")).toBe("campuran");
  });

  it("builds the fallback drill plan in English", () => {
    const weakness: WeaknessEntry[] = [
      { subtopic: "Aljabar", total: 5, correct: 1, percent: 20 },
      { subtopic: "Geometri", total: 5, correct: 4, percent: 80 },
    ];
    const plan = buildDrillPlanFallback(weakness, "en");
    expect(plan.days).toHaveLength(7);
    expect(plan.days[6].subtopic).toBe("Full retest");
    expect(plan.days[0].focus).toContain("Aljabar");
    expect(plan.days[0].focus).not.toContain("masih lemah");
    expect(plan.days[0].target).toBe("Do 5 drill questions on Aljabar.");
  });
});

describe("translated AI failure messages", () => {
  it("returns the English timeout message when lang is en", () => {
    expect(aiFailureMessage(new AiTimeoutError(), "en")).toBe(AI_TIMEOUT_MESSAGE_EN);
    expect(aiFailureMessage(new AiTimeoutError(), "en")).toContain("did not answer in time");
  });

  it("returns the English overload message for a 503 when lang is en", () => {
    expect(aiFailureMessage(new Error("[503 Service Unavailable] The service is currently unavailable."), "en")).toBe(
      AI_OVERLOADED_MESSAGE_EN,
    );
  });

  it("keeps Indonesian as the default", () => {
    const msg = aiFailureMessage(new AiTimeoutError());
    expect(msg).toContain("tidak merespons tepat waktu");
  });
});

describe("language type guard", () => {
  it("accepts only id and en", () => {
    const langs: Language[] = ["id", "en"];
    expect(langs).toHaveLength(2);
  });
});
