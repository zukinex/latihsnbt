// Home screen: pick a subtest + mode, see best scores and recent sessions.
"use client";

import { subtestDescription, subtopicLabel, t, type Language } from "../lib/i18n";
import {
  SUBTESTS,
  TRYOUT_QUESTION_COUNT,
  type SessionMode,
  type SessionRecord,
  type SubtestId,
  type SubtestInfo,
} from "../lib/types";

interface HomeScreenProps {
  lang: Language;
  configured: boolean;
  bestScores: Record<SubtestId, number | null>;
  recent: SessionRecord[];
  onStart: (subtest: SubtestId, mode: SessionMode) => void;
}

/** Tryout serves 15 AI-generated questions, or at most the subtest's sample
 *  bank size in sample mode (14 for the five newer subtests). */
function modeDesc(lang: Language, mode: SessionMode, info: SubtestInfo, configured: boolean): string {
  if (mode === "drill") return t(lang, "home.drillDesc");
  const n = configured ? TRYOUT_QUESTION_COUNT : info.bankSize;
  return t(lang, "home.tryoutDesc", n);
}

export default function HomeScreen({ lang, configured, bestScores, recent, onStart }: HomeScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900">LatihSNBT</h1>
        <p className="mt-2 text-sm text-gray-600">{t(lang, "home.tagline")}</p>
        <p className="mt-1 text-sm font-medium text-emerald-800">{t(lang, "home.audience")}</p>
      </header>

      {!configured && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>{t(lang, "home.notConfiguredTitle")}</strong> {t(lang, "home.notConfiguredBody")}
        </div>
      )}
      {configured && (
        <div className="mb-6 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <strong>{t(lang, "home.aiActiveTitle")}</strong> {t(lang, "home.aiActiveBody")}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(SUBTESTS) as SubtestId[]).map((id) => {
          const info = SUBTESTS[id];
          const best = bestScores[id];
          return (
            <section key={id} className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{info.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{subtestDescription(lang, id)}</p>
              <p className="mt-2 text-xs text-gray-500">
                {t(lang, "home.subtopicsLabel", info.subtopics.map((s) => subtopicLabel(s, lang)).join(" · "))}
              </p>
              {best !== null && best !== undefined && (
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  {t(lang, "home.bestScore", best)}
                </p>
              )}
              <div className="mt-4 space-y-2">
                {(["drill", "tryout"] as SessionMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onStart(id, mode)}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-left text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    {mode === "drill" ? t(lang, "home.modeDrill") : t(lang, "home.modeTryout")}
                    <span className="block text-xs font-normal text-emerald-100">
                      {modeDesc(lang, mode, info, configured)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {recent.length > 0 && (
        <section className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900">{t(lang, "home.history")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recent.slice(0, 5).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2 text-gray-700">
                <span>
                  {SUBTESTS[r.subtest].short} ·{" "}
                  {r.mode === "drill" ? t(lang, "home.historyModeDrill") : t(lang, "home.historyModeTryout")} ·{" "}
                  {new Date(r.date).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="font-semibold">
                  {t(lang, "home.historyResult", r.correct, r.total, r.score)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-8 text-center text-xs text-gray-500">{t(lang, "home.footer")}</footer>
    </div>
  );
}
