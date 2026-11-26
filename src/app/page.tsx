// LatihSNBT — home → drill/tryout → results → drill plan → retest.
// Client component: all AI calls happen in the browser through Firebase AI
// Logic; progress lives in localStorage (guests, no login).
"use client";

import { useCallback, useEffect, useState } from "react";
import HomeScreen from "../components/HomeScreen";
import QuizScreen from "../components/QuizScreen";
import ResultsScreen from "../components/ResultsScreen";
import { AiError, generateDrillPlan, generateQuestions, sampleSet } from "../lib/ai";
import type { GeneratedSet, GenerationStage } from "../lib/ai";
import { getFirebaseConfigStatus } from "../lib/firebase";
import { readLanguage, saveLanguage, t, type Language } from "../lib/i18n";
import {
  buildDrillPlanFallback,
  computeWeaknessMap,
  scoreSession,
} from "../lib/logic";
import { bestScoreFor, loadProgress, saveSession } from "../lib/storage";
import {
  DRILL_QUESTION_COUNT,
  DrillPlan,
  InferenceSource,
  Question,
  QuestionSource,
  SessionRecord,
  SUBTESTS,
  SubtestId,
  TRYOUT_QUESTION_COUNT,
  TRYOUT_SECONDS_PER_QUESTION,
  AnsweredQuestion,
  SessionMode,
  WeaknessEntry,
} from "../lib/types";

type Stage = "home" | "loading" | "quiz" | "results";

/** Loading-stage text while the AI generates and validates questions. */
function loadingStageText(lang: Language, stage: GenerationStage): string {
  if (stage === "generating") return t(lang, "loading.generating");
  if (stage === "regenerating") return t(lang, "loading.regenerating");
  return t(lang, "loading.bank");
}

/** Slim top bar on every screen: brand + ID/EN language toggle. */
function LanguageBar({ lang, onChange }: { lang: Language; onChange: (l: Language) => void }) {
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-4">
      <span className="text-sm font-bold text-emerald-900">LatihSNBT</span>
      <div
        className="flex rounded-lg border bg-white text-sm font-semibold"
        role="group"
        aria-label={t(lang, "lang.choose")}
      >
        {(["id", "en"] as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => onChange(l)}
            aria-pressed={lang === l}
            className={
              lang === l
                ? "rounded-lg bg-emerald-600 px-3 py-1 text-white"
                : "px-3 py-1 text-gray-700 hover:text-emerald-700"
            }
          >
            {l === "id" ? "ID" : "EN"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Language>(() => readLanguage());
  useEffect(() => {
    saveLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const [configured] = useState(() => getFirebaseConfigStatus().configured);
  const [stage, setStage] = useState<Stage>("home");
  const [loadingMsg, setLoadingMsg] = useState(() => t(readLanguage(), "loading.making"));
  const [notice, setNotice] = useState<string | null>(null);

  const [subtest, setSubtest] = useState<SubtestId>("matematika");
  const [mode, setMode] = useState<SessionMode>("drill");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [source, setSource] = useState<QuestionSource>("contoh");
  const [inferenceSource, setInferenceSource] = useState<InferenceSource>(null);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  // AbortController for the in-flight generation (the loading Cancel
  // button). Null in sample mode, where the set is instant.
  const [loadingController, setLoadingController] = useState<AbortController | null>(null);

  const cancelLoading = useCallback(() => {
    loadingController?.abort();
    setLoadingController(null);
    setStage("home");
  }, [loadingController]);

  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [result, setResult] = useState({ correct: 0, total: 0, score: 0 });
  const [weakness, setWeakness] = useState<WeaknessEntry[]>([]);
  const [plan, setPlan] = useState<DrillPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);

  const [history, setHistory] = useState<SessionRecord[]>([]);
  useEffect(() => {
    setHistory(loadProgress());
  }, []);

  const bestScores = Object.fromEntries(
    (Object.keys(SUBTESTS) as SubtestId[]).map((id) => [id, bestScoreFor(id)]),
  ) as Record<SubtestId, number | null>;

  const startSession = useCallback(
    async (st: SubtestId, m: SessionMode, focusSubtopics?: string[]) => {
      setSubtest(st);
      setMode(m);
      setNotice(null);
      setPlan(null);
      setStage("loading");
      const count = m === "drill" ? DRILL_QUESTION_COUNT : TRYOUT_QUESTION_COUNT;
      // In sample mode a Tryout serves at most the subtest's bank size
      // (14 for the five newer subtests). In AI mode the request is 15, but
      // the served set can be 14 when the Verified Bank fills the shortfall
      // for a subtest whose bank holds only 14 questions.
      const tryoutCount = configured ? TRYOUT_QUESTION_COUNT : SUBTESTS[st].bankSize;
      setLoadingMsg(
        m === "drill"
          ? t(lang, "loading.makingDrill", DRILL_QUESTION_COUNT)
          : t(lang, "loading.makingTryout", tryoutCount),
      );

      let set: GeneratedSet;
      let src: QuestionSource;
      if (!configured) {
        // Sample mode: hand-written questions per subtest, shuffled.
        set = sampleSet(st, count, focusSubtopics);
        src = "contoh";
        setNotice(t(lang, "notice.sampleMode", SUBTESTS[st].bankSize));
      } else {
        const controller = new AbortController();
        setLoadingController(controller);
        try {
          set = await generateQuestions(st, count, m, focusSubtopics, {
            signal: controller.signal,
            onProgress: (stage) => setLoadingMsg(loadingStageText(lang, stage)),
            lang,
          });
          src = "ai";
          // Honest notice when the bank filled part (or all) of the set.
          if (set.bankOnly) {
            // Non-numeric subtest: no AI generation was attempted at all —
            // the set is the audited seed bank, and the badge says so.
            setNotice(t(lang, "notice.bankOnly"));
          } else if (set.fromBank && set.fromBank > 0) {
            setNotice(
              set.generationFailed
                ? set.fromBank === set.questions.length
                  ? t(lang, "notice.aiFailedAll")
                  : t(lang, "notice.aiFailedPart")
                : t(lang, "notice.invalidReplaced"),
            );
          }
        } catch (e) {
          // Only reachable when the Verified Bank is empty too (the audited
          // seed is static, so this is near-impossible). Show the safe
          // failure message and stay on Home — never serve an unvalidated
          // question, and never silently fall back to the raw sample set.
          const reason = e instanceof AiError ? e.message : t(lang, "notice.unreachable");
          setNotice(reason);
          setLoadingController(null);
          setStage("home");
          return;
        }
        setLoadingController(null);
        // The student pressed Batalkan while loading: discard the set and
        // stay on Home. (A budget expiry does NOT abort this signal, so a
        // bank-filled set still reaches the quiz.)
        if (controller.signal.aborted) {
          setStage("home");
          return;
        }
      }
      setQuestions(set.questions);
      setInferenceSource(set.inferenceSource);
      setSource(src);
      setDeadlineMs(
        m === "tryout"
          ? Date.now() + set.questions.length * TRYOUT_SECONDS_PER_QUESTION * 1000
          : null,
      );
      setStage("quiz");
    },
    [configured, lang],
  );

  const finishSession = useCallback(
    async (answers: (number | null)[]) => {
      const done: AnsweredQuestion[] = questions.map((q, i) => {
        const selected = answers[i] ?? null;
        return { question: q, selectedIndex: selected, correct: selected === q.answerIndex };
      });
      const scored = scoreSession(done);
      setAnswered(done);
      setResult(scored);
      setWeakness(computeWeaknessMap(done));
      const record: SessionRecord = {
        id: `sesi-${Date.now()}`,
        date: new Date().toISOString(),
        subtest,
        mode,
        total: scored.total,
        correct: scored.correct,
        score: scored.score,
        source,
        inferenceSource,
      };
      setHistory(saveSession(record));

      // Drill plan: AI (cloud) when configured, otherwise the deterministic
      // fallback built from the weakness map.
      const map = computeWeaknessMap(done);
      setPlanLoading(true);
      setStage("results");
      if (configured) {
        const aiPlan = await generateDrillPlan(subtest, map, lang);
        setPlan(aiPlan ?? buildDrillPlanFallback(map, lang));
      } else {
        setPlan(buildDrillPlanFallback(map, lang));
      }
      setPlanLoading(false);
    },
    [questions, subtest, mode, source, inferenceSource, configured, lang],
  );

  if (stage === "loading") {
    return (
      <main>
        <LanguageBar lang={lang} onChange={setLang} />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-lg font-semibold text-gray-800">{loadingMsg}</p>
          <p className="mt-2 text-sm text-gray-500">
            {configured ? t(lang, "loading.liveLine") : t(lang, "loading.sampleLine")}
          </p>
          {loadingController && (
            <button
              onClick={cancelLoading}
              className="mt-6 rounded-lg border bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:border-red-400 hover:text-red-700"
            >
              {t(lang, "loading.cancel")}
            </button>
          )}
        </div>
      </main>
    );
  }

  if (stage === "quiz") {
    return (
      <main>
        <LanguageBar lang={lang} onChange={setLang} />
        {notice && (
          <div className="mx-auto mt-4 max-w-3xl px-4">
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {notice}
            </div>
          </div>
        )}
        <QuizScreen
          lang={lang}
          subtest={subtest}
          mode={mode}
          questions={questions}
          inferenceSource={inferenceSource}
          deadlineMs={deadlineMs}
          onFinish={finishSession}
          onCancel={() => {
            setNotice(null);
            setStage("home");
          }}
        />
      </main>
    );
  }

  if (stage === "results") {
    return (
      <main>
        <LanguageBar lang={lang} onChange={setLang} />
        {notice && (
          <div className="mx-auto mt-4 max-w-3xl px-4">
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {notice}
            </div>
          </div>
        )}
        <ResultsScreen
          lang={lang}
          subtest={subtest}
          mode={mode}
          answered={answered}
          score={result.score}
          correct={result.correct}
          total={result.total}
          weakness={weakness}
          plan={plan}
          planLoading={planLoading}
          inferenceSource={inferenceSource}
          onRetest={() => startSession(subtest, mode)}
          onDrillSubtopic={(topic) => startSession(subtest, "drill", [topic])}
          onHome={() => {
            setNotice(null);
            setStage("home");
          }}
        />
      </main>
    );
  }

  return (
    <main>
      <LanguageBar lang={lang} onChange={setLang} />
      {notice && (
        <div className="mx-auto mt-4 max-w-3xl px-4">
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {notice}
          </div>
        </div>
      )}
      <HomeScreen
        lang={lang}
        configured={configured}
        bestScores={bestScores}
        recent={history}
        onStart={(st, m) => startSession(st, m)}
      />
      <div className="mx-auto max-w-3xl px-4 pb-6 text-center text-xs text-gray-400">
        {t(lang, "page.footer")}
      </div>
    </main>
  );
}
