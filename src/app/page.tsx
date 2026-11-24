// LatihSNBT — home → drill/tryout → results → drill plan → retest.
// Client component: all AI calls happen in the browser through Firebase AI
// Logic; progress lives in localStorage (guests, no login).
"use client";

import { useCallback, useEffect, useState } from "react";
import HomeScreen from "../components/HomeScreen";
import QuizScreen from "../components/QuizScreen";
import ResultsScreen from "../components/ResultsScreen";
import { AiError, generateDrillPlan, generateQuestions, sampleSet } from "../lib/ai";
import { getFirebaseConfigStatus } from "../lib/firebase";
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

export default function Home() {
  const [configured] = useState(() => getFirebaseConfigStatus().configured);
  const [stage, setStage] = useState<Stage>("home");
  const [loadingMsg, setLoadingMsg] = useState("Membuat soal…");
  const [notice, setNotice] = useState<string | null>(null);

  const [subtest, setSubtest] = useState<SubtestId>("matematika");
  const [mode, setMode] = useState<SessionMode>("drill");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [source, setSource] = useState<QuestionSource>("contoh");
  const [inferenceSource, setInferenceSource] = useState<InferenceSource>(null);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);

  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [result, setResult] = useState({ correct: 0, total: 0, score: 0 });
  const [weakness, setWeakness] = useState<WeaknessEntry[]>([]);
  const [plan, setPlan] = useState<DrillPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);

  const [history, setHistory] = useState<SessionRecord[]>([]);
  useEffect(() => {
    setHistory(loadProgress());
  }, []);

  const bestScores = {
    matematika: bestScoreFor("matematika"),
    literasi: bestScoreFor("literasi"),
  };

  const startSession = useCallback(
    async (st: SubtestId, m: SessionMode, focusSubtopics?: string[]) => {
      setSubtest(st);
      setMode(m);
      setNotice(null);
      setPlan(null);
      setStage("loading");
      const count = m === "drill" ? DRILL_QUESTION_COUNT : TRYOUT_QUESTION_COUNT;
      setLoadingMsg(
        m === "drill" ? "Membuat 5 soal drill…" : "Membuat 15 soal tryout…",
      );

      let set: { questions: Question[]; inferenceSource: InferenceSource };
      let src: QuestionSource;
      if (!configured) {
        // Sample mode: 5 hand-written questions per subtest (tryout also
        // uses the 5 samples — there is no bigger sample bank).
        set = sampleSet(st);
        src = "contoh";
        setNotice(
          "Firebase belum dikonfigurasi — memakai soal contoh. Mode contoh hanya menyediakan 5 soal per subtest.",
        );
      } else {
        try {
          set = await generateQuestions(st, count, m, focusSubtopics);
          src = "ai";
        } catch (e) {
          set = sampleSet(st);
          src = "contoh";
          const reason = e instanceof AiError ? e.message : "AI tidak dapat dihubungi.";
          setNotice(`${reason} Memakai soal contoh (5 soal per subtest).`);
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
    [configured],
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
        const aiPlan = await generateDrillPlan(subtest, map);
        setPlan(aiPlan ?? buildDrillPlanFallback(map));
      } else {
        setPlan(buildDrillPlanFallback(map));
      }
      setPlanLoading(false);
    },
    [questions, subtest, mode, source, inferenceSource, configured],
  );

  if (stage === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-semibold text-gray-800">{loadingMsg}</p>
        <p className="mt-2 text-sm text-gray-500">
          Soal dibuat {configured ? "live oleh AI lewat Firebase AI Logic" : "dari bank soal contoh"}.
        </p>
      </main>
    );
  }

  if (stage === "quiz") {
    return (
      <main>
        {notice && (
          <div className="mx-auto mt-4 max-w-3xl px-4">
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {notice}
            </div>
          </div>
        )}
        <QuizScreen
          subtest={subtest}
          mode={mode}
          questions={questions}
          source={source}
          inferenceSource={inferenceSource}
          deadlineMs={deadlineMs}
          onFinish={finishSession}
          onCancel={() => setStage("home")}
        />
      </main>
    );
  }

  if (stage === "results") {
    return (
      <main>
        {notice && (
          <div className="mx-auto mt-4 max-w-3xl px-4">
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {notice}
            </div>
          </div>
        )}
        <ResultsScreen
          subtest={subtest}
          mode={mode}
          answered={answered}
          score={result.score}
          correct={result.correct}
          total={result.total}
          weakness={weakness}
          plan={plan}
          planLoading={planLoading}
          source={source}
          inferenceSource={inferenceSource}
          onRetest={() => startSession(subtest, mode)}
          onDrillSubtopic={(topic) => startSession(subtest, "drill", [topic])}
          onHome={() => setStage("home")}
        />
      </main>
    );
  }

  return (
    <main>
      <HomeScreen
        configured={configured}
        bestScores={bestScores}
        recent={history}
        onStart={(st, m) => startSession(st, m)}
      />
      <div className="mx-auto max-w-3xl px-4 pb-6 text-center text-xs text-gray-400">
        LatihSNBT · #BuildHybridAI 2026 · {SUBTESTS.matematika.name} &amp;{" "}
        {SUBTESTS.literasi.name}
      </div>
    </main>
  );
}
