// Verified Question Bank — the only source of fallback questions.
//
// Two layers, never mixed with unvalidated questions:
//   A. Static seed: the 170 hand-written sample questions that passed audit
//      (100 batch 1 on 2026-11-26 + 70 batch 2 on 2026-11-28;
//      VERIFIED_SAMPLE_IDS -> SAMPLE_QUESTIONS).
//      The sample file itself is never modified; removing an ID from the
//      seed list is how a question leaves the bank.
//   B. Runtime cache: localStorage `latihsnbt-verified-bank-v1`, capped at
//      200 entries (oldest evicted first), holding AI questions that passed
//      the deterministic validator. Per-device only (same limit as the
//      progress storage in storage.ts).
//
// Single write path: addVerified() re-runs the validator and refuses
// anything that is not VALID. The bank therefore cannot contain an
// unvalidated question even if a caller passes one by mistake.
//
// Serving (getVerifiedFor) shuffles the combined pool (seed + runtime),
// never repeats a question within one session (excludeIds), and marks
// every served question `verified: true` for the UI badge.

import { shuffle } from "./logic";
import { SAMPLE_QUESTIONS } from "./sample-questions";
import { Question, SUBTESTS, SubtestId } from "./types";
import { isStructurallyValid, validateQuestion } from "./validation";
import { VERIFIED_SAMPLE_IDS } from "./verified-sample-ids";

export const VERIFIED_BANK_STORAGE_KEY = "latihsnbt-verified-bank-v1";
export const VERIFIED_BANK_RUNTIME_CAP = 200;
/** 0 = human audit (the 2026-11-26 sample audit); >= 1 = validator version. */
export const VALIDATOR_VERSION = 1;
/** The only generator names the bank accepts. Anything else (e.g. a caller
 *  claiming "human-audit") is refused, so provenance metadata cannot be
 *  faked by the caller. */
export const VERIFIED_BANK_GENERATORS = ["gemini-3.8-flash", "gemini-4-hydrogen"] as const;
/** The only difficulty labels the bank accepts. */
export const VERIFIED_BANK_DIFFICULTIES = ["SNBT", "unknown"] as const;

export interface VerifiedBankMeta {
  /** Category of the question (its subtest). */
  subtest: SubtestId;
  /** Difficulty label; "unknown" for the hand-written seed (no label). */
  difficulty: string;
  /** What generated the question, e.g. "gemini-3.8-flash" or the audit tag. */
  generator: string;
  validationStatus: "VALID";
  validatedAt: string;
  validatorVersion: number;
}

export interface VerifiedBankEntry {
  question: Question;
  meta: VerifiedBankMeta;
}

export interface VerifiedBankStats {
  seedCount: number;
  runtimeCount: number;
  total: number;
}

/** Dedup key: same subtest + same normalized question text = same question. */
export function dedupKey(question: Question): string {
  return `${question.subtest}|${question.text.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

/**
 * Pure insert: returns the new list, or the unchanged list when the entry
 * is a duplicate. Evicts the oldest entries when the list exceeds the cap.
 */
export function insertVerifiedEntry(
  entries: VerifiedBankEntry[],
  entry: VerifiedBankEntry,
  cap: number = VERIFIED_BANK_RUNTIME_CAP,
): { entries: VerifiedBankEntry[]; inserted: boolean } {
  const key = dedupKey(entry.question);
  if (entries.some((e) => dedupKey(e.question) === key)) {
    return { entries, inserted: false };
  }
  // Same ID, different question: the serve path dedups by ID (seen-set), so
  // the second entry would never be served and would only eat cap space.
  // Refuse it here instead of storing an unreachable entry.
  if (entries.some((e) => e.question.id === entry.question.id)) {
    return { entries, inserted: false };
  }
  const next = [...entries, entry];
  while (next.length > cap) next.shift();
  return { entries: next, inserted: true };
}

function loadRuntimeEntries(): VerifiedBankEntry[] {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(VERIFIED_BANK_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is VerifiedBankEntry => {
        if (typeof e !== "object" || e === null) return false;
        const entry = e as VerifiedBankEntry;
        if (typeof entry.question !== "object" || entry.question === null) return false;
        if (typeof entry.meta !== "object" || entry.meta === null) return false;
        if (entry.meta.validationStatus !== "VALID") return false;
        // Only entries from the current validator version: an entry that
        // passed an older, looser validator must not circulate forever.
        if (entry.meta.validatorVersion !== VALIDATOR_VERSION) return false;
        // Provenance metadata must come from the allowlist: a stored entry
        // claiming an unknown generator is not trusted.
        if (!(VERIFIED_BANK_GENERATORS as readonly string[]).includes(entry.meta.generator))
          return false;
        if (!(VERIFIED_BANK_DIFFICULTIES as readonly string[]).includes(entry.meta.difficulty))
          return false;
        // The stored question itself must be structurally sound (4–5
        // non-empty options, answerIndex in range, listed subtopic): a
        // corrupt entry must never reach the quiz screen.
        if (!isStructurallyValid(entry.question)) return false;
        if (
          SUBTESTS[entry.question.subtest]?.subtopics.includes(entry.question.subtopic) !== true
        )
          return false;
        return true;
      })
      .map((e) => ({
        ...e,
        // The runtime layer only ever holds AI questions that passed the
        // deterministic validator, so their provenance is "validator" —
        // never "audit", even if a stored entry claims otherwise.
        question: { ...e.question, verified: true, verifiedBy: "validator" as const },
      }));
  } catch {
    return [];
  }
}

/** Returns true when the entries were actually stored. */
function saveRuntimeEntries(entries: VerifiedBankEntry[]): boolean {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return false;
  try {
    window.localStorage.setItem(VERIFIED_BANK_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    // Storage full or unavailable: the in-memory serve below still works
    // from the static seed; the runtime entry is simply not persisted.
    return false;
  }
}

function seedEntry(question: Question): VerifiedBankEntry {
  return {
    question: { ...question, verified: true, verifiedBy: "audit" as const },
    meta: {
      subtest: question.subtest,
      difficulty: "unknown",
      generator: "hand-written (audit 2026-11-26)",
      validationStatus: "VALID",
      validatedAt: "2026-11-26",
      validatorVersion: 0,
    },
  };
}

function seedEntriesFor(subtest: SubtestId): VerifiedBankEntry[] {
  const byId = new Map(SAMPLE_QUESTIONS.map((q) => [q.id, q]));
  const entries: VerifiedBankEntry[] = [];
  for (const id of VERIFIED_SAMPLE_IDS) {
    const question = byId.get(id);
    if (question && question.subtest === subtest) entries.push(seedEntry(question));
  }
  return entries;
}

/**
 * Add one AI-generated question to the runtime bank. The validator runs
 * again here: anything that is not VALID is refused (returns false).
 * Provenance metadata is allowlisted (P0-10): an unknown generator or
 * difficulty is refused. Returns true only when the question was actually
 * stored (false on refusal, duplicate, failed write, or when storage is
 * unavailable, e.g. server-side rendering).
 */
export function addVerified(
  question: Question,
  meta: { generator: string; difficulty: string },
): boolean {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return false;
  if (!(VERIFIED_BANK_GENERATORS as readonly string[]).includes(meta.generator)) return false;
  if (!(VERIFIED_BANK_DIFFICULTIES as readonly string[]).includes(meta.difficulty)) return false;
  const result = validateQuestion(question);
  if (result.verdict !== "VALID") return false;
  const entry: VerifiedBankEntry = {
    question: { ...question, verified: true, verifiedBy: "validator" as const },
    meta: {
      subtest: question.subtest,
      difficulty: meta.difficulty,
      generator: meta.generator,
      validationStatus: "VALID",
      validatedAt: new Date().toISOString(),
      validatorVersion: VALIDATOR_VERSION,
    },
  };
  const current = loadRuntimeEntries();
  const { entries, inserted } = insertVerifiedEntry(current, entry);
  if (!inserted) return false;
  // Only report success when the write actually landed.
  return saveRuntimeEntries(entries);
}

/**
 * Serve up to `count` verified questions for a subtest, from the combined
 * pool (audited seed first in trust, runtime cache for variety — shuffled
 * together). `excludeIds` are questions already served this session and
 * are never repeated. When `focusSubtopics` is given (a drill targeting
 * specific subtopics), questions of those subtopics are served first and
 * the rest only fill up to `count`. Returns fewer than `count` when the
 * bank is short; never an unvalidated question.
 */
export function getVerifiedFor(
  subtest: SubtestId,
  count: number,
  excludeIds: ReadonlySet<string> = new Set(),
  focusSubtopics?: string[],
): Question[] {
  const pool = shuffle([...seedEntriesFor(subtest), ...loadRuntimeEntries()]);
  // Focus first (shuffled), then the rest (shuffled): a focused drill gets
  // on-topic questions from the bank instead of random ones.
  const ordered =
    focusSubtopics && focusSubtopics.length > 0
      ? [
          ...shuffle(pool.filter((e) => focusSubtopics.includes(e.question.subtopic))),
          ...shuffle(pool.filter((e) => !focusSubtopics.includes(e.question.subtopic))),
        ]
      : pool;
  const served: Question[] = [];
  const seen = new Set<string>();
  for (const entry of ordered) {
    if (served.length >= count) break;
    if (entry.question.subtest !== subtest) continue;
    if (excludeIds.has(entry.question.id) || seen.has(entry.question.id)) continue;
    seen.add(entry.question.id);
    served.push(entry.question);
  }
  return served;
}

export function getBankStats(subtest?: SubtestId): VerifiedBankStats {
  const seedCount = subtest
    ? seedEntriesFor(subtest).length
    : VERIFIED_SAMPLE_IDS.length;
  const runtimeCount = loadRuntimeEntries().filter(
    (e) => !subtest || e.question.subtest === subtest,
  ).length;
  return { seedCount, runtimeCount, total: seedCount + runtimeCount };
}

/** Remove all runtime (AI-validated) entries. The static seed is unaffected. */
export function clearRuntimeBank(): void {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;
  try {
    window.localStorage.removeItem(VERIFIED_BANK_STORAGE_KEY);
  } catch {
    // Ignore: nothing to clear.
  }
}
