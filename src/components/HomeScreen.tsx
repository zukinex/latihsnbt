// Home screen: pick a subtest + mode, see best scores and recent sessions.
"use client";

import { SUBTESTS, type SessionMode, type SessionRecord, type SubtestId } from "../lib/types";

interface HomeScreenProps {
  configured: boolean;
  bestScores: Record<SubtestId, number | null>;
  recent: SessionRecord[];
  onStart: (subtest: SubtestId, mode: SessionMode) => void;
}

const MODE_LABEL: Record<SessionMode, { title: string; desc: string }> = {
  drill: { title: "Drill Cepat", desc: "5 soal, tanpa timer. Latihan singkat." },
  tryout: { title: "Tryout", desc: "15 soal, berwaktu seperti ujian asli." },
};

export default function HomeScreen({ configured, bestScores, recent, onStart }: HomeScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900">LatihSNBT</h1>
        <p className="mt-2 text-sm text-gray-600">
          Tryout SNBT adaptif untuk pelajar Indonesia. Soal dibuat AI, jawabanmu dinilai,
          kelemahanmu dipetakan, dan rencana latihan 7 hari disusun khusus buatmu.
        </p>
      </header>

      {!configured && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Firebase belum dikonfigurasi.</strong> App memakai soal contoh (ditulis
          tangan, diberi label &ldquo;Soal contoh&rdquo;) supaya alurnya tetap bisa dicoba.
          Untuk soal yang dibuat AI, hubungkan project Firebase — lihat README.
        </div>
      )}
      {configured && (
        <div className="mb-6 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <strong>AI aktif:</strong> soal dibuat live oleh Gemini lewat Firebase AI Logic
          (hybrid: on-device bila tersedia, cloud bila tidak).
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(SUBTESTS) as SubtestId[]).map((id) => {
          const info = SUBTESTS[id];
          const best = bestScores[id];
          return (
            <section key={id} className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{info.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{info.description}</p>
              <p className="mt-2 text-xs text-gray-500">
                Subtopik: {info.subtopics.join(" · ")}
              </p>
              {best !== null && best !== undefined && (
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  Skor terbaikmu: {best}
                </p>
              )}
              <div className="mt-4 space-y-2">
                {(Object.keys(MODE_LABEL) as SessionMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onStart(id, mode)}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-left text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    {MODE_LABEL[mode].title}
                    <span className="block text-xs font-normal text-emerald-100">
                      {MODE_LABEL[mode].desc}
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
          <h2 className="text-base font-bold text-gray-900">Riwayat latihanmu</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recent.slice(0, 5).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2 text-gray-700">
                <span>
                  {SUBTESTS[r.subtest].short} · {r.mode === "drill" ? "Drill" : "Tryout"} ·{" "}
                  {new Date(r.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="font-semibold">
                  {r.correct}/{r.total} · skor {r.score}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-8 text-center text-xs text-gray-500">
        Gratis, tanpa login. Soal dibuat AI secara live — bukan salinan soal SNBT asli
        (soal asli milik SNPMB dan tidak dipublikasi bebas). Ada soal yang salah? Laporkan
        dari layar soal atau hasil.
      </footer>
    </div>
  );
}
