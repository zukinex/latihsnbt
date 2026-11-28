# Demo Video Script — LatihSNBT (≤3 min, #BuildHybridAI 2026)

> Rules: public YouTube, ≤3 min, English or English subtitles. The first 30
> seconds must show the idea, who it's for, the problem, and how Firebase AI
> Logic makes it work. Record the screen (OBS), add English TTS voiceover in
> CapCut (same pattern as the KiroPay video), keep the app UI in Indonesian —
> the narration explains it. Gate MET 27 Nov 2026 (Hydrogen E2E passed:
> tryout 1/3 AI questions + AI drill plan in 16.5s) — safe to record.
> Show the source badge honestly on camera; if a session falls back to
> the verified bank, say so in the narration instead of hiding it.

## Total runtime target: ~2 min 30 s

### 0:00–0:30 — The idea (must land here)
- **Visual:** home screen of LatihSNBT (seven subtests, two modes visible).
- **Narration:** "Meet LatihSNBT — an adaptive SNBT tryout app for Indonesian
  students. Every year, hundreds of thousands of students take SNBT, the
  university entrance exam — but the best prep apps charge for tryouts, and a
  chatbot can't time you, score you, or tell you what to fix. LatihSNBT
  generates its own questions with Gemini through Firebase AI Logic, finds
  your weak topics, and builds your 7-day drill plan. Free, no login."
- **On-screen text:** "LatihSNBT — adaptive SNBT tryouts • free • no login"

### 0:30–1:00 — Quick Drill (on-device)
- **Visual:** pick Penalaran Matematika → Drill Cepat → answer 2 questions
  (one right, one wrong). Point at the inference-source badge when it shows.
- **Narration:** "A quick drill uses on-device inference when it's available
  — Gemini Nano on the device, falling back to the cloud. The app shows the
  real source of every generation, right here."

### 1:00–1:40 — Timed Tryout (cloud)
- **Visual:** start a Tryout (15 questions, timer counting down ~75 s per
  question). Answer a few, let the timer be visible. Jump-cut to the results
  screen (do not play all 15 on camera).
- **Narration:** "The full tryout runs timed, like the real exam — fifteen
  questions, seventy-five seconds each — and uses cloud inference for the
  deeper generation and analysis."

### 1:40–2:15 — Results: weakness map + 7-day plan
- **Visual:** results screen — score, per-question explanations, weakness
  map per subtopic ("Aljabar 40%, Geometri 80%"), then the 7-day drill plan
  with "Mulai drill" per day. Click one drill day.
- **Narration:** "Then it diagnoses you: a weakness map per subtopic, and a
  seven-day drill plan that targets your weakest topics — then you retest and
  measure the improvement. And if a question is wrong, you can report it
  right here."

### 2:15–2:30 — Close
- **Visual:** home screen again; repo link on screen.
- **Narration:** "LatihSNBT — practice that adapts to you. Built with
  Firebase AI Logic, hybrid on-device and cloud."
- **On-screen text:** app URL + github.com/zukinex/latihsnbt

## Checklist before recording
- [ ] Firebase project live, real config in `.env.local`, App Check working
- [ ] One full live drill + one live tryout completed without errors
- [ ] Browser in Chrome with the Prompt API flag on if showing on-device
      (otherwise the badge will honestly show IN_CLOUD — fine, show it)
- [ ] Screen recording 1600×900, app in Indonesian, TTS narration in English
- [ ] YouTube title: "LatihSNBT — adaptive SNBT tryouts with Firebase AI Logic (#BuildHybridAI 2026)"
- [ ] Description: one-line pitch + app URL + repo URL (FREECOIN channel
      needs phone verification before links become clickable — same as KiroPay)
