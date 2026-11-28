// Report form: what is wrong with this question, and which answer is
// actually correct. One report per device per question (the Firestore doc
// id is questionId + deviceId, so a re-report overwrites instead of
// double-counting). A "key is wrong" report only counts toward the
// auto-fix when the reporter picks the option they believe is correct —
// ten devices picking the SAME option is what confirms a fix.
"use client";

import { useState } from "react";
import { t, type Language } from "../lib/i18n";
import { submitReport, type WrongKind } from "../lib/reports";
import type { Question } from "../lib/types";

const LETTERS = ["A", "B", "C", "D", "E"];

const WRONG_KINDS: WrongKind[] = ["key", "unclear", "explanation", "other"];

interface ReportFormProps {
  lang: Language;
  question: Question;
  onSubmitted: () => void;
  onCancel: () => void;
}

export default function ReportForm({ lang, question, onSubmitted, onCancel }: ReportFormProps) {
  const [wrongKind, setWrongKind] = useState<WrongKind>("key");
  const [proposed, setProposed] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (wrongKind === "key" && proposed === null) {
      setError(t(lang, "report.needAnswer"));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await submitReport({
        questionId: question.id,
        subtest: question.subtest,
        subtopic: question.subtopic,
        text: question.text,
        wrongKind,
        proposedAnswerIndex: wrongKind === "key" ? proposed : null,
        note: note.trim(),
      });
    } finally {
      setSaving(false);
    }
    onSubmitted();
  }

  return (
    <div className="mt-4 rounded-lg border bg-gray-50 p-4">
      <p className="text-sm font-bold text-gray-900">{t(lang, "report.title")}</p>

      <p className="mt-3 text-xs font-semibold text-gray-700">{t(lang, "report.whatWrong")}</p>
      <div className="mt-1 space-y-1">
        {WRONG_KINDS.map((k) => (
          <label key={k} className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="wrongKind"
              checked={wrongKind === k}
              onChange={() => setWrongKind(k)}
              className="accent-emerald-600"
            />
            {t(lang, `report.${k === "key" ? "keyWrong" : k === "unclear" ? "questionUnclear" : k === "explanation" ? "explanationWrong" : "other"}`)}
          </label>
        ))}
      </div>

      {wrongKind === "key" && (
        <>
          <p className="mt-3 text-xs font-semibold text-gray-700">{t(lang, "report.correctAnswer")}</p>
          <div className="mt-1 flex gap-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setProposed(i)}
                title={opt}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold ${
                  proposed === i
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-gray-300 bg-white text-gray-800 hover:border-emerald-400"
                }`}
              >
                {LETTERS[i]}
              </button>
            ))}
          </div>
        </>
      )}

      <p className="mt-3 text-xs font-semibold text-gray-700">{t(lang, "report.note")}</p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t(lang, "report.notePh")}
        rows={2}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
      />

      {error && <p className="mt-2 text-xs font-semibold text-red-700">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? t(lang, "report.saving") : t(lang, "report.submit")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          {t(lang, "report.cancel")}
        </button>
      </div>
    </div>
  );
}
