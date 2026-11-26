// AI generation through Firebase AI Logic (firebase/ai) — the ONLY way this
// app calls any AI model (hard hackathon rule).
//
// Verified against the official docs (firebase.google.com/docs/ai-logic,
// crawled 2026-11-24):
//   import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode, Schema }
//     from "firebase/ai";
//   const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
//   const model = getGenerativeModel(ai, {
//     mode: InferenceMode.PREFER_ON_DEVICE,          // drill cepat
//     // mode: InferenceMode.PREFER_IN_CLOUD,        // tryout + analisis
//     inCloudParams: { generationConfig: {
//       responseMimeType: "application/json", responseSchema: schema } },
//     onDeviceParams: { promptOptions: { responseConstraint: schema } },
//   });
//   const result = await model.generateContent(prompt);
//   result.response.text();            // generated JSON string
//   result.response.inferenceSource;   // "ON_DEVICE" | "IN_CLOUD" (SDK v12.5.0+)
//
// Notes:
// - The cloud model is gemini-3.8-flash (stable, Firebase AI Logic docs,
//   verified 2026-11-26), set explicitly in `inCloudParams.model`.
//   It replaced gemini-3.5-flash-lite on 2026-11-26 after that model
//   returned HTTP 500 "high demand" twice in live tests.
// - On-device inference uses Chrome's Prompt API (Gemini Nano). Its
//   supported languages are limited, so Indonesian prompts will usually
//   fall back to the cloud — that is the designed behaviour of
//   PREFER_ON_DEVICE, and the UI always shows which source actually served
//   the request (never faked).
// - Every generation is validated strictly (see validation.ts): only VALID
//   questions reach the student. Invalid/inconclusive ones are regenerated
//   once (shortfall only), then replaced from the Verified Question Bank
//   (see verified-bank.ts). The caller is told how many questions came
//   from the bank, so the UI can say so honestly.

import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
  Schema,
  type GenerativeModel,
} from "firebase/ai";
import { getFirebaseApp } from "./firebase";
import { parseGeneratedQuestionsText, shuffle } from "./logic";
import { sampleQuestionsFor } from "./sample-questions";
import { validateQuestionSet } from "./validation";
import { addVerified, getVerifiedFor } from "./verified-bank";
import { VERIFIED_SAMPLE_IDS } from "./verified-sample-ids";
import {
  DrillPlan,
  InferenceSource,
  Question,
  SessionMode,
  SubtestId,
  SUBTESTS,
  WeaknessEntry,
} from "./types";

export class AiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiError";
  }
}

/** Thrown when an AI call does not finish within the per-attempt timeout. */
export class AiTimeoutError extends Error {
  constructor() {
    super("Permintaan AI melewati batas waktu.");
    this.name = "AiTimeoutError";
  }
}

/**
 * User-facing message when the AI service is overloaded (HTTP 500/503 after
 * all retries). The caller falls back to the verified sample bank and shows
 * this notice. Kept as one exact string so the UI text is stable.
 */
export const AI_OVERLOADED_MESSAGE =
  "AI Google sedang penuh, memakai soal contoh dulu — coba lagi nanti.";

/**
 * User-facing message when an AI call never finishes in time. Deliberately
 * different from the overload message: a timeout must NOT claim Google is
 * full — it only says the AI did not answer in time.
 */
export const AI_TIMEOUT_MESSAGE =
  "AI tidak merespons tepat waktu, memakai soal contoh dulu — coba lagi nanti.";

/** Bounded retry policy for AI calls (approved 2026-11-26). */
export const AI_CALL_MAX_ATTEMPTS = 3;
export const AI_CALL_BACKOFFS_MS = [2000, 4000];
export const AI_CALL_TIMEOUT_MS = 30_000;

/**
 * Soft batch budget for one generateQuestions call (approved 2026-11-26):
 * generation + one regeneration must finish within 90 seconds. When the
 * budget expires, the in-flight request is aborted (AbortController) and
 * the questions validated so far are kept and completed from the Verified
 * Question Bank — the student is never left waiting without a limit.
 * Soft: a backoff sleep (max 4s) may overshoot the budget slightly.
 */
export const AI_BATCH_BUDGET_MS = 90_000;

/**
 * True when the error is an HTTP 500/503 from the AI backend (transient
 * overload). The Firebase AI Logic error carries the status in brackets,
 * e.g. "[500 Internal Server Error] This model is currently experiencing
 * high demand...". ONLY the bracketed status counts — loose phrases such
 * as "high demand" must never trigger a retry on their own (a 403 could
 * carry the same words). Only 500/503 errors are retried; anything else
 * (403, 400, timeout, ...) fails immediately.
 */
export function isRetryableAiError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /\[50[03]\b/.test(message);
}

/** True when the error is a timeout/abort (ours or the SDK's own). */
function isTimeoutError(error: unknown): boolean {
  if (error instanceof AiTimeoutError) return true;
  if (!(error instanceof Error)) return false;
  return (
    error.name === "AbortError" ||
    error.name === "TimeoutError" ||
    /abort|timeout|timed out/i.test(error.message)
  );
}

export interface AiCallOptions {
  maxAttempts?: number;
  backoffsMs?: number[];
  timeoutMs?: number;
  /** Injectable sleep (tests pass a fake that records delays). */
  sleep?: (ms: number) => Promise<void>;
  /**
   * Outer abort signal (e.g. the batch budget, or the student's Cancel
   * button). When it aborts, the in-flight attempt is aborted and the
   * call fails with AiError — it is never retried.
   */
  signal?: AbortSignal;
}

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Run one AI call with a per-attempt timeout and bounded retries.
 *
 * - Timeout: each attempt gets its own AbortController; a timer aborts it
 *   after `timeoutMs`, and the call is raced against the timer so the
 *   helper never waits on a hung request. The attempt MUST forward the
 *   signal to the SDK call (`model.generateContent(prompt, { timeout,
 *   signal })`) — the SDK aborts the underlying HTTP request on abort, so
 *   no long request keeps running after the timeout. The SDK's own
 *   `timeout` option (default 180s) is set to the same value as a backstop.
 * - Retry: only HTTP 500/503 is retried, at most `maxAttempts` attempts
 *   in total, with exponential backoff between attempts. Every other
 *   error — including a timeout — fails immediately, without retry.
 * - Outer abort: when `options.signal` aborts (batch budget or student
 *   cancel), the in-flight attempt is aborted through its own controller
 *   and the call fails with AiError. It is never retried and never
 *   relabelled as a timeout.
 */
export async function callAiWithRetry<T>(
  attempt: (signal: AbortSignal) => Promise<T>,
  options: AiCallOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? AI_CALL_MAX_ATTEMPTS;
  const backoffs = options.backoffsMs ?? AI_CALL_BACKOFFS_MS;
  const timeoutMs = options.timeoutMs ?? AI_CALL_TIMEOUT_MS;
  const sleep = options.sleep ?? defaultSleep;
  let lastError: unknown;
  for (let attemptIndex = 0; attemptIndex < maxAttempts; attemptIndex++) {
    // The batch budget (or a student cancel) aborts the whole call.
    if (options.signal?.aborted) {
      throw new AiError("Permintaan AI dibatalkan (batas waktu batch tercapai).");
    }
    const controller = new AbortController();
    const abortAttempt = () => controller.abort();
    options.signal?.addEventListener("abort", abortAttempt, { once: true });
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new AiTimeoutError());
      }, timeoutMs);
    });
    try {
      const value = await Promise.race([attempt(controller.signal), timeoutPromise]);
      if (timer !== undefined) clearTimeout(timer);
      options.signal?.removeEventListener("abort", abortAttempt);
      return value;
    } catch (error) {
      if (timer !== undefined) clearTimeout(timer);
      options.signal?.removeEventListener("abort", abortAttempt);
      lastError = error;
      // The outer signal (batch budget / cancel) aborts the whole call:
      // never retried, never relabelled as a timeout.
      if (options.signal?.aborted) {
        throw new AiError("Permintaan AI dibatalkan (batas waktu batch tercapai).");
      }
      // A timeout is not an HTTP 500/503: it fails immediately, never retried.
      if (controller.signal.aborted || isTimeoutError(error)) {
        throw new AiTimeoutError();
      }
      // Only HTTP 500/503 is retried, with backoff, up to maxAttempts.
      if (isRetryableAiError(error) && attemptIndex < maxAttempts - 1) {
        const delay = backoffs[Math.min(attemptIndex, backoffs.length - 1)];
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

let aiService: ReturnType<typeof getAI> | null = null;

function getAiService() {
  if (aiService) return aiService;
  const app = getFirebaseApp();
  if (!app) return null;
  aiService = getAI(app, { backend: new GoogleAIBackend() });
  return aiService;
}

/**
 * User-facing message for an AI failure. Overload (500/503 after all retries)
 * says the service is full; a timeout says only that the AI did not answer
 * in time — it must not claim Google is full. Anything else keeps the
 * technical message (the caller shows it in the fallback notice).
 */
export function aiFailureMessage(error: unknown): string {
  if (error instanceof AiTimeoutError) return AI_TIMEOUT_MESSAGE;
  if (isRetryableAiError(error)) return AI_OVERLOADED_MESSAGE;
  return `Gagal memanggil Firebase AI Logic: ${error instanceof Error ? error.message : "error tidak diketahui"}`;
}

// --- Question schema (Firebase Schema helpers, per the docs) ---

const questionSchema = Schema.object({
  properties: {
    questions: Schema.array({
      items: Schema.object({
        properties: {
          text: Schema.string(),
          options: Schema.array({ items: Schema.string() }),
          answerIndex: Schema.number(),
          subtopic: Schema.string(),
          explanation: Schema.string(),
        },
      }),
    }),
  },
});

const drillPlanSchema = Schema.object({
  properties: {
    days: Schema.array({
      items: Schema.object({
        properties: {
          day: Schema.number(),
          subtopic: Schema.string(),
          focus: Schema.string(),
          target: Schema.string(),
        },
      }),
    }),
  },
});

function buildQuestionModel(
  mode: SessionMode,
  inferenceModeOverride?: InferenceMode,
): GenerativeModel {
  const ai = getAiService();
  if (!ai) throw new AiError("Firebase belum dikonfigurasi.");
  // Drill cepat: prefer on-device (Nano if available, cloud fallback).
  // Tryout: prefer cloud (longer, calibrated questions + analysis).
  // The override exists ONLY for the cloud-only live test (ONLY_IN_CLOUD,
  // so a Nano fallback can never mask a cloud failure). Product call sites
  // never pass it, so product behavior is unchanged.
  const inferenceMode =
    inferenceModeOverride ??
    (mode === "drill" ? InferenceMode.PREFER_ON_DEVICE : InferenceMode.PREFER_IN_CLOUD);
  return getGenerativeModel(ai, {
    mode: inferenceMode,
    inCloudParams: {
      // Cloud model: gemini-3.8-flash (stable; the documented replacement
      // for the gemini-3.5/3.6/3.7 Flash line), used automatically as
      // the PREFER_ON_DEVICE fallback and for PREFER_IN_CLOUD.
      model: "gemini-3.8-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      },
    },
    onDeviceParams: {
      promptOptions: { responseConstraint: questionSchema },
    },
  });
}

function readInferenceSource(result: { response: { inferenceSource?: unknown } }): InferenceSource {
  const s = result.response.inferenceSource;
  return s === "ON_DEVICE" || s === "IN_CLOUD" ? s : null;
}

/**
 * Combine the inference sources of the two generation batches into the
 * session's source. When both batches served from the same source, that
 * source describes the whole session; when they differ, the session is
 * "MIXED" — the second batch's source must never overwrite the first's
 * as if every question came from one source. A missing source on either
 * side leaves the other side standing.
 *
 * CALLER CONTRACT (GPT round 3): only the sources of batches that
 * actually contributed at least one validated question may be passed in.
 * A batch whose questions were all dropped must not colour the session.
 */
function combineInferenceSources(
  first: InferenceSource,
  second: InferenceSource,
): InferenceSource {
  if (first === null) return second;
  if (second === null) return first;
  return first === second ? first : "MIXED";
}

export interface GeneratedSet {
  questions: Question[];
  inferenceSource: InferenceSource;
  /** How many of the returned questions came from the Verified Question Bank. */
  fromBank?: number;
  /** True when the AI generation phase failed and the bank filled the gap. */
  generationFailed?: boolean;
  /** True when the set came straight from the bank because this subtest's
   *  questions cannot pass the deterministic validator (non-numeric
   *  subtests): no AI call was made at all. */
  bankOnly?: boolean;
}

/** Loading stages reported to the UI while a session is being generated. */
export type GenerationStage = "generating" | "regenerating" | "bank";

/**
 * The product prompt for one generation batch, verbatim. `batchCount` is
 * the number of questions this batch asks for — the first batch asks for
 * `count`, a regeneration asks only for the shortfall.
 */
function buildQuestionPrompt(subtest: SubtestId, batchCount: number, topics: string[]): string {
  const info = SUBTESTS[subtest];
  // Literasi Inggris: bacaan, pertanyaan, dan pilihan jawaban dalam Bahasa
  // Inggris; pembahasan tetap Bahasa Indonesia (konsisten dengan UI app).
  const isEnglish = subtest === "literasi-inggris";
  return [
    isEnglish
      ? `Buatkan ${batchCount} soal latihan gaya SNBT untuk subtes "${info.name}" in English (passage, question, and options in English; the explanation in Bahasa Indonesia).`
      : `Buatkan ${batchCount} soal latihan gaya SNBT untuk subtes "${info.name}" dalam Bahasa Indonesia.`,
    `Soal harus ORISINAL (tulis sendiri, jangan menyalin soal SNBT asli).`,
    `TINGKAT KESULITAN: soal untuk siswa SMA kelas 12 yang bersiap menghadapi SNBT (UTBK) — setara ujian masuk perguruan tinggi negeri. Setiap soal harus membutuhkan minimal dua langkah penalaran. JANGAN membuat soal aritmetika satu langkah (misalnya menghitung harga barang atau luas bangun sederhana) — itu level SD, bukan SNBT.`,
    `Untuk Penalaran Matematika: penalaran kuantitatif multi-langkah — interpretasi tabel/data, peluang dan kombinatorika, fungsi dan pertumbuhan, sistem persamaan dan optimasi, barisan dan deret.`,
    `Untuk Literasi Bahasa Indonesia: sertakan teks bacaan 150-250 kata bergaya akademik/populer ilmiah; pertanyaan harus menuntut inferensi, evaluasi argumen, sikap penulis, simpulan, atau hubungan antarparagraf — bukan sekadar mencari ide pokok yang tertulis eksplisit.`,
    `Untuk Penalaran Umum: pola bilangan dan huruf, analogi, silogisme dan kesimpulan logis (termasuk mengenali kesimpulan yang tidak dapat dipastikan dari premisnya), serta penalaran kuantitatif — setiap soal harus membutuhkan minimal dua langkah penalaran.`,
    `Untuk Pengetahuan dan Pemahaman Umum: makna kata dalam konteks (sinonim/antonim), fakta dan informasi umum yang benar dan dapat diverifikasi; JANGAN membuat soal hafalan yang jawabannya tidak dapat dipastikan atau diperdebatkan.`,
    `Untuk Pemahaman Bacaan dan Menulis: sertakan teks bacaan 150-250 kata; pertanyaan tentang gagasan utama, kalimat yang tidak relevan, urutan kalimat yang logis, atau perbaikan kalimat (kalimat efektif, pilihan kata yang tepat, menghilangkan kerancuan dan pengulangan).`,
    `Untuk Pengetahuan Kuantitatif: bilangan (FPB/KPK, pangkat, sisa pembagian), aljabar (persamaan, nilai mutlak, fungsi), geometri dan pengukuran (luas, volume, Pythagoras), data dan peluang — setiap soal harus membutuhkan minimal dua langkah penalaran.`,
    `Untuk Literasi dalam Bahasa Inggris: sertakan teks bacaan 150-250 kata dalam Bahasa Inggris; pertanyaan tentang main idea, inference, vocabulary in context, atau author's purpose — tulis teks bacaan, pertanyaan, dan pilihan jawaban dalam Bahasa Inggris, tetapi pembahasan (explanation) dalam Bahasa Indonesia.`,
    `Sebar soal ke subtopik berikut: ${topics.join(", ")}.`,
    `Setiap soal: teks soal yang jelas, 4 sampai 5 pilihan jawaban, satu kunci jawaban yang benar, label subtopik (salah satu dari daftar di atas), dan pembahasan tertulis yang menjelaskan cara mendapatkan jawabannya.`,
    `Jawab HANYA dengan JSON sesuai skema: {"questions": [{"text": "...", "options": ["...", "...", "...", "..."], "answerIndex": 0, "subtopic": "...", "explanation": "..."}]}.`,
  ].join(" ");
}

/**
 * Generate `count` ORIGINAL SNBT-style questions for a subtest via Firebase
 * AI Logic. Questions are generated live — never copied from real SNBT
 * questions (those belong to SNPMB and are not freely published).
 * `focusSubtopics` narrows generation to specific subtopics (used by the
 * drill plan's per-day drills).
 *
 * Pipeline (approved 2026-11-26):
 *   0. Non-numeric subtests (literasi, bacaan-menulis, literasi-inggris,
 *      pengetahuan-umum) skip AI generation entirely: the deterministic
 *      validator can never return VALID for them, so two generation calls
 *      would be wasted. They are served straight from the Verified Bank
 *      (bankOnly: true, no AI call, inferenceSource null).
 *   1. Generate one batch, parse it, and validate every question with the
 *      deterministic validator. Only VALID questions are kept (marked
 *      `verified: true`, `verifiedBy: "validator"`); INVALID and
 *      INCONCLUSIVE are dropped.
 *   2. If the batch is short, regenerate ONCE for the shortfall only
 *      (max 2 generations per question in total), while the 90s soft batch
 *      budget remains. The session inferenceSource is the source shared by
 *      both batches, or "MIXED" when the batches differ — never the second
 *      batch's source presented as if it served the whole session. Only
 *      batches that contribute at least one validated question count
 *      toward it; a batch whose questions are all dropped is ignored.
 *   3. Fill any remaining shortfall from the Verified Question Bank
 *      (audited seed + validator-approved AI questions), preferring the
 *      focus subtopics when a drill targets them.
 *   4. Throws AiError only when nothing — not even the bank — can supply
 *      a question. The caller then shows the safe failure message; it
 *      must NOT fall back to unvalidated questions.
 *
 * Subtopic distribution is requested in the prompt ("Sebar soal ke subtopik
 * berikut") but NOT enforced: a batch may skew to one subtopic and still be
 * VALID, and the weakness map only covers subtopics that appear in the
 * answers. Do not claim the questions are evenly spread.
 */
export async function generateQuestions(
  subtest: SubtestId,
  count: number,
  mode: SessionMode,
  focusSubtopics?: string[],
  options?: {
    inferenceMode?: InferenceMode;
    /** Loading-stage callback for the UI (generating/regenerating/bank). */
    onProgress?: (stage: GenerationStage) => void;
    /** External abort (the UI Cancel button). Aborts the batch like the budget does. */
    signal?: AbortSignal;
  },
): Promise<GeneratedSet> {
  const info = SUBTESTS[subtest];
  const model = buildQuestionModel(mode, options?.inferenceMode);
  const topics = focusSubtopics && focusSubtopics.length > 0 ? focusSubtopics : info.subtopics;
  const report = (stage: GenerationStage) => options?.onProgress?.(stage);

  // Non-numeric subtests can never produce a VALID AI question (their keys
  // are not numbers), so generating would burn two AI calls for zero valid
  // questions. Serve the Verified Bank directly — no AI call at all.
  if (!info.numericQuestions) {
    report("bank");
    const bank = getVerifiedFor(subtest, count, new Set(), focusSubtopics);
    if (bank.length === 0) {
      throw new AiError(
        "AI tidak dapat membuat soal dan bank soal terverifikasi kosong. Coba lagi nanti.",
      );
    }
    return { questions: bank, inferenceSource: null, fromBank: bank.length, bankOnly: true };
  }

  // A per-call random token in every generated ID: Date.now() alone can
  // collide when two sessions start in the same millisecond, and the bank
  // and the report dedup both key on ID — two different questions must
  // never share one.
  const batchToken = Math.random().toString(36).slice(2, 8);

  const generateBatch = async (
    batchCount: number,
    signal: AbortSignal,
    idSuffix: string,
  ): Promise<{ questions: Question[]; inferenceSource: InferenceSource }> => {
    const prompt = buildQuestionPrompt(subtest, batchCount, topics);
    const result = await callAiWithRetry(
      (attemptSignal) =>
        model.generateContent(prompt, { timeout: AI_CALL_TIMEOUT_MS, signal: attemptSignal }),
      { signal },
    );
    const parsed = parseGeneratedQuestionsText(
      result.response.text(),
      subtest,
      "ai",
      `ai-${subtest}-${Date.now()}-${batchToken}-${idSuffix}`,
    );
    if (!parsed || parsed.length === 0) {
      throw new AiError("Jawaban AI tidak sesuai format soal yang diharapkan.");
    }
    return { questions: parsed, inferenceSource: readInferenceSource(result) };
  };

  // Soft 90s batch budget: aborts the in-flight request when it expires.
  // The student's Cancel button aborts through the same controller.
  const batchDeadline = Date.now() + AI_BATCH_BUDGET_MS;
  const batchController = new AbortController();
  const budgetTimer = setTimeout(() => batchController.abort(), AI_BATCH_BUDGET_MS);
  if (options?.signal?.aborted) batchController.abort();
  options?.signal?.addEventListener("abort", () => batchController.abort(), { once: true });

  let inferenceSource: InferenceSource = null;
  let generationFailed = false;
  let valid: Question[] = [];
  try {
    report("generating");
    const first = await generateBatch(count, batchController.signal, "a");
    const firstValid = validateQuestionSet(first.questions).valid.map((q) => ({
      ...q,
      verified: true,
      verifiedBy: "validator" as const,
    }));
    valid = firstValid;
    // A batch counts toward the session's inference source only when it
    // actually contributes at least one validated question: a batch whose
    // questions are all dropped must not colour the session (GPT round 3
    // edge case — e.g. an all-invalid ON_DEVICE first batch must not turn
    // an all-cloud session into MIXED).
    if (firstValid.length > 0) inferenceSource = first.inferenceSource;
    // One regeneration, for the shortfall only, while budget remains.
    const shortfall = count - valid.length;
    if (shortfall > 0 && Date.now() < batchDeadline && !batchController.signal.aborted) {
      report("regenerating");
      const second = await generateBatch(shortfall, batchController.signal, "b");
      const secondValid = validateQuestionSet(second.questions).valid.map((q) => ({
        ...q,
        verified: true,
        verifiedBy: "validator" as const,
      }));
      if (secondValid.length > 0) {
        inferenceSource = combineInferenceSources(inferenceSource, second.inferenceSource);
      }
      valid = [...valid, ...secondValid];
    }
  } catch (e) {
    // Any generation failure (overload, timeout, budget abort, cancel,
    // unparseable output): keep the valid questions collected so far and
    // complete from the Verified Question Bank below. Log the technical
    // detail; the user-facing message comes from the caller.
    generationFailed = true;
    if (e instanceof AiTimeoutError || isRetryableAiError(e)) {
      console.error("LatihSNBT AI failure:", e instanceof Error ? e.message : e);
    }
  } finally {
    clearTimeout(budgetTimer);
  }

  // Fill the remaining shortfall from the Verified Question Bank (audited
  // seed + validator-approved AI questions). Never an unvalidated question.
  // A focused drill's bank fill prefers its focus subtopics (P1-11).
  let fromBank = 0;
  const shortfall = count - valid.length;
  if (shortfall > 0) {
    report("bank");
    const bank = getVerifiedFor(
      subtest,
      shortfall,
      new Set(valid.map((q) => q.id)),
      focusSubtopics,
    );
    fromBank = bank.length;
    valid = [...valid, ...bank];
  }
  if (valid.length === 0) {
    throw new AiError(
      "AI tidak dapat membuat soal dan bank soal terverifikasi kosong. Coba lagi nanti.",
    );
  }
  // Persist freshly validated AI questions into the runtime bank (best
  // effort, capped at 200) so the bank grows with verified variety.
  // addVerified re-validates, so a question that somehow lost its VALID
  // verdict is refused here as well.
  for (const q of valid) {
    if (q.source === "ai") {
      addVerified(q, { generator: "gemini-3.8-flash", difficulty: "SNBT" });
    }
  }
  return { questions: valid.slice(0, count), inferenceSource, fromBank, generationFailed };
}

// --- 7-day drill plan (cloud) ---

function isValidPlanJson(raw: unknown): raw is { days: unknown[] } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return false;
  const days = (raw as { days?: unknown }).days;
  if (!Array.isArray(days) || days.length !== 7) return false;
  return days.every((d) => {
    if (typeof d !== "object" || d === null) return false;
    const o = d as Record<string, unknown>;
    return (
      typeof o.day === "number" &&
      typeof o.subtopic === "string" &&
      o.subtopic.length > 0 &&
      typeof o.focus === "string" &&
      o.focus.length > 0 &&
      typeof o.target === "string" &&
      o.target.length > 0
    );
  });
}

/**
 * Ask the cloud model to turn a weakness map into a 7-day drill plan.
 * Returns null on any failure — the caller uses the deterministic fallback
 * (buildDrillPlanFallback) and labels it honestly.
 */
export async function generateDrillPlan(
  subtest: SubtestId,
  weakness: WeaknessEntry[],
): Promise<DrillPlan | null> {
  const ai = getAiService();
  if (!ai) return null;
  const model = getGenerativeModel(ai, {
    mode: InferenceMode.PREFER_IN_CLOUD,
    inCloudParams: {
      // Same cloud model as question generation (gemini-3.8-flash).
      model: "gemini-3.8-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: drillPlanSchema,
      },
    },
    onDeviceParams: {
      promptOptions: { responseConstraint: drillPlanSchema },
    },
  });
  const weakLines = weakness
    .map((w) => `- ${w.subtopic}: ${w.correct}/${w.total} benar (${w.percent}%)`)
    .join("\n");
  const prompt = [
    `Seorang pelajar baru saja menyelesaikan tryout subtes "${SUBTESTS[subtest].name}" (SNBT).`,
    `Peta kelemahannya per subtopik:\n${weakLines}`,
    `Buatkan rencana latihan 7 hari dalam Bahasa Indonesia: hari 1-6 fokus ke subtopik terlemah (satu subtopik per hari, boleh diulang), hari 7 adalah tryout ulang.`,
    `Setiap hari: nomor hari (1-7), subtopik, satu kalimat fokus latihan, dan satu target konkret (misal "Kerjakan 5 soal drill Aljabar").`,
    `Jawab HANYA dengan JSON sesuai skema: {"days": [{"day": 1, "subtopic": "...", "focus": "...", "target": "..."}]}.`,
  ].join(" ");
  try {
    const result = await callAiWithRetry((signal) =>
      model.generateContent(prompt, { timeout: AI_CALL_TIMEOUT_MS, signal }),
    );
    const cleaned = result.response
      .text()
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const parsed: unknown = JSON.parse(cleaned.slice(start, end + 1));
    if (!isValidPlanJson(parsed)) return null;
    const days = (parsed.days as Record<string, unknown>[]).map((d) => ({
      day: d.day as number,
      subtopic: d.subtopic as string,
      focus: d.focus as string,
      target: d.target as string,
    }));
    return { source: "ai", days };
  } catch {
    return null;
  }
}

/** Sample-question fallback set for a subtest (used when Firebase is not
 *  configured or AI generation fails). Always labelled "Soal contoh".
 * Returns a shuffled subset of `count` questions so a drill does not always
 * show the same first questions; when `focusSubtopics` is given (per-topic
 * drills), questions of those subtopics come first, then the rest fill up
 * to `count`. */
export function sampleSet(
  subtest: SubtestId,
  count: number,
  focusSubtopics?: string[],
): GeneratedSet {
  const all = sampleQuestionsFor(subtest);
  const focus =
    focusSubtopics && focusSubtopics.length > 0
      ? shuffle(all.filter((q) => focusSubtopics.includes(q.subtopic)))
      : [];
  const rest = shuffle(all.filter((q) => !focusSubtopics?.includes(q.subtopic)));
  // Only questions in the audited seed list are marked verified (provenance
  // "audit"). A sample that a future audit removes from the seed is still
  // served in unconfigured mode, but without the verified badge.
  const verifiedIds = new Set(VERIFIED_SAMPLE_IDS);
  return {
    questions: [...focus, ...rest].slice(0, count).map((q) => {
      const isVerified = verifiedIds.has(q.id);
      return isVerified
        ? { ...q, verified: true, verifiedBy: "audit" as const }
        : { ...q, verified: false };
    }),
    inferenceSource: null,
  };
}

