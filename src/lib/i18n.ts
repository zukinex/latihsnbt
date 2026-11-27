// UI language support for LatihSNBT (ID/EN toggle).
//
// The app's CONTENT stays Indonesian: SNBT is an Indonesian exam, so the
// questions, explanations and subtest names are Indonesian in both modes
// (like a proper noun). What translates is the UI chrome — buttons,
// headers, badges, notices, loading text, drill-plan templates — plus the
// subtopic DISPLAY names (subtopicLabel): the stored subtopic values stay
// Indonesian so validation, weakness grouping and drill plans keep using
// the same keys, but what the student reads translates in EN mode.
// That is what "the app must at least support English" (#BuildHybridAI
// FAQ) asks for, and the home screen says so explicitly: the audience is
// Indonesian students preparing for SNBT.
//
// Default language is Indonesian ("id"), persisted in localStorage.
// Every key MUST have a non-empty id and en value (enforced by
// i18n.test.ts). Placeholders are {0}, {1}, ... — both languages must use
// the same placeholders (also enforced by the test).

import type { SubtestId } from "./types";

export type Language = "id" | "en";

export const LANGUAGE_STORAGE_KEY = "latihsnbt-lang-v1";

export function isLanguage(v: unknown): v is Language {
  return v === "id" || v === "en";
}

/** Stored language, or "id" when nothing is stored / SSR / corrupt data. */
export function readLanguage(): Language {
  if (typeof window === "undefined") return "id";
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(raw) ? raw : "id";
  } catch {
    return "id";
  }
}

export function saveLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // Storage unavailable — language choice is best-effort.
  }
}

const STRINGS = {
  // --- Top bar ---
  "lang.choose": { id: "Pilih bahasa", en: "Choose language" },
  // --- Loading stage (page.tsx) ---
  "loading.generating": { id: "Membuat soal dengan AI…", en: "Generating questions with AI…" },
  "loading.regenerating": {
    id: "Memvalidasi soal, membuat ulang yang belum lolos…",
    en: "Validating questions, regenerating the ones that failed…",
  },
  "loading.bank": {
    id: "Melengkapi dari bank soal terverifikasi…",
    en: "Filling in from the verified question bank…",
  },
  "loading.making": { id: "Membuat soal…", en: "Making questions…" },
  "loading.makingDrill": { id: "Membuat {0} soal drill…", en: "Making {0} drill questions…" },
  "loading.makingTryout": { id: "Membuat {0} soal tryout…", en: "Making {0} tryout questions…" },
  "loading.liveLine": {
    id: "Soal dibuat live oleh AI lewat Firebase AI Logic.",
    en: "Questions are generated live by AI through Firebase AI Logic.",
  },
  "loading.sampleLine": {
    id: "Soal dibuat dari bank soal contoh.",
    en: "Questions come from the sample question bank.",
  },
  "loading.cancel": { id: "Batalkan", en: "Cancel" },
  // --- Notices (page.tsx) ---
  "notice.sampleMode": {
    id: "Firebase belum dikonfigurasi — memakai soal contoh. Bank soal contoh berisi {0} soal untuk subtes ini.",
    en: "Firebase is not configured — using sample questions. The sample bank holds {0} questions for this subtest.",
  },
  "notice.bankOnly": {
    id: "Soal untuk subtes ini diambil dari bank soal terverifikasi.",
    en: "Questions for this subtest come from the verified question bank.",
  },
  "notice.aiFailedAll": {
    id: "AI tidak dapat membuat soal saat ini — memakai soal terverifikasi dari bank.",
    en: "AI could not generate questions right now — using verified questions from the bank.",
  },
  "notice.aiFailedPart": {
    id: "AI tidak dapat membuat semua soal — sebagian diganti dari bank soal terverifikasi.",
    en: "AI could not generate all questions — some were replaced from the verified question bank.",
  },
  "notice.invalidReplaced": {
    id: "Beberapa soal AI belum lolos validasi dan diganti dari bank soal terverifikasi.",
    en: "Some AI questions did not pass validation and were replaced from the verified question bank.",
  },
  "notice.unreachable": { id: "AI tidak dapat dihubungi.", en: "AI could not be reached." },
  // --- Page footer ---
  "page.footer": {
    id: "LatihSNBT · #BuildHybridAI 2026 · 7 subtes SNBT · 100 soal contoh terverifikasi",
    en: "LatihSNBT · #BuildHybridAI 2026 · 7 SNBT subtests · 100 verified sample questions",
  },
  // --- Home screen ---
  "home.tagline": {
    id: "Tryout SNBT adaptif untuk pelajar Indonesia. Soal dibuat AI, jawabanmu dinilai, kelemahanmu dipetakan, dan rencana latihan 7 hari disusun khusus buatmu.",
    en: "Adaptive SNBT tryouts for Indonesian students. AI writes the questions, your answers are scored, your weaknesses are mapped, and a 7-day drill plan is built just for you.",
  },
  "home.audience": {
    id: "Dibuat untuk pelajar Indonesia yang bersiap menghadapi SNBT — ujian masuk perguruan tinggi negeri.",
    en: "Built for Indonesian students preparing for SNBT, the national university entrance exam.",
  },
  "home.notConfiguredTitle": { id: "Firebase belum dikonfigurasi.", en: "Firebase is not configured." },
  "home.notConfiguredBody": {
    id: "App memakai soal contoh (ditulis tangan, diberi label “Soal contoh”) supaya alurnya tetap bisa dicoba. Untuk soal yang dibuat AI, hubungkan project Firebase — lihat README.",
    en: "The app uses sample questions (hand-written, labelled “Sample question”) so the flow can still be tried. For AI-generated questions, connect a Firebase project — see the README.",
  },
  "home.aiActiveTitle": { id: "AI aktif:", en: "AI is on:" },
  "home.aiActiveBody": {
    id: "soal dibuat live oleh Gemini lewat Firebase AI Logic (hybrid: on-device bila tersedia, cloud bila tidak).",
    en: "questions are generated live by Gemini through Firebase AI Logic (hybrid: on-device when available, cloud when not).",
  },
  "home.modeDrill": { id: "Drill Cepat", en: "Quick Drill" },
  "home.modeTryout": { id: "Tryout", en: "Tryout" },
  "home.drillDesc": { id: "5 soal, tanpa timer. Latihan singkat.", en: "5 questions, no timer. A quick practice." },
  "home.tryoutDesc": { id: "{0} soal, berwaktu seperti ujian asli.", en: "{0} questions, timed like the real exam." },
  "home.subtopicsLabel": { id: "Subtopik: {0}", en: "Subtopics: {0}" },
  "home.bestScore": { id: "Skor terbaikmu: {0}", en: "Your best score: {0}" },
  "home.history": { id: "Riwayat latihanmu", en: "Your practice history" },
  "home.historyModeDrill": { id: "Drill", en: "Drill" },
  "home.historyModeTryout": { id: "Tryout", en: "Tryout" },
  "home.historyResult": { id: "{0}/{1} · skor {2}", en: "{0}/{1} · score {2}" },
  "home.footer": {
    id: "Gratis, tanpa login. Soal dibuat AI secara live — bukan salinan soal SNBT asli (soal asli milik SNPMB dan tidak dipublikasi bebas). Ada soal yang salah? Laporkan dari layar soal atau hasil.",
    en: "Free, no login. Questions are generated live by AI — not copies of real SNBT questions (real questions belong to SNPMB and are not freely published). Found a wrong question? Report it from the question or results screen.",
  },
  // --- Quiz screen ---
  "quiz.home": { id: "← Beranda", en: "← Home" },
  "quiz.modeDrill": { id: "Drill Cepat", en: "Quick Drill" },
  "quiz.modeTryout": { id: "Tryout", en: "Tryout" },
  "quiz.noTimer": { id: "Tanpa timer", en: "No timer" },
  "quiz.progress": { id: "Soal {0} dari {1} · {2} terjawab", en: "Question {0} of {1} · {2} answered" },
  "quiz.report": { id: "Laporkan soal salah", en: "Report a wrong question" },
  "quiz.reported": { id: "✓ Laporanmu tersimpan, terima kasih", en: "✓ Your report is saved, thank you" },
  "quiz.keyHidden": {
    id: "Kunci jawaban tidak ditampilkan di sini.",
    en: "The answer key is not shown here.",
  },
  "quiz.prev": { id: "← Sebelumnya", en: "← Previous" },
  "quiz.next": { id: "Berikutnya →", en: "Next →" },
  "quiz.finish": { id: "Selesai & lihat hasil", en: "Finish & see results" },
  // --- Results screen ---
  "results.correctOf": { id: "{0} benar dari {1} soal", en: "{0} correct out of {1} questions" },
  "results.retestDrill": { id: "Drill lagi", en: "Drill again" },
  "results.retestTryout": { id: "Tryout ulang", en: "Retake tryout" },
  "results.backHome": { id: "Kembali ke beranda", en: "Back to home" },
  "results.weaknessMap": { id: "Peta kelemahanmu", en: "Your weakness map" },
  "results.weaknessSub": {
    id: "Persentase benar per subtopik — yang paling lemah di atas.",
    en: "Percent correct per subtopic — weakest first.",
  },
  "results.plan": { id: "Rencana latihan 7 hari", en: "7-day drill plan" },
  "results.planLoading": { id: "Menyusun rencanamu…", en: "Building your plan…" },
  "results.planAi": { id: "Disusun AI dari peta kelemahanmu.", en: "Built by AI from your weakness map." },
  "results.planAuto": {
    id: "Disusun otomatis dari peta kelemahanmu.",
    en: "Built automatically from your weakness map.",
  },
  "results.day": { id: "Hari {0} · {1}", en: "Day {0} · {1}" },
  "results.startDrill": { id: "Mulai drill", en: "Start drill" },
  "results.review": { id: "Pembahasan per soal", en: "Review per question" },
  "results.questionLabel": { id: "Soal {0} · {1}", en: "Question {0} · {1}" },
  "results.sampleQuestion": { id: "Soal contoh", en: "Sample question" },
  "results.yourAnswer": { id: "Jawabanmu:", en: "Your answer:" },
  "results.notAnswered": { id: "Tidak dijawab", en: "Not answered" },
  "results.correctAnswer": { id: "Jawaban benar:", en: "Correct answer:" },
  "results.explanation": { id: "Pembahasan:", en: "Explanation:" },
  "results.report": { id: "Laporkan soal salah", en: "Report a wrong question" },
  "results.reported": { id: "✓ Laporan tersimpan", en: "✓ Report saved" },
  // --- Logic labels (logic.ts) ---
  "logic.sample": { id: "Soal contoh", en: "Sample questions" },
  "logic.aiMade": { id: "Dibuat AI", en: "AI-generated" },
  "logic.mixed": { id: "Dibuat AI + soal contoh", en: "AI-generated + sample questions" },
  "logic.audit": { id: "diaudit manusia", en: "human-audited" },
  "logic.validator": { id: "lolos validasi otomatis", en: "passed automatic validation" },
  "logic.verified": { id: "terverifikasi", en: "verified" },
  "logic.partial": { id: "sebagian terverifikasi", en: "partially verified" },
  "logic.tagAudit": { id: "✓ Diaudit manusia", en: "✓ Human-audited" },
  "logic.tagValidator": { id: "✓ Lolos validasi otomatis", en: "✓ Passed automatic validation" },
  "logic.tagVerified": { id: "✓ Terverifikasi", en: "✓ Verified" },
  "logic.mixedSource": { id: "campuran", en: "mixed" },
  "logic.planRetest": { id: "Tryout ulang", en: "Full retest" },
  "logic.planRetestFocus": { id: "Ukur lagi setelah 6 hari latihan.", en: "Measure again after 6 days of practice." },
  "logic.planRetestTarget": {
    id: "Kerjakan 1 sesi Tryout dan bandingkan skormu.",
    en: "Do 1 Tryout session and compare your score.",
  },
  "logic.planFocusWeak": {
    id: "Fondasi {0} masih lemah ({1}% benar). Pelajari konsep dasarnya dulu, baru latihan soal.",
    en: "{0} foundations are still weak ({1}% correct). Learn the basics first, then practice questions.",
  },
  "logic.planFocusMid": {
    id: "{0} sudah lumayan ({1}% benar). Latihan soal yang lebih sulit.",
    en: "{0} is already decent ({1}% correct). Practice harder questions.",
  },
  "logic.planFocusStrong": {
    id: "{0} sudah kuat ({1}% benar). Jaga dengan latihan singkat.",
    en: "{0} is already strong ({1}% correct). Keep it up with short practice.",
  },
  "logic.planTarget": { id: "Kerjakan {0} soal drill {1}.", en: "Do {0} drill questions on {1}." },
  // --- AI error messages (ai.ts; shown in the notice banner) ---
  "ai.batchAborted": {
    id: "Permintaan AI dibatalkan (batas waktu batch tercapai).",
    en: "AI request was cancelled (batch time budget reached).",
  },
  "ai.notConfigured": { id: "Firebase belum dikonfigurasi.", en: "Firebase is not configured." },
  "ai.bankEmpty": {
    id: "AI tidak dapat membuat soal dan bank soal terverifikasi kosong. Coba lagi nanti.",
    en: "AI could not generate questions and the verified question bank is empty. Try again later.",
  },
  "ai.badFormat": {
    id: "Jawaban AI tidak sesuai format soal yang diharapkan.",
    en: "The AI answer did not match the expected question format.",
  },
} as const;

export type StringKey = keyof typeof STRINGS;

/** Translate a UI string. Placeholders {0}, {1}, ... are filled in order. */
export function t(lang: Language, key: StringKey, ...params: (string | number)[]): string {
  let s: string = STRINGS[key][lang];
  params.forEach((p, i) => {
    s = s.replaceAll(`{${i}}`, String(p));
  });
  return s;
}

/** All dictionary keys (the completeness test iterates this). */
export function stringKeys(): StringKey[] {
  return Object.keys(STRINGS) as StringKey[];
}

/** Raw entries (the placeholder-parity test reads these). */
export function stringEntries(): { key: StringKey; id: string; en: string }[] {
  return stringKeys().map((key) => ({ key, id: STRINGS[key].id, en: STRINGS[key].en }));
}

// Subtest descriptions are UI text, so they translate too. Names and short
// names stay Indonesian — they are the exam's own terms (the same in both
// languages, like a proper noun). Subtopic display names translate as
// well (SUBTOPIC_EN below); only the stored subtopic values stay
// Indonesian, as keys for validation, weakness grouping and drill plans.
const SUBTEST_DESCRIPTIONS: Record<SubtestId, { id: string; en: string }> = {
  matematika: {
    id: "Penalaran kuantitatif level SMA: fungsi dan pertumbuhan, peluang, optimasi, barisan dan deret, statistika.",
    en: "High-school quantitative reasoning: functions and growth, probability, optimization, sequences and series, statistics.",
  },
  literasi: {
    id: "Memahami bacaan level SNBT: simpulan, sikap penulis, evaluasi argumen, struktur teks, dan inferensi.",
    en: "Understanding SNBT-level reading: conclusions, author's stance, argument evaluation, text structure, and inference.",
  },
  "penalaran-umum": {
    id: "Penalaran induktif, deduktif, dan kuantitatif level SNBT: pola bilangan dan huruf, analogi, silogisme, dan penalaran angka.",
    en: "SNBT-level inductive, deductive, and quantitative reasoning: number and letter patterns, analogies, syllogisms, and numerical reasoning.",
  },
  "pengetahuan-umum": {
    id: "Leksikal, informasi umum, dan pengetahuan umum: makna kata dalam konteks, fakta, dan wawasan umum.",
    en: "Lexical, general information, and general knowledge: word meaning in context, facts, and general insight.",
  },
  "bacaan-menulis": {
    id: "Memilih, menata, dan memperbaiki gagasan dalam teks: gagasan utama, urutan kalimat yang logis, dan kalimat efektif.",
    en: "Choosing, organizing, and improving ideas in a text: main idea, logical sentence order, and effective sentences.",
  },
  "pengetahuan-kuantitatif": {
    id: "Matematika dasar level SNBT: bilangan, aljabar, geometri dan pengukuran, data dan peluang.",
    en: "Basic SNBT-level math: numbers, algebra, geometry and measurement, data and probability.",
  },
  "literasi-inggris": {
    id: "Reading comprehension in English: main idea, inference, vocabulary in context, and author's purpose.",
    en: "Reading comprehension in English: main idea, inference, vocabulary in context, and author's purpose.",
  },
};

export function subtestDescription(lang: Language, id: SubtestId): string {
  return SUBTEST_DESCRIPTIONS[id][lang];
}

/**
 * English display names for subtopics, keyed by the Indonesian subtopic
 * value stored in SUBTESTS / Question.subtopic. The stored value never
 * changes — only what is shown translates (see subtopicLabel). Unknown
 * subtopics fall back to themselves, so a future bank addition can never
 * render blank. The four literasi-inggris subtopics are already English
 * and map to themselves.
 */
const SUBTOPIC_EN: Record<string, string> = {
  "Fungsi dan pertumbuhan": "Functions and growth",
  Peluang: "Probability",
  Optimasi: "Optimization",
  "Barisan dan deret": "Sequences and series",
  Statistika: "Statistics",
  Simpulan: "Conclusions",
  "Sikap penulis": "Author's stance",
  "Evaluasi argumen": "Argument evaluation",
  "Struktur teks": "Text structure",
  Inferensi: "Inference",
  Induktif: "Inductive",
  Deduktif: "Deductive",
  Kuantitatif: "Quantitative",
  Leksikal: "Vocabulary",
  "Informasi umum": "General information",
  "Pengetahuan umum": "General knowledge",
  "Pemilihan gagasan": "Idea selection",
  "Penataan gagasan": "Idea organization",
  "Perbaikan gagasan": "Idea revision",
  Bilangan: "Numbers",
  Aljabar: "Algebra",
  "Geometri dan pengukuran": "Geometry and measurement",
  "Data dan peluang": "Data and probability",
  "Main idea": "Main idea",
  Inference: "Inference",
  "Vocabulary in context": "Vocabulary in context",
  "Author's purpose": "Author's purpose",
};

/** Display name for a subtopic in the given language. */
export function subtopicLabel(subtopic: string, lang: Language): string {
  if (lang === "id") return subtopic;
  return SUBTOPIC_EN[subtopic] ?? subtopic;
}
