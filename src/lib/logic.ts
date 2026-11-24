// Pure logic for LatihSNBT — no Firebase, no browser APIs, fully testable.
// Scoring, weakness map, drill-plan fallback, timer helpers, and strict
// validation of AI-generated question JSON.

import {
  AnsweredQuestion,
  DRILL_QUESTION_COUNT,
  DrillPlan,
  Question,
  QuestionSource,
  SubtestId,
  WeaknessEntry,
} from "./types";

/** Score a finished session. `score` is 0-100, rounded. */
export function scoreSession(answered: AnsweredQuestion[]): {
  correct: number;
  total: number;
  score: number;
} {
  const total = answered.length;
  const correct = answered.filter((a) => a.correct).length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, score };
}

/**
 * Weakness map: percent correct per subtopic, sorted weakest-first.
 * A subtopic with no questions gets percent 100 (nothing to fix) and
 * sorts last.
 */
export function computeWeaknessMap(answered: AnsweredQuestion[]): WeaknessEntry[] {
  const bySubtopic = new Map<string, { total: number; correct: number }>();
  for (const a of answered) {
    const key = a.question.subtopic;
    const cur = bySubtopic.get(key) ?? { total: 0, correct: 0 };
    cur.total += 1;
    if (a.correct) cur.correct += 1;
    bySubtopic.set(key, cur);
  }
  const entries: WeaknessEntry[] = [...bySubtopic.entries()].map(([subtopic, v]) => ({
    subtopic,
    total: v.total,
    correct: v.correct,
    percent: v.total === 0 ? 100 : Math.round((v.correct / v.total) * 100),
  }));
  entries.sort((a, b) => a.percent - b.percent || b.total - a.total);
  return entries;
}

/** Deterministic 7-day drill plan from the weakness map (fallback when the
 *  AI plan is unavailable). Weakest subtopics get the most days; day 7 is
 *  always a full retest. */
export function buildDrillPlanFallback(weakness: WeaknessEntry[]): DrillPlan {
  const weak = weakness.filter((w) => w.percent < 100);
  const focus: string[] =
    weak.length > 0
      ? weak.map((w) => w.subtopic)
      : weakness.map((w) => w.subtopic);
  const days = [];
  for (let day = 1; day <= 7; day++) {
    if (day === 7) {
      days.push({
        day,
        subtopic: "Tryout ulang",
        focus: "Ukur lagi setelah 6 hari latihan.",
        target: "Kerjakan 1 sesi Tryout dan bandingkan skormu.",
      });
      continue;
    }
    const subtopic = focus[(day - 1) % focus.length];
    const entry = weakness.find((w) => w.subtopic === subtopic);
    const pct = entry ? entry.percent : 100;
    days.push({
      day,
      subtopic,
      focus:
        pct < 50
          ? `Fondasi ${subtopic} masih lemah (${pct}% benar). Pelajari konsep dasarnya dulu, baru latihan soal.`
          : pct < 80
            ? `${subtopic} sudah lumayan (${pct}% benar). Latihan soal yang lebih sulit.`
            : `${subtopic} sudah kuat (${pct}% benar). Jaga dengan latihan singkat.`,
      target: `Kerjakan ${DRILL_QUESTION_COUNT} soal drill ${subtopic}.`,
    });
  }
  return { source: "aturan", days };
}

/** Seconds left until a deadline (ms epoch), clamped at 0. */
export function remainingSeconds(deadlineMs: number, nowMs: number): number {
  return Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));
}

/** "MM:SS", e.g. 75 -> "01:15". */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** Fisher-Yates shuffle (copy, never mutates the input). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Validation of AI-generated questions.
//
// The model is asked (via a JSON response schema) to return:
//   { "questions": [{ "text", "options"[4-5], "answerIndex", "subtopic", "explanation" }] }
// Anything that does not match exactly is rejected — a bad question must
// never reach the student. Validation is strict on purpose.
// ---------------------------------------------------------------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isValidRawQuestion(v: unknown): boolean {
  if (!isRecord(v)) return false;
  if (typeof v.text !== "string" || v.text.trim().length < 10) return false;
  if (!Array.isArray(v.options) || v.options.length < 4 || v.options.length > 5) return false;
  if (!v.options.every((o) => typeof o === "string" && o.trim().length > 0)) return false;
  if (typeof v.answerIndex !== "number" || !Number.isInteger(v.answerIndex)) return false;
  if (v.answerIndex < 0 || v.answerIndex >= v.options.length) return false;
  if (typeof v.subtopic !== "string" || v.subtopic.trim().length === 0) return false;
  if (typeof v.explanation !== "string" || v.explanation.trim().length < 10) return false;
  return true;
}

/** Validate a parsed JSON value into Questions. Returns null on any problem. */
export function parseGeneratedQuestions(
  raw: unknown,
  subtest: SubtestId,
  source: QuestionSource,
  idPrefix: string,
): Question[] | null {
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.questions) || raw.questions.length === 0) return null;
  if (!raw.questions.every(isValidRawQuestion)) return null;
  return (raw.questions as Record<string, unknown>[]).map((q, i) => ({
    id: `${idPrefix}-${i}`,
    subtest,
    subtopic: (q.subtopic as string).trim(),
    text: (q.text as string).trim(),
    options: (q.options as string[]).map((o) => o.trim()),
    answerIndex: q.answerIndex as number,
    explanation: (q.explanation as string).trim(),
    source,
  }));
}

/** Extract the JSON object from model text (tolerates ```json fences and
 *  leading/trailing prose) and validate it. Returns null on any problem. */
export function parseGeneratedQuestionsText(
  text: string,
  subtest: SubtestId,
  source: QuestionSource,
  idPrefix: string,
): Question[] | null {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
  return parseGeneratedQuestions(parsed, subtest, source, idPrefix);
}
