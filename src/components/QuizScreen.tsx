// Quiz screen: one question at a time, pick an answer, next.
// Tryout mode has a countdown timer; at 0 the session auto-submits.
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatDuration,
  inferenceSourceLabel,
  remainingSeconds,
  sessionInferenceSource,
  sessionSourceInfo,
  verifiedTagText,
} from "../lib/logic";
import { isReported, reportQuestion } from "../lib/storage";
import {
  InferenceSource,
  Question,
  SUBTESTS,
  SubtestId,
  type SessionMode,
} from "../lib/types";

const LETTERS = ["A", "B", "C", "D", "E"];

interface QuizScreenProps {
  subtest: SubtestId;
  mode: SessionMode;
  questions: Question[];
  inferenceSource: InferenceSource;
  /** Epoch ms when the Tryout timer ends; null for Drill (no timer). */
  deadlineMs: number | null;
  onFinish: (answers: (number | null)[]) => void;
  onCancel: () => void;
}

export default function QuizScreen({
  subtest,
  mode,
  questions,
  inferenceSource,
  deadlineMs,
  onFinish,
  onCancel,
}: QuizScreenProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [reported, setReported] = useState<string[]>(() =>
    questions.filter((q) => isReported(q.id)).map((q) => q.id),
  );

  const total = questions.length;
  const current = questions[index];
  // Source label + provenance from the questions actually served (a seed
  // question never shows as "Dibuat AI"). The inference source is shown
  // only when the session actually contains AI-generated questions — a
  // seed-only session never shows "cloud"/"on-device", even if an AI call
  // ran earlier in the flow.
  const sourceInfo = sessionSourceInfo(questions);
  const shownInference = sessionInferenceSource(questions, inferenceSource);
  const currentTag = verifiedTagText(current);
  const timeLeft = deadlineMs === null ? null : remainingSeconds(deadlineMs, nowMs);

  // Countdown ticker (Tryout only).
  useEffect(() => {
    if (deadlineMs === null) return;
    const t = setInterval(() => setNowMs(Date.now()), 500);
    return () => clearInterval(t);
  }, [deadlineMs]);

  // Auto-submit when the timer hits zero.
  useEffect(() => {
    if (timeLeft === 0) onFinish(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);

  function pick(i: number) {
    setAnswers((prev) => prev.map((a, j) => (j === index ? i : a)));
  }

  function handleReport() {
    reportQuestion({
      questionId: current.id,
      subtest: current.subtest,
      subtopic: current.subtopic,
      text: current.text,
      reportedAt: new Date().toISOString(),
    });
    setReported((prev) => [...prev, current.id]);
  }

  function finish() {
    onFinish(answers);
  }

  const isLast = index === total - 1;
  const isReportedNow = reported.includes(current.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-2 text-sm">
        <button onClick={onCancel} className="text-gray-500 underline hover:text-gray-700">
          &larr; Beranda
        </button>
        <span className="font-semibold text-gray-700">
          {SUBTESTS[subtest].name} · {mode === "drill" ? "Drill Cepat" : "Tryout"}
        </span>
        {timeLeft !== null ? (
          <span
            className={`rounded-full px-3 py-1 font-mono font-bold ${
              timeLeft <= 60 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-800"
            }`}
          >
            {formatDuration(timeLeft)}
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">Tanpa timer</span>
        )}
      </div>

      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          Soal {index + 1} dari {total} · {answeredCount} terjawab
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-semibold ${
            sourceInfo.label === "Soal contoh"
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {sourceInfo.label}
          {shownInference ? ` · ${inferenceSourceLabel(shownInference)}` : ""}
          {` · ${sourceInfo.provenance}`}
        </span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-emerald-600 transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {current.subtopic}
          {currentTag && (
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 normal-case text-emerald-800">
              {currentTag}
            </span>
          )}
        </p>
        <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-900">
          {current.text}
        </p>

        <div className="mt-5 space-y-2">
          {current.options.map((opt, i) => {
            const selected = answers[index] === i;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm ${
                  selected
                    ? "border-emerald-600 bg-emerald-50 font-semibold text-emerald-900"
                    : "border-gray-200 bg-white text-gray-800 hover:border-emerald-400"
                }`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                  {LETTERS[i]}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleReport}
            disabled={isReportedNow}
            className="text-xs text-gray-500 underline hover:text-gray-700 disabled:no-underline disabled:text-emerald-700"
          >
            {isReportedNow ? "✓ Laporanmu tersimpan, terima kasih" : "Laporkan soal salah"}
          </button>
          <span className="text-xs text-gray-400">Kunci jawaban tidak ditampilkan di sini.</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <button
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          disabled={index === 0}
          className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
        >
          &larr; Sebelumnya
        </button>
        {isLast ? (
          <button
            onClick={finish}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Selesai &amp; lihat hasil
          </button>
        ) : (
          <button
            onClick={() => setIndex((v) => Math.min(total - 1, v + 1))}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Berikutnya &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
