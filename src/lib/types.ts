// Shared types for LatihSNBT.
// SNBT = Seleksi Nasional Berdasarkan Tes, Indonesia's state-university
// entrance exam. All user-facing text is Bahasa Indonesia.

export type SubtestId =
  | "matematika"
  | "literasi"
  | "penalaran-umum"
  | "pengetahuan-umum"
  | "bacaan-menulis"
  | "pengetahuan-kuantitatif"
  | "literasi-inggris";

export type SessionMode = "drill" | "tryout";

/** Where a question came from. Never fake an AI call: 'contoh' questions
 *  are hand-written samples, 'ai' questions were generated live by Gemini
 *  through Firebase AI Logic. */
export type QuestionSource = "ai" | "contoh";

/** Which inference path actually served a generation (Firebase AI Logic
 *  `response.inferenceSource`). "MIXED" means the session's two generation
 *  batches came from different sources (one on-device, one cloud) — the
 *  session must never be labelled as if every question came from one
 *  source (see combineInferenceSources in ai.ts). */
export type InferenceSource = "ON_DEVICE" | "IN_CLOUD" | "MIXED" | null;

export interface Question {
  id: string;
  subtest: SubtestId;
  /** e.g. "Aljabar", "Geometri", "Ide pokok" — used for the weakness map. */
  subtopic: string;
  text: string;
  /** 4-5 options, labelled A-E in the UI. */
  options: string[];
  /** Index into `options` of the correct answer. */
  answerIndex: number;
  /** Written explanation shown on the results screen (pembahasan). */
  explanation: string;
  source: QuestionSource;
  /**
   * Set by the Verified Question Bank when serving: this question passed a
   * verification gate (hand audit of the sample bank, or the deterministic
   * validator for AI questions). Absent on unvalidated questions.
   */
  verified?: boolean;
  /**
   * Which gate verified this question: "audit" for the hand-audited sample
   * seed, "validator" for AI questions that passed the deterministic
   * validator. Kept alongside `verified` so the UI can tell the two apart
   * ("Diaudit manusia" vs "Lolos validasi otomatis") instead of one shared
   * "terverifikasi" label. Absent when `verified` is absent.
   */
  verifiedBy?: "audit" | "validator";
  /**
   * Set by the crowd-report overlay when ten distinct devices agreed this
   * question's key was wrong and picked the same correct option: the
   * answerIndex (and explanation, when supplied) on this object is the
   * corrected one. The seed bank is never modified — the fix is applied
   * at serve time only.
   */
  corrected?: boolean;
}

export interface SubtestInfo {
  id: SubtestId;
  name: string;
  short: string;
  description: string;
  /** Subtopics the AI is asked to cover (also the weakness-map axes). */
  subtopics: string[];
  /**
   * True when this subtest's questions have numeric keys, so AI-generated
   * questions can pass the deterministic validator. False for
   * reading/reasoning subtests: their questions are served from the Verified
   * Bank instead of burning AI calls that can never return VALID.
   */
  numericQuestions: boolean;
  /** How many hand-written sample questions exist for this subtest
   *  (25/25/24/24/24/24/24 after the 2026-11-28 batch-2 expansion).
   *  A sample-mode Tryout serves at most this many questions. */
  bankSize: number;
}

export const SUBTESTS: Record<SubtestId, SubtestInfo> = {
  matematika: {
    id: "matematika",
    name: "Penalaran Matematika",
    short: "Matematika",
    description:
      "Penalaran kuantitatif level SMA: fungsi dan pertumbuhan, peluang, optimasi, barisan dan deret, statistika.",
    subtopics: ["Fungsi dan pertumbuhan", "Peluang", "Optimasi", "Barisan dan deret", "Statistika"],
    numericQuestions: true,
    bankSize: 25,
  },
  literasi: {
    id: "literasi",
    name: "Literasi Bahasa Indonesia",
    short: "Literasi",
    description:
      "Memahami bacaan level SNBT: simpulan, sikap penulis, evaluasi argumen, struktur teks, dan inferensi.",
    subtopics: ["Simpulan", "Sikap penulis", "Evaluasi argumen", "Struktur teks", "Inferensi"],
    numericQuestions: false,
    bankSize: 25,
  },
  "penalaran-umum": {
    id: "penalaran-umum",
    name: "Penalaran Umum",
    short: "Penalaran Umum",
    description:
      "Penalaran induktif, deduktif, dan kuantitatif level SNBT: pola bilangan dan huruf, analogi, silogisme, dan penalaran angka.",
    subtopics: ["Induktif", "Deduktif", "Kuantitatif"],
    numericQuestions: true,
    bankSize: 24,
  },
  "pengetahuan-umum": {
    id: "pengetahuan-umum",
    name: "Pengetahuan dan Pemahaman Umum",
    short: "Pengetahuan Umum",
    description:
      "Leksikal, informasi umum, dan pengetahuan umum: makna kata dalam konteks, fakta, dan wawasan umum.",
    subtopics: ["Leksikal", "Informasi umum", "Pengetahuan umum"],
    numericQuestions: false,
    bankSize: 24,
  },
  "bacaan-menulis": {
    id: "bacaan-menulis",
    name: "Pemahaman Bacaan dan Menulis",
    short: "Bacaan & Menulis",
    description:
      "Memilih, menata, dan memperbaiki gagasan dalam teks: gagasan utama, urutan kalimat yang logis, dan kalimat efektif.",
    subtopics: ["Pemilihan gagasan", "Penataan gagasan", "Perbaikan gagasan"],
    numericQuestions: false,
    bankSize: 24,
  },
  "pengetahuan-kuantitatif": {
    id: "pengetahuan-kuantitatif",
    name: "Pengetahuan Kuantitatif",
    short: "Kuantitatif",
    description:
      "Matematika dasar level SNBT: bilangan, aljabar, geometri dan pengukuran, data dan peluang.",
    subtopics: ["Bilangan", "Aljabar", "Geometri dan pengukuran", "Data dan peluang"],
    numericQuestions: true,
    bankSize: 24,
  },
  "literasi-inggris": {
    id: "literasi-inggris",
    name: "Literasi dalam Bahasa Inggris",
    short: "Literasi Inggris",
    description:
      "Reading comprehension in English: main idea, inference, vocabulary in context, and author's purpose.",
    subtopics: ["Main idea", "Inference", "Vocabulary in context", "Author's purpose"],
    numericQuestions: false,
    bankSize: 24,
  },
};

/** One answered question inside a finished session. */
export interface AnsweredQuestion {
  question: Question;
  /** null = not answered (e.g. timer ran out). */
  selectedIndex: number | null;
  correct: boolean;
}

export interface SessionRecord {
  id: string;
  date: string; // ISO string
  subtest: SubtestId;
  mode: SessionMode;
  total: number;
  correct: number;
  /** 0-100 */
  score: number;
  source: QuestionSource;
  inferenceSource: InferenceSource;
}

export interface WeaknessEntry {
  subtopic: string;
  total: number;
  correct: number;
  /** 0-100, rounded. 100 when total is 0 (nothing to fix). */
  percent: number;
}

export interface DrillDay {
  day: number;
  subtopic: string;
  focus: string;
  target: string;
}

export interface DrillPlan {
  /** "ai" = generated by Gemini (cloud); "aturan" = deterministic fallback
   *  built from the weakness map. The label is shown in the UI. */
  source: "ai" | "aturan";
  days: DrillDay[];
}

export const DRILL_QUESTION_COUNT = 5;
export const TRYOUT_QUESTION_COUNT = 15;
/** Seconds per question in Tryout mode (real SNBT pace is ~75-90s/question). */
export const TRYOUT_SECONDS_PER_QUESTION = 75;
