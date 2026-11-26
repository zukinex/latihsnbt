// Answer Validation Engine — deterministic gate for AI-generated questions.
//
// Pure module: no Firebase, no browser APIs, fully unit-testable (same
// pattern as logic.ts). It sits AFTER the structural parser in
// parseGeneratedQuestionsText and BEFORE any question reaches a student.
//
// Three verdicts (approved 2026-11-26):
//   VALID        — the explanation's final derived value equals the keyed
//                  option, and no defect rule fired. This confirms ONLY the
//                  final value, not the intermediate steps, the method, or
//                  whether the derived quantity is the one the question asks
//                  for. Only VALID questions may be delivered.
//   INVALID      — a defect was found (bad structure, wrong subtopic,
//                  duplicate/ambiguous options, leaked internal deliberation
//                  in the explanation, or the explanation's own derivation
//                  contradicts the key). Never delivered.
//   INCONCLUSIVE — correctness could not be established deterministically
//                  (non-numeric answers such as literacy/reasoning, an
//                  underdetermined question, or an assumed value). Never
//                  delivered either — it is regenerated once, then replaced
//                  from the Verified Question Bank.
//
// What this validator can and cannot do (honest limits, from the
// gemini-3.5-flash-lite 10-question evaluation, 2026-11-26):
//   - It catches the dominant failure mode: the key contradicting the
//     explanation's own derivation (4 of 8 bad questions).
//   - It catches leaked "thinking out loud" in explanations (2 of 8).
//   - It catches underdetermined questions only when the explanation
//     invents a value ("misal r_bola = 3 cm").
//   - It CANNOT catch a substitution slip inside an otherwise consistent
//     derivation. The known residual case is lite-10 Q1 (bacteria growth):
//     the explanation derives t = 18 hours and then adds 12 hours. A
//     narrow time-addition consistency rule catches that specific pattern,
//     but a general independent solver is out of scope for Fase 1 — that
//     is the job of the postponed Fase 2 AI validator.
//   - It CANNOT verify the intermediate steps or the method: a derivation
//     with wrong arithmetic, a wrong method (mean instead of median), a
//     bare assertion ("Luas = 25."), or an ill-posed question whose key is
//     restated at the end all return VALID, because only the final value
//     after the last "=" is compared with the key.
//   - Clock-time answers are compared in minutes, and the explanation must
//     state its final answer as a clock time: a bare duration ("1200
//     menit") does not confirm a time-of-day key.
//   - Literacy/reasoning questions can never be VALID here by design:
//     deterministic checks cannot establish that a reading-comprehension
//     key is correct, and the approved decision forbids auto-accepting
//     them on heuristics or blocklists.

import { Question, SUBTESTS } from "./types";

export type ValidationVerdict = "VALID" | "INVALID" | "INCONCLUSIVE";

export interface ValidationResult {
  verdict: ValidationVerdict;
  /** Machine-readable reason codes (first = the deciding reason). */
  reasons: string[];
}

export interface ValidatedQuestion {
  question: Question;
  result: ValidationResult;
}

export interface ValidationSetResult {
  valid: Question[];
  invalid: ValidatedQuestion[];
  inconclusive: ValidatedQuestion[];
}

// Phrases that prove the model's internal deliberation leaked into the
// explanation shown to students ("thinking out loud"). A real explanation
// never reworks the question, changes the numbers, or corrects its own
// answerIndex mid-text. Collected from the lite 10-question evaluation
// (2026-11-26): Q4 and Q8 contain these verbatim.
const EXPLANATION_LEAK_MARKERS = [
  "tampaknya ada kekeliruan",
  "mari buat soal yang pas",
  "mari kita ganti soal",
  "pilihan disesuaikan",
  "tunggu, mari hitung ulang",
  "ubah fungsi objektif",
  "koreksi answerindex",
  "mari set answerindex",
];

function normalizeOption(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Shared structural bar (same as the parser): also used by the Verified
 *  Question Bank to re-check stored entries on load. */
export function isStructurallyValid(q: Question): boolean {
  if (typeof q.text !== "string" || q.text.trim().length < 10) return false;
  if (!Array.isArray(q.options) || q.options.length < 4 || q.options.length > 5) return false;
  if (!q.options.every((o) => typeof o === "string" && o.trim().length > 0)) return false;
  if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length)
    return false;
  if (typeof q.subtopic !== "string" || q.subtopic.trim().length === 0) return false;
  if (typeof q.explanation !== "string" || q.explanation.trim().length < 10) return false;
  return true;
}

// --- Indonesian numeric parsing -------------------------------------------
// Handles the formats the generator emits: fractions (4/11), decimal comma
// (12,5), thousand separators (Rp30.000,00 / 340.000), clock times
// (Pukul 20.00 -> minutes since midnight, +24h for "hari berikutnya"),
// pi coefficients (36pi / 36π -> 36), percentages (60% -> 60) and plain
// integers. Returns null when the text is not a single numeric value.

function parseDecimal(s: string): number | null {
  let t = s.trim();
  if (t.includes(",")) {
    // Comma is the decimal separator; dots are thousand separators.
    t = t.replace(/\./g, "").replace(",", ".");
  } else {
    const parts = t.split(".");
    if (parts.length > 2) {
      t = t.replace(/\./g, "");
    } else if (parts.length === 2 && parts[1].length === 3) {
      // "340.000" is a thousand separator, not a decimal point.
      t = t.replace(".", "");
    }
    // Otherwise the dot is a decimal point ("20.00" -> 20, "4.5" -> 4.5).
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function parseNumericValue(raw: string): number | null {
  let s = raw.trim().toLowerCase();
  if (s.length === 0) return null;
  // Clock time: "pukul 20.00" / "pukul 02.00 hari berikutnya".
  const timeMatch = s.match(/pukul\s+(\d{1,2})[.:](\d{2})/);
  if (timeMatch) {
    const minutes = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
    return minutes + (s.includes("hari berikutnya") ? 24 * 60 : 0);
  }
  // Fraction: "4/11" (spaces around "/" tolerated).
  const fracMatch = s.match(/^(-?[\d.,]+)\s*\/\s*(-?[\d.,]+)$/);
  if (fracMatch) {
    const num = parseDecimal(fracMatch[1]);
    const den = parseDecimal(fracMatch[2]);
    if (num === null || den === null || den === 0) return null;
    return num / den;
  }
  // Strip known unit/currency words, then the remainder must be one number.
  s = s
    .replace(/^rp\s*/, "")
    .replace(/\s*(meter persegi|cm kubik|orang|kemenangan|jam|menit|cm|%)\s*$/, "")
    .replace(/(pi|π)\s*$/, "")
    .trim();
  if (!/^-?[\d.,]+$/.test(s)) return null;
  return parseDecimal(s);
}

function numbersEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
}

/**
 * The number the explanation itself derives last: the first number-like
 * token after the LAST "=" in the explanation. Examples from the lite
 * evaluation: "… = 450 meter persegi." -> 450; "… = 4/11." -> 4/11;
 * "Median = (12 + 14) / 2 = 13." -> 13. Returns null when the explanation
 * has no "=" or no number after it.
 */
function finalDerivedValue(explanation: string): number | null {
  const eqIndex = explanation.lastIndexOf("=");
  if (eqIndex === -1) return null;
  const after = explanation.slice(eqIndex + 1);
  const match = after.match(/-?\d[\d.,/]*/);
  if (!match) return null;
  return parseNumericValue(match[0]);
}

/**
 * Narrow, documented rule for the lite-10 Q1 pattern: the explanation
 * states it adds N hours ("ditambah 18 jam") and then computes with a
 * different number ("08.00 + 12 jam"). The two numbers describe the same
 * addition, so they must agree. Returns true on contradiction.
 */
function hasContradictoryTimeAddition(explanation: string): boolean {
  const lower = explanation.toLowerCase();
  const stated = lower.match(/ditambah\s+(\d+)\s*jam/);
  const used = lower.match(/\+\s*(\d+)\s*jam/);
  if (!stated || !used) return false;
  return stated[1] !== used[1];
}

/**
 * A clock time in a string, in minutes since midnight. Matches "20.00",
 * "02.00 hari berikutnya" (adds 24h), "pukul 08.00". Takes the LAST clock
 * pattern in the text (the answer is usually stated last). Returns null
 * when the text has no clock-time pattern. Used only for time-of-day
 * answers: the key ("Pukul 20.00") and the derived value must be compared
 * in the same unit (minutes), never a clock time against a bare decimal.
 */
function clockTimeMinutes(s: string): number | null {
  const matches = [...s.matchAll(/(\d{1,2})[.:](\d{2})/g)];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1];
  const minutes = parseInt(last[1], 10) * 60 + parseInt(last[2], 10);
  const after = s.slice(
    (last.index ?? 0) + last[0].length,
    (last.index ?? 0) + last[0].length + 40,
  );
  return minutes + (/hari berikut|keesokan/i.test(after) ? 24 * 60 : 0);
}

/**
 * The clock time the explanation states as its final answer: the last
 * clock-time pattern after the last "=" (or in the whole explanation when
 * there is no "="). Returns null when the explanation never states a clock
 * time.
 */
function finalClockTime(explanation: string): number | null {
  const eqIndex = explanation.lastIndexOf("=");
  const after = eqIndex === -1 ? explanation : explanation.slice(eqIndex + 1);
  return clockTimeMinutes(after);
}

/** True when the keyed option is a clock time ("Pukul 20.00"). */
function isClockTimeKey(key: string): boolean {
  return /pukul\s+\d{1,2}[.:]\d{2}/i.test(key);
}

/**
 * The explanation invents a value for an unknown ("misal r_bola = 3 cm").
 * Distinct from the legitimate "Misalkan X adalah ..." (defining a
 * variable without assigning a number): the regex requires "misal"
 * followed by a variable, "=", and a number. An invented value means the
 * question as stated cannot determine the answer.
 */
function hasAssumedValue(explanation: string): boolean {
  return /misal\s+[a-z_]+\s*=\s*[\d,]+/i.test(explanation);
}

/**
 * Validate one parsed question. Order matters: hard defects first
 * (INVALID), then the narrow inconclusive rules, then the numeric
 * confirmation. A question is VALID only when the explanation's final
 * derived value equals the keyed option; anything whose correctness cannot
 * be established is INCONCLUSIVE, never VALID. VALID does not mean the
 * intermediate steps or the method are correct — only the final value
 * matches the key.
 */
export function validateQuestion(q: Question): ValidationResult {
  // 1. Structure — same bar as the parser (defense in depth: the
  // validator also guards questions coming from the bank, not just fresh
  // generations).
  if (!isStructurallyValid(q)) {
    return { verdict: "INVALID", reasons: ["structure"] };
  }
  // 2. The subtopic must belong to this subtest. A wrong label corrupts
  // the weakness map, which is grouped by subtopic.
  if (!SUBTESTS[q.subtest].subtopics.includes(q.subtopic)) {
    return { verdict: "INVALID", reasons: ["subtopic"] };
  }
  // 3. Duplicate options. A duplicated keyed option means more than one
  // correct answer; any duplicate means an ambiguous question.
  const normalized = q.options.map(normalizeOption);
  const keyNormalized = normalized[q.answerIndex];
  if (new Set(normalized).size !== normalized.length) {
    const keyDuplicated =
      normalized.filter((o) => o === keyNormalized).length > 1;
    return {
      verdict: "INVALID",
      reasons: [keyDuplicated ? "ambiguous-key" : "duplicate-options"],
    };
  }
  // 4. Leaked internal deliberation in the explanation. Such text is not
  // a usable explanation for a student, whatever the key says.
  const explanationLower = q.explanation.toLowerCase();
  const marker = EXPLANATION_LEAK_MARKERS.find((m) => explanationLower.includes(m));
  if (marker) {
    return { verdict: "INVALID", reasons: [`explanation-leak:${marker}`] };
  }
  // 5. Numeric path (math / quantitative). The keyed option must parse as
  // a number; otherwise correctness cannot be established here.
  const keyValue = parseNumericValue(q.options[q.answerIndex]);
  if (keyValue === null) {
    // Literacy, reasoning, and other non-numeric answers: deterministic
    // checks cannot establish that the key is correct, and the approved
    // decision forbids auto-accepting them on heuristics or blocklists.
    return { verdict: "INCONCLUSIVE", reasons: ["correctness-unverifiable"] };
  }
  if (hasAssumedValue(q.explanation)) {
    return { verdict: "INCONCLUSIVE", reasons: ["assumed-value"] };
  }
  if (hasContradictoryTimeAddition(q.explanation)) {
    return { verdict: "INCONCLUSIVE", reasons: ["time-addition-contradiction"] };
  }
  // 5b. Clock-time answers ("Pukul 20.00") are compared in minutes, and the
  // explanation must state its final answer as a clock time. A bare duration
  // ("1200 menit") is the wrong quantity for a "when" question: it does not
  // confirm a time-of-day key, so it is a defect, not a confirmation.
  if (isClockTimeKey(q.options[q.answerIndex])) {
    const derivedTime = finalClockTime(q.explanation);
    if (derivedTime !== null) {
      if (!numbersEqual(derivedTime, keyValue)) {
        return { verdict: "INVALID", reasons: ["key-explanation-mismatch"] };
      }
      return { verdict: "VALID", reasons: ["final-value-matches"] };
    }
    const eqIndex = q.explanation.lastIndexOf("=");
    if (eqIndex !== -1) {
      const afterEq = q.explanation.slice(eqIndex + 1);
      if (/\d[\d.,/]*\s*(menit|jam)\b/i.test(afterEq)) {
        return { verdict: "INVALID", reasons: ["time-quantity-mismatch"] };
      }
    }
    return { verdict: "INCONCLUSIVE", reasons: ["numeric-unverifiable"] };
  }
  const derived = finalDerivedValue(q.explanation);
  if (derived === null) {
    return { verdict: "INCONCLUSIVE", reasons: ["numeric-unverifiable"] };
  }
  if (!numbersEqual(derived, keyValue)) {
    // The explanation's own derivation contradicts the key. This was the
    // dominant failure mode in the lite evaluation (4 of 8 bad questions).
    return { verdict: "INVALID", reasons: ["key-explanation-mismatch"] };
  }
  return { verdict: "VALID", reasons: ["final-value-matches"] };
}

/** Partition a generated set into valid / invalid / inconclusive. */
export function validateQuestionSet(questions: Question[]): ValidationSetResult {
  const valid: Question[] = [];
  const invalid: ValidatedQuestion[] = [];
  const inconclusive: ValidatedQuestion[] = [];
  for (const question of questions) {
    const result = validateQuestion(question);
    if (result.verdict === "VALID") valid.push(question);
    else if (result.verdict === "INVALID") invalid.push({ question, result });
    else inconclusive.push({ question, result });
  }
  return { valid, invalid, inconclusive };
}
