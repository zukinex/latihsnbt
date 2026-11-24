// localStorage persistence for LatihSNBT.
// Guests only (no login): progress and "laporkan soal salah" reports live
// in the browser. All helpers are safe to call during SSR (no-ops when
// `window` is undefined) and never throw on corrupt data.

import { SessionRecord } from "./types";

const PROGRESS_KEY = "latihsnbt-progress-v1";
const REPORTS_KEY = "latihsnbt-reports-v1";

export interface QuestionReport {
  questionId: string;
  subtest: string;
  subtopic: string;
  text: string;
  reportedAt: string; // ISO string
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — progress is best-effort.
  }
}

/** All finished sessions, newest first (capped at 50). */
export function loadProgress(): SessionRecord[] {
  const list = readJson<SessionRecord[]>(PROGRESS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function saveSession(record: SessionRecord): SessionRecord[] {
  const list = [record, ...loadProgress()].slice(0, 50);
  writeJson(PROGRESS_KEY, list);
  return list;
}

/** Best score (0-100) for a subtest, or null if never attempted. */
export function bestScoreFor(subtest: string): number | null {
  const list = loadProgress().filter((r) => r.subtest === subtest);
  if (list.length === 0) return null;
  return Math.max(...list.map((r) => r.score));
}

export function loadReports(): QuestionReport[] {
  const list = readJson<QuestionReport[]>(REPORTS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function reportQuestion(report: QuestionReport): QuestionReport[] {
  const list = loadReports();
  if (list.some((r) => r.questionId === report.questionId)) return list;
  const next = [report, ...list].slice(0, 100);
  writeJson(REPORTS_KEY, next);
  return next;
}

export function isReported(questionId: string): boolean {
  return loadReports().some((r) => r.questionId === questionId);
}
