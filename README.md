# LatihSNBT — Tryout SNBT Adaptif

> **#BuildHybridAI 2026** — https://firebasehybridaihackathon.devpost.com/
> Web app latihan soal SNBT adaptif untuk pelajar Indonesia, dibangun dengan
> **Firebase AI Logic** (hybrid inference: on-device + cloud).

**English summary:** LatihSNBT is an adaptive SNBT practice web app for
Indonesian students. SNBT (Seleksi Nasional Berdasarkan Tes) is Indonesia's
state-university entrance exam. The app generates original SNBT-style
questions live with Gemini through Firebase AI Logic, runs timed tryouts,
maps the student's weaknesses per subtopic, and builds a 7-day drill plan.
Free, no login, text-only.

## Yang bisa dilakukan app ini

1. **Pilih subtes** — Penalaran Matematika atau Literasi Bahasa Indonesia.
2. **Pilih mode** — Drill Cepat (5 soal, tanpa timer) atau Tryout (15 soal,
   berwaktu ~75 detik/soal seperti ujian asli).
3. **Soal dibuat AI secara live** — Gemini (lewat Firebase AI Logic) menulis
   soal orisinal gaya SNBT: teks soal, 4–5 pilihan jawaban, kunci jawaban,
   label subtopik, dan pembahasan tertulis.
4. **Hasil** — skor, pembahasan per soal, **peta kelemahan** per subtopik
   (misal "Aljabar 40%, Geometri 80%"), dan **rencana latihan 7 hari** yang
   menargetkan topik terlemah, plus tombol tryout ulang / drill per topik.
5. **Laporkan soal salah** — setiap soal punya tombol laporan; laporan
   tersimpan di localStorage.
6. **Progres tersimpan** — skor terbaik dan riwayat sesi tersimpan di
   localStorage (tanpa login).

Ini **bukan chatbot**: tidak ada kolom chat bebas. AI bekerja di dalam sistem
terstruktur — generate soal, menilai, mendiagnosis kelemahan, menyusun rencana.

## Firebase AI Logic (hybrid inference)

Semua inferensi AI lewat `firebase/ai` — tidak ada panggilan langsung ke API
model lain. Verifikasi API mengikuti dokumentasi resmi
https://firebase.google.com/docs/ai-logic:

```ts
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode, Schema } from "firebase/ai";

const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, {
  mode: InferenceMode.PREFER_ON_DEVICE, // drill cepat (Nano bila ada, cloud bila tidak)
  // mode: InferenceMode.PREFER_IN_CLOUD, // tryout + rencana latihan
  inCloudParams: {
    generationConfig: { responseMimeType: "application/json", responseSchema: schema },
  },
  onDeviceParams: { promptOptions: { responseConstraint: schema } },
});
const result = await model.generateContent(prompt);
result.response.text();           // JSON soal sesuai skema
result.response.inferenceSource;  // "ON_DEVICE" | "IN_CLOUD" — ditampilkan di UI
```

- **Drill cepat** memakai `PREFER_ON_DEVICE` (on-device Gemini Nano bila
  tersedia, fallback ke cloud). **Tryout + rencana latihan** memakai
  `PREFER_IN_CLOUD`.
- Nama model cloud **tidak** di-hardcode: dipakai model default SDK
  (gemini-3.5-flash-lite, sesuai dokumentasi JS SDK v13.0.0+).
- Output terstruktur via `Schema` helpers + `responseMimeType:
  "application/json"` (cloud) dan `responseConstraint` (on-device), lalu
  divalidasi ketat sebelum ditampilkan — jawaban AI yang tidak sesuai format
  ditolak.
- **Catatan jujur:** on-device memakai Chrome Prompt API (Gemini Nano) yang
  dukungannya untuk Bahasa Indonesia masih terbatas — prompt Bahasa Indonesia
  biasanya fallback ke cloud. Itu perilaku yang dirancang oleh
  `PREFER_ON_DEVICE`, dan UI selalu menampilkan sumber inferensi yang
  benar-benar dipakai (tidak pernah dipalsukan).

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest (logika murni: skor, peta kelemahan, rencana, timer, validasi JSON)
npm run type-check
npm run build
```

## Menghubungkan Firebase (langkah pemilik project)

1. Buat project di [Firebase console](https://console.firebase.google.com/)
   → **AI Services > AI Logic** → Get started → pilih **Gemini Developer API**
   (gratis) dan ikuti workflow-nya (App Check ikut ditegakkan otomatis).
2. Daftarkan Web App di project itu, salin konfigurasi web-nya.
3. Salin `.env.example` ke `.env.local` dan isi dengan konfigurasi projectmu.
4. Untuk pengembangan lokal: set `NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG=true`,
   jalankan app, salin **debug token** dari console browser, lalu daftarkan di
   Firebase console (**Security > App Check > Apps > Manage debug tokens**).
   Jangan pernah commit token itu ke mana pun. Untuk production, isi
   `NEXT_PUBLIC_FIREBASE_RECAPTCHA_ENTERPRISE_SITE_KEY` dengan site key
   reCAPTCHA Enterprise dari Firebase console (App Check) — tanpa itu, App
   Check tidak diinisialisasi dan panggilan AI hanya jalan bila project tidak
   menegakkan App Check.
5. Deploy ke Vercel dengan env var yang sama (Production).

**Tanpa konfigurasi Firebase**, app tetap jalan dalam **mode contoh**: memakai
10 soal contoh tulisan tangan (5 per subtest, diberi label "Soal contoh") dan
menampilkan banner "Firebase belum dikonfigurasi". App tidak pernah
berpura-pura panggilan AI berhasil.

## Struktur

```
src/
  app/            Next.js App Router (page.tsx = orkestrator alur)
  components/     HomeScreen, QuizScreen, ResultsScreen
  lib/
    types.ts          tipe + metadata 2 subtes
    logic.ts          logika murni (skor, peta kelemahan, rencana, timer, validasi JSON)
    logic.test.ts     Vitest
    sample-questions.ts  10 soal contoh orisinal (bukan salinan soal SNBT)
    storage.ts        localStorage (progres + laporan)
    firebase.ts       init Firebase dari env var + App Check debug (env-gated)
    ai.ts             generate soal + rencana latihan via Firebase AI Logic
```

## Catatan kejujuran

- Soal dibuat AI secara live dan **orisinal** — bukan salinan soal SNBT asli.
  Soal asli milik SNPMB dan tidak dipublikasi bebas.
- AI bisa membuat soal yang kunci jawabannya salah atau formatnya meleset —
  karena itu ada tombol "Laporkan soal salah" di setiap soal dan hasil.
- App ini gratis, tanpa login, tanpa paywall, text-only (tanpa image
  generation / TTS — tidak butuh kuota tambahan).

## Lisensi

MIT — lihat `LICENSE`.
