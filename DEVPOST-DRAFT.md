# Devpost Draft — LatihSNBT (#BuildHybridAI 2026)

> Draft only — paste into Devpost once the app is live. Submission materials
> must be in English. Links (hosted URL) to be filled after Vercel deploy.
> Do NOT submit before the live AI test passes.

## Project name
LatihSNBT

## Tagline (pitch, one line)
Adaptive SNBT tryouts that generate their own questions, find your weak
topics, and build your 7-day drill plan — free, no login.

## Description

**The problem.** Every year, hundreds of thousands of Indonesian high-school
graduates take SNBT (Seleksi Nasional Berdasarkan Tes), the state-university
entrance exam. The best prep tools are freemium tryout apps with fixed
question banks — free tiers run out after a few questions, and a student who
can't pay is stuck re-reading the same bank. Asking a generic chatbot for
practice questions is no better: no timer, no scoring, no diagnosis of what
to fix.

**What LatihSNBT does.** A student picks one of 7 SNBT subtests (Penalaran
Umum, Pengetahuan dan Pemahaman Umum, Pemahaman Bacaan dan Menulis,
Pengetahuan Kuantitatif, Literasi Bahasa Indonesia, Literasi dalam Bahasa
Inggris, or Penalaran Matematika) and a mode — Quick Drill (5 questions, no
timer) or full Tryout (15 questions, timed at ~75 seconds per question, like
the real exam). The app then:

1. Generates original SNBT-style questions live — question text, 4–5 options,
   answer key, subtopic label, and a written explanation for every item.
2. Scores instantly and shows the explanation per question.
3. Builds a **weakness map** per subtopic (e.g. "Algebra 40%, Geometry 80%").
4. Turns the map into a **7-day drill plan** targeting the weakest topics,
   with a "start drill" button per day — then retests to measure improvement.
5. Lets the student report any wrong question ("Laporkan soal salah") on
   every item, because AI-generated keys can be wrong.

This is not a chatbot: there is no free-text chat box. AI works inside a
structured system — generate, score, diagnose, plan.

**Who it's for.** Indonesian students preparing for SNBT, especially those
who can't afford paid tryout packages. The app is free, needs no login, and
keeps progress in the browser.

**How Firebase AI Logic is used (all AI goes through it — no direct calls to
any other model API).** The app calls Gemini through `firebase/ai`
(`getAI` + `GoogleAIBackend` + `getGenerativeModel`). Quick drills use
`InferenceMode.PREFER_ON_DEVICE` — Gemini Nano on the device when available,
falling back to the cloud; the full tryout and the drill plan use
`InferenceMode.PREFER_IN_CLOUD`. Questions are generated as structured JSON
via `Schema` helpers (`responseMimeType: "application/json"` in the cloud,
`responseConstraint` on-device) and strictly validated before display —
invalid AI output is rejected, never shown. The UI always shows the real
inference source of each generation (`ON_DEVICE` or `IN_CLOUD`), so the
hybrid behaviour is visible, not claimed. App Check is enforced (debug
tokens in local dev only, never committed; reCAPTCHA Enterprise in
production).

**Honest notes for the judges.** Real SNBT questions belong to SNPMB and are
not freely published, so every question is AI-generated and original — never
copied. On-device Gemini Nano has limited support for Indonesian, so
Indonesian prompts usually fall back to the cloud under `PREFER_ON_DEVICE`;
that is the designed behaviour, and the UI reports the actual source.
The app is text-only: no image generation, no TTS.

## Built with
Next.js, React, TypeScript, Tailwind CSS, Firebase AI Logic, Vercel

## Links (fill after deploy)
- Hosted app: [TODO — Vercel URL]
- Repo: https://github.com/zukinex/latihsnbt (public, MIT)
- Demo video: [TODO — public YouTube, ≤3 min]

## Platform
Web (Chrome)

## Category / prizes aimed at
Best Web (Chrome) — and Grand Prize.
