// Tests for sampleSet (ai.ts) provenance marking (P0-9).
//
// The audited seed list is mocked to just two IDs, so this file can prove
// the rule: only questions whose ID is in VERIFIED_SAMPLE_IDS are marked
// verified ("audit"); every other served sample stays unverified — even
// though the sample file itself is unchanged.
//
// The mock lives in its own file because mocking verified-sample-ids inside
// ai-generation.test.ts would shrink the bank seed for those tests too.
import { describe, expect, it, vi } from "vitest";

vi.mock("./verified-sample-ids", () => ({
  VERIFIED_SAMPLE_IDS: ["contoh-mat-1", "contoh-mat-2"],
}));

vi.mock("firebase/ai", () => ({
  getAI: () => ({}),
  GoogleAIBackend: class {},
  InferenceMode: {
    PREFER_ON_DEVICE: "PREFER_ON_DEVICE",
    PREFER_IN_CLOUD: "PREFER_IN_CLOUD",
    ONLY_IN_CLOUD: "ONLY_IN_CLOUD",
  },
  Schema: {
    object: () => ({}),
    array: () => ({}),
    string: () => ({}),
    number: () => ({}),
  },
  getGenerativeModel: () => ({ generateContent: async () => ({}) }),
}));

vi.mock("./firebase", () => ({ getFirebaseApp: () => ({}) }));

import { sampleSet } from "./ai";
import type { Question } from "./types";

describe("sampleSet — verified marking follows VERIFIED_SAMPLE_IDS only (P0-9)", () => {
  it("marks exactly the listed IDs verified with provenance 'audit'", () => {
    const set = sampleSet("matematika", 15);
    expect(set.questions).toHaveLength(15);
    for (const q of set.questions) {
      if (q.id === "contoh-mat-1" || q.id === "contoh-mat-2") {
        expect(q.verified).toBe(true);
        expect(q.verifiedBy).toBe("audit");
      } else {
        expect(q.verified).toBe(false);
        expect(q.verifiedBy).toBeUndefined();
      }
    }
  });

  it("never marks a question verified when it is not in the seed list", () => {
    // Run several shuffles: the rule must hold regardless of which
    // questions the shuffle picks.
    for (let i = 0; i < 5; i++) {
      const set = sampleSet("matematika", 5);
      const verified = set.questions.filter((q: Question) => q.verified === true);
      expect(verified.every((q: Question) => ["contoh-mat-1", "contoh-mat-2"].includes(q.id))).toBe(
        true,
      );
    }
  });
});
