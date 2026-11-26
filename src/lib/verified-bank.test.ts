// Tests for the Verified Question Bank (verified-bank.ts).
//
// The bank's invariant: only VALID questions may enter, and only verified
// questions may be served. The static seed is the 100 hand-written samples
// that passed the 2026-11-26 audit; the runtime layer is localStorage
// (cap 200) for validator-approved AI questions.
import { beforeEach, describe, expect, it } from "vitest";
import { SAMPLE_QUESTIONS } from "./sample-questions";
import type { Question, SubtestId } from "./types";
import {
  VERIFIED_BANK_RUNTIME_CAP,
  VERIFIED_BANK_STORAGE_KEY,
  VALIDATOR_VERSION,
  addVerified,
  clearRuntimeBank,
  getBankStats,
  getVerifiedFor,
  insertVerifiedEntry,
} from "./verified-bank";
import type { VerifiedBankEntry, VerifiedBankMeta } from "./verified-bank";
import { VERIFIED_SAMPLE_IDS } from "./verified-sample-ids";

// Minimal browser stub: vitest runs in Node, where `window` does not exist.
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

beforeEach(() => {
  localStore.clear();
});

const VALID_MATH: Question = {
  id: "bank-test-valid-1",
  subtest: "matematika",
  subtopic: "Statistika",
  text: "Rata-rata dari 4, 6, 8, dan 10 adalah berapa?",
  options: ["6", "7", "8", "9"],
  answerIndex: 1,
  explanation: "Jumlahnya 4 + 6 + 8 + 10 = 28. Rata-rata = 28 / 4 = 7.",
  source: "ai",
};

const INVALID_MATH: Question = {
  ...VALID_MATH,
  id: "bank-test-invalid-1",
  // Key says 8, but the explanation itself derives 7.
  answerIndex: 2,
};

const INCONCLUSIVE_LITERACY: Question = {
  id: "bank-test-lit-1",
  subtest: "literasi",
  subtopic: "Simpulan",
  text: "Bacalah teks berikut dengan saksama. Berdasarkan teks tersebut, manakah simpulan yang paling tepat?",
  options: ["A", "B", "C", "D"],
  answerIndex: 0,
  explanation: "Pembahasan yang cukup panjang untuk lolos batas minimal karakter.",
  source: "ai",
};

function entryFor(i: number): VerifiedBankEntry {
  return {
    question: {
      ...VALID_MATH,
      id: `bank-cap-${i}`,
      text: `Soal cap ke-${i} dengan teks yang cukup panjang untuk lolos struktur.`,
    },
    meta: {
      subtest: "matematika",
      difficulty: "SNBT",
      generator: "gemini-3.8-flash",
      validationStatus: "VALID",
      validatedAt: "2026-11-26",
      validatorVersion: 1,
    },
  };
}

const SUBTEST_BY_PREFIX: Record<string, SubtestId> = {
  mat: "matematika",
  lit: "literasi",
  pu: "penalaran-umum",
  ppu: "pengetahuan-umum",
  pk: "pengetahuan-kuantitatif",
  pbm: "bacaan-menulis",
  le: "literasi-inggris",
};

describe("verified bank — static seed (2026-11-26 audit)", () => {
  it("contains exactly the 100 audited sample IDs", () => {
    expect(VERIFIED_SAMPLE_IDS).toHaveLength(100);
    expect(new Set(VERIFIED_SAMPLE_IDS).size).toBe(100);
  });

  it("every seed ID resolves to a real sample question with the matching subtest", () => {
    const byId = new Map(SAMPLE_QUESTIONS.map((q) => [q.id, q]));
    for (const id of VERIFIED_SAMPLE_IDS) {
      const question = byId.get(id);
      expect(question, `seed ID ${id} must exist in SAMPLE_QUESTIONS`).toBeDefined();
      const prefix = id.replace("contoh-", "").replace(/-\d+$/, "");
      expect(question?.subtest).toBe(SUBTEST_BY_PREFIX[prefix]);
    }
  });

  it("serves the full audited seed per subtest (15/15/14/14/14/14/14)", () => {
    expect(getVerifiedFor("matematika", 15)).toHaveLength(15);
    expect(getVerifiedFor("literasi", 15)).toHaveLength(15);
    expect(getVerifiedFor("penalaran-umum", 14)).toHaveLength(14);
    expect(getVerifiedFor("pengetahuan-umum", 14)).toHaveLength(14);
    expect(getVerifiedFor("pengetahuan-kuantitatif", 14)).toHaveLength(14);
    expect(getVerifiedFor("bacaan-menulis", 14)).toHaveLength(14);
    expect(getVerifiedFor("literasi-inggris", 14)).toHaveLength(14);
  });

  it("marks every served seed question verified: true", () => {
    for (const q of getVerifiedFor("matematika", 15)) {
      expect(q.verified).toBe(true);
    }
  });
});

describe("verified bank — addVerified (single write path)", () => {
  it("accepts a VALID question and makes it servable", () => {
    expect(addVerified(VALID_MATH, { generator: "gemini-3.8-flash", difficulty: "SNBT" })).toBe(
      true,
    );
    expect(getBankStats("matematika").runtimeCount).toBe(1);
    const served = getVerifiedFor("matematika", 16);
    expect(served.some((q) => q.id === VALID_MATH.id)).toBe(true);
  });

  it("refuses an INVALID question (key contradicts its own explanation)", () => {
    expect(addVerified(INVALID_MATH, { generator: "gemini-3.8-flash", difficulty: "SNBT" })).toBe(
      false,
    );
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });

  it("refuses an INCONCLUSIVE question (literacy key cannot be verified)", () => {
    expect(
      addVerified(INCONCLUSIVE_LITERACY, { generator: "gemini-3.8-flash", difficulty: "SNBT" }),
    ).toBe(false);
    expect(getBankStats("literasi").runtimeCount).toBe(0);
  });

  it("refuses a duplicate of a question already in the bank (same text, new id)", () => {
    expect(addVerified(VALID_MATH, { generator: "gemini-3.8-flash", difficulty: "SNBT" })).toBe(
      true,
    );
    expect(
      addVerified(
        { ...VALID_MATH, id: "bank-test-valid-1-copy" },
        { generator: "gemini-3.8-flash", difficulty: "SNBT" },
      ),
    ).toBe(false);
    expect(getBankStats("matematika").runtimeCount).toBe(1);
  });
});

describe("verified bank — cap and eviction", () => {
  it("keeps at most 200 runtime entries and evicts the oldest first", () => {
    let entries: VerifiedBankEntry[] = [];
    for (let i = 0; i < VERIFIED_BANK_RUNTIME_CAP + 1; i++) {
      const { entries: next } = insertVerifiedEntry(entries, entryFor(i));
      entries = next;
    }
    expect(entries).toHaveLength(VERIFIED_BANK_RUNTIME_CAP);
    expect(entries[0].question.id).toBe("bank-cap-1");
    expect(entries[entries.length - 1].question.id).toBe(`bank-cap-${VERIFIED_BANK_RUNTIME_CAP}`);
  });

  it("refuses a duplicate insert without growing the list", () => {
    const first = insertVerifiedEntry([], entryFor(0));
    expect(first.inserted).toBe(true);
    const second = insertVerifiedEntry(first.entries, entryFor(0));
    expect(second.inserted).toBe(false);
    expect(second.entries).toHaveLength(1);
  });
});

describe("verified bank — serving", () => {
  it("never serves the same question twice in one session", () => {
    const first = getVerifiedFor("matematika", 10);
    expect(first).toHaveLength(10);
    const second = getVerifiedFor("matematika", 10, new Set(first.map((q) => q.id)));
    expect(second).toHaveLength(5);
    const overlap = first.filter((q) => second.some((s) => s.id === q.id));
    expect(overlap).toHaveLength(0);
  });

  it("returns only the requested subtest", () => {
    for (const q of getVerifiedFor("literasi-inggris", 14)) {
      expect(q.subtest).toBe("literasi-inggris");
    }
  });

  it("returns fewer than requested when the bank is short, never unvalidated", () => {
    const served = getVerifiedFor("penalaran-umum", 20);
    expect(served).toHaveLength(14);
    expect(served.every((q) => q.verified === true)).toBe(true);
  });

  it("returns nothing when every bank question is already excluded (bank empty for the session)", () => {
    const allSeedIds = new Set(getVerifiedFor("matematika", 15).map((q) => q.id));
    expect(getVerifiedFor("matematika", 5, allSeedIds)).toHaveLength(0);
  });

  it("clearRuntimeBank empties the runtime layer but keeps the seed", () => {
    addVerified(VALID_MATH, { generator: "gemini-3.8-flash", difficulty: "SNBT" });
    expect(getBankStats().runtimeCount).toBe(1);
    clearRuntimeBank();
    expect(getBankStats()).toEqual({ seedCount: 100, runtimeCount: 0, total: 100 });
    expect(getVerifiedFor("matematika", 15)).toHaveLength(15);
  });
});

// --- Targeted-fix tests (GPT review 2026-11-26) ---------------------------

describe("verified bank — provenance (P0-4)", () => {
  it("serves seed questions with verifiedBy 'audit'", () => {
    for (const q of getVerifiedFor("matematika", 15)) {
      expect(q.verifiedBy).toBe("audit");
    }
  });

  it("serves runtime entries with verifiedBy 'validator'", () => {
    addVerified(VALID_MATH, { generator: "gemini-3.8-flash", difficulty: "SNBT" });
    const served = getVerifiedFor("matematika", 16);
    expect(served.find((q) => q.id === VALID_MATH.id)?.verifiedBy).toBe("validator");
  });

  it("normalizes a stored entry claiming 'audit' to 'validator'", () => {
    const raw = [
      {
        question: { ...VALID_MATH, verifiedBy: "audit" },
        meta: {
          subtest: "matematika",
          difficulty: "SNBT",
          generator: "gemini-3.8-flash",
          validationStatus: "VALID",
          validatedAt: "2026-11-26",
          validatorVersion: 1,
        },
      },
    ];
    localStore.set(VERIFIED_BANK_STORAGE_KEY, JSON.stringify(raw));
    const served = getVerifiedFor("matematika", 16);
    expect(served.find((q) => q.id === VALID_MATH.id)?.verifiedBy).toBe("validator");
  });
});

describe("verified bank — load guard (P0-5/P0-8/P0-10)", () => {
  function rawEntry(overrides: {
    question?: Partial<Question>;
    meta?: Partial<VerifiedBankMeta>;
  } = {}) {
    return {
      question: { ...VALID_MATH, ...overrides.question },
      meta: {
        subtest: "matematika",
        difficulty: "SNBT",
        generator: "gemini-3.8-flash",
        validationStatus: "VALID",
        validatedAt: "2026-11-26",
        validatorVersion: 1,
        ...overrides.meta,
      },
    };
  }
  function seedRaw(entries: unknown[]) {
    localStore.set(VERIFIED_BANK_STORAGE_KEY, JSON.stringify(entries));
  }

  it("discards a stored entry whose options are not an array", () => {
    seedRaw([rawEntry({ question: { options: "bukan array" as unknown as string[] } })]);
    expect(getBankStats("matematika").runtimeCount).toBe(0);
    expect(getVerifiedFor("matematika", 16).some((q) => q.id === VALID_MATH.id)).toBe(false);
  });

  it("discards a stored entry whose answerIndex is out of range", () => {
    seedRaw([rawEntry({ question: { answerIndex: 99 } })]);
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });

  it("discards a stored entry whose subtopic does not belong to the subtest", () => {
    seedRaw([rawEntry({ question: { subtopic: "Simpulan" } })]);
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });

  it("discards a stored entry with validatorVersion 0, serves version 1", () => {
    seedRaw([
      rawEntry({ question: { id: "bank-v0" }, meta: { validatorVersion: 0 } }),
      rawEntry({ question: { id: "bank-v1" }, meta: { validatorVersion: 1 } }),
    ]);
    const served = getVerifiedFor("matematika", 16);
    expect(served.some((q) => q.id === "bank-v0")).toBe(false);
    expect(served.some((q) => q.id === "bank-v1")).toBe(true);
    expect(VALIDATOR_VERSION).toBe(1);
  });

  it("discards a stored entry claiming an unknown generator", () => {
    seedRaw([rawEntry({ meta: { generator: "human-audit" } })]);
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });

  it("discards a stored entry with a non-VALID validationStatus", () => {
    seedRaw([
      rawEntry({ meta: { validationStatus: "INVALID" as unknown as "VALID" } }),
    ]);
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });

  it("falls back to the seed only when the stored JSON is corrupt", () => {
    localStore.set(VERIFIED_BANK_STORAGE_KEY, "{not json");
    expect(() => getVerifiedFor("matematika", 15)).not.toThrow();
    expect(getVerifiedFor("matematika", 15)).toHaveLength(15);
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });

  it("falls back to the seed only when the stored value is not an array", () => {
    localStore.set(VERIFIED_BANK_STORAGE_KEY, JSON.stringify({ not: "an array" }));
    expect(getVerifiedFor("matematika", 15)).toHaveLength(15);
  });
});

describe("verified bank — addVerified storage failure (P0-6)", () => {
  it("returns false when the write throws (storage full)", () => {
    const ls = (
      globalThis as unknown as {
        localStorage: { setItem: (k: string, v: string) => void };
      }
    ).localStorage;
    const original = ls.setItem;
    ls.setItem = () => {
      throw new Error("QuotaExceededError");
    };
    try {
      expect(
        addVerified(VALID_MATH, { generator: "gemini-3.8-flash", difficulty: "SNBT" }),
      ).toBe(false);
    } finally {
      ls.setItem = original;
    }
    // Nothing was persisted.
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });
});

describe("verified bank — same ID, different text (P0-7)", () => {
  it("refuses a second question that reuses an existing ID with different text", () => {
    expect(
      addVerified(VALID_MATH, { generator: "gemini-3.8-flash", difficulty: "SNBT" }),
    ).toBe(true);
    expect(
      addVerified(
        { ...VALID_MATH, text: "Soal lain dengan teks berbeda yang cukup panjang." },
        { generator: "gemini-3.8-flash", difficulty: "SNBT" },
      ),
    ).toBe(false);
    expect(getBankStats("matematika").runtimeCount).toBe(1);
  });

  it("insertVerifiedEntry refuses same-ID-different-text without growing the list", () => {
    const first = insertVerifiedEntry([], entryFor(0));
    expect(first.inserted).toBe(true);
    const second = insertVerifiedEntry(first.entries, {
      ...entryFor(0),
      question: { ...entryFor(0).question, text: "Teks berbeda, ID sama." },
    });
    expect(second.inserted).toBe(false);
    expect(second.entries).toHaveLength(1);
  });
});

describe("verified bank — provenance allowlist (P0-10)", () => {
  it("refuses addVerified with a generator outside the allowlist", () => {
    expect(
      addVerified(VALID_MATH, { generator: "human-audit", difficulty: "SNBT" }),
    ).toBe(false);
    expect(
      addVerified(VALID_MATH, { generator: "gemini-1.5-flash", difficulty: "SNBT" }),
    ).toBe(false);
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });

  it("refuses addVerified with a difficulty outside the allowlist", () => {
    expect(
      addVerified(VALID_MATH, { generator: "gemini-3.8-flash", difficulty: "hard" }),
    ).toBe(false);
    expect(getBankStats("matematika").runtimeCount).toBe(0);
  });
});

describe("verified bank — focus subtopics (P1-11)", () => {
  // Matematika seed: 5 subtopics x 3 questions each.
  it("serves focus-subtopic questions first (all 3 Statistika before anything else)", () => {
    const served = getVerifiedFor("matematika", 3, new Set(), ["Statistika"]);
    expect(served).toHaveLength(3);
    expect(served.every((q) => q.subtopic === "Statistika")).toBe(true);
  });

  it("fills with other subtopics only after the focus pool is exhausted", () => {
    const served = getVerifiedFor("matematika", 5, new Set(), ["Statistika"]);
    expect(served.slice(0, 3).every((q) => q.subtopic === "Statistika")).toBe(true);
    expect(served.slice(3).every((q) => q.subtopic !== "Statistika")).toBe(true);
  });

  it("behaves like the unfocused pool when no focus is given", () => {
    expect(getVerifiedFor("matematika", 15)).toHaveLength(15);
  });
});
