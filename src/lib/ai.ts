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
// - Every generation is validated strictly (see logic.ts). Invalid output
//   throws AiError; the caller then falls back to sample questions and says
//   so honestly.

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
    const controller = new AbortController();
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
      return value;
    } catch (error) {
      if (timer !== undefined) clearTimeout(timer);
      lastError = error;
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

export interface GeneratedSet {
  questions: Question[];
  inferenceSource: InferenceSource;
}

/**
 * Generate `count` ORIGINAL SNBT-style questions for a subtest via Firebase
 * AI Logic. Questions are generated live — never copied from real SNBT
 * questions (those belong to SNPMB and are not freely published).
 * `focusSubtopics` narrows generation to specific subtopics (used by the
 * drill plan's per-day drills). Throws AiError on any failure (caller falls
 * back to sample questions).
 */
export async function generateQuestions(
  subtest: SubtestId,
  count: number,
  mode: SessionMode,
  focusSubtopics?: string[],
  options?: { inferenceMode?: InferenceMode },
): Promise<GeneratedSet> {
  const info = SUBTESTS[subtest];
  const model = buildQuestionModel(mode, options?.inferenceMode);
  const topics = focusSubtopics && focusSubtopics.length > 0 ? focusSubtopics : info.subtopics;
  // Literasi Inggris: bacaan, pertanyaan, dan pilihan jawaban dalam Bahasa
  // Inggris; pembahasan tetap Bahasa Indonesia (konsisten dengan UI app).
  const isEnglish = subtest === "literasi-inggris";
  const prompt = [
    isEnglish
      ? `Buatkan ${count} soal latihan gaya SNBT untuk subtes "${info.name}" in English (passage, question, and options in English; the explanation in Bahasa Indonesia).`
      : `Buatkan ${count} soal latihan gaya SNBT untuk subtes "${info.name}" dalam Bahasa Indonesia.`,
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
  let result;
  try {
    // Bounded retry + real cancellation: the signal aborts the underlying
    // HTTP request on timeout, and the SDK timeout is set to the same value.
    result = await callAiWithRetry((signal) =>
      model.generateContent(prompt, { timeout: AI_CALL_TIMEOUT_MS, signal }),
    );
  } catch (e) {
    // Overload or timeout: log the technical detail for debugging; the
    // caller falls back to the verified sample bank and shows the friendly
    // message (never the raw technical error).
    if (e instanceof AiTimeoutError || isRetryableAiError(e)) {
      console.error("LatihSNBT AI failure:", e instanceof Error ? e.message : e);
    }
    throw new AiError(aiFailureMessage(e));
  }
  const text = result.response.text();
  const questions = parseGeneratedQuestionsText(
    text,
    subtest,
    "ai",
    `ai-${subtest}-${Date.now()}`,
  );
  if (!questions || questions.length === 0) {
    throw new AiError("Jawaban AI tidak sesuai format soal yang diharapkan.");
  }
  return { questions: questions.slice(0, count), inferenceSource: readInferenceSource(result) };
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
  return { questions: [...focus, ...rest].slice(0, count), inferenceSource: null };
}
