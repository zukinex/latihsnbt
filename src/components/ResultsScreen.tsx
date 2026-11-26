// Results screen: score, per-question review with explanations, weakness
// map per subtopic, and the 7-day drill plan (AI or deterministic fallback).
"use client";

import { useState } from "react";
import {
  inferenceSourceLabel,
  sessionInferenceSource,
  sessionSourceInfo,
  verifiedTagText,
} from "../lib/logic";
import { isReported, reportQuestion } from "../lib/storage";
import {
  AnsweredQuestion,
  DrillPlan,
  InferenceSource,
  SUBTESTS,
  SubtestId,
  WeaknessEntry,
  type SessionMode,
} from "../lib/types";

const LETTERS = ["A", "B", "C", "D", "E"];

interface ResultsScreenProps {
  subtest: SubtestId;
  mode: SessionMode;
  answered: AnsweredQuestion[];
  score: number;
  correct: number;
  total: number;
  weakness: WeaknessEntry[];
  plan: DrillPlan | null;
  planLoading: boolean;
  inferenceSource: InferenceSource;
  onRetest: () => void;
  onDrillSubtopic: (subtopic: string) => void;
  onHome: () => void;
}

function ReportButton({ q }: { q: AnsweredQuestion["question"] }) {
  const [done, setDone] = useState(() => isReported(q.id));
  if (done) {
    return <span className="text-xs font-semibold text-emerald-700">✓ Laporan tersimpan</span>;
  }
  return (
    <button
      onClick={() => {
        reportQuestion({
          questionId: q.id,
          subtest: q.subtest,
          subtopic: q.subtopic,
          text: q.text,
          reportedAt: new Date().toISOString(),
        });
        setDone(true);
      }}
      className="text-xs text-gray-500 underline hover:text-gray-700"
    >
      Laporkan soal salah
    </button>
  );
}

export default function ResultsScreen({
  subtest,
  mode,
  answered,
  score,
  correct,
  total,
  weakness,
  plan,
  planLoading,
  inferenceSource,
  onRetest,
  onDrillSubtopic,
  onHome,
}: ResultsScreenProps) {
  // Source label + provenance from the questions actually served (a seed
  // question never shows as "Dibuat AI"). Same helper as QuizScreen: the
  // inference source is shown only when the session actually contains
  // AI-generated questions.
  const sourceInfo = sessionSourceInfo(answered.map((a) => a.question));
  const shownInference = sessionInferenceSource(
    answered.map((a) => a.question),
    inferenceSource,
  );
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-gray-600">
          {SUBTESTS[subtest].name} · {mode === "drill" ? "Drill Cepat" : "Tryout"}
        </p>
        <p className="mt-2 text-5xl font-extrabold text-emerald-700">{score}</p>
        <p className="mt-1 text-sm text-gray-700">
          {correct} benar dari {total} soal · {sourceInfo.label}
          {shownInference ? ` (${inferenceSourceLabel(shownInference)})` : ""}
          {` · ${sourceInfo.provenance}`}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            onClick={onRetest}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {mode === "drill" ? "Drill lagi" : "Tryout ulang"}
          </button>
          <button
            onClick={onHome}
            className="rounded-lg border bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:border-emerald-400"
          >
            Kembali ke beranda
          </button>
        </div>
      </div>

      <section className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Peta kelemahanmu</h2>
        <p className="text-xs text-gray-500">Persentase benar per subtopik — yang paling lemah di atas.</p>
        <ul className="mt-4 space-y-3">
          {weakness.map((w) => (
            <li key={w.subtopic}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800">{w.subtopic}</span>
                <span className="text-gray-600">
                  {w.correct}/{w.total} · {w.percent}%
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full ${w.percent < 50 ? "bg-red-500" : w.percent < 80 ? "bg-amber-500" : "bg-emerald-600"}`}
                  style={{ width: `${w.percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Rencana latihan 7 hari</h2>
        {planLoading && <p className="mt-2 text-sm text-gray-500">Menyusun rencanamu…</p>}
        {!planLoading && plan && (
          <>
            <p className="mt-1 text-xs text-gray-500">
              {plan.source === "ai"
                ? "Disusun AI dari peta kelemahanmu."
                : "Disusun otomatis dari peta kelemahanmu."}
            </p>
            <ol className="mt-3 space-y-3">
              {plan.days.map((d) => (
                <li key={d.day} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Hari {d.day} · {d.subtopic}
                    </p>
                    <p className="text-sm text-gray-600">{d.focus}</p>
                    <p className="text-xs text-gray-500">{d.target}</p>
                  </div>
                  {d.day < 7 && (
                    <button
                      onClick={() => onDrillSubtopic(d.subtopic)}
                      className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Mulai drill
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      <section className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Pembahasan per soal</h2>
        <ol className="mt-4 space-y-5">
          {answered.map((a, i) => {
            const tag = verifiedTagText(a.question);
            return (
            <li key={a.question.id} className="border-b border-gray-100 pb-4 last:border-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Soal {i + 1} · {a.question.subtopic}
                {a.question.source === "contoh" ? " · Soal contoh" : ""}
                {tag ? ` · ${tag}` : ""}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-900">
                {a.question.text}
              </p>
              <div className="mt-2 text-sm">
                <p>
                  Jawabanmu:{" "}
                  <span className={a.correct ? "font-semibold text-emerald-700" : "font-semibold text-red-700"}>
                    {a.selectedIndex === null
                      ? "Tidak dijawab"
                      : `${LETTERS[a.selectedIndex]}. ${a.question.options[a.selectedIndex]}`}
                  </span>
                </p>
                {!a.correct && (
                  <p>
                    Jawaban benar:{" "}
                    <span className="font-semibold text-emerald-700">
                      {LETTERS[a.question.answerIndex]}. {a.question.options[a.question.answerIndex]}
                    </span>
                  </p>
                )}
              </div>
              <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <strong>Pembahasan:</strong> {a.question.explanation}
              </p>
              <div className="mt-2">
                <ReportButton q={a.question} />
              </div>
            </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
