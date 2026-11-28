// Crowd-validated question reports (LatihSNBT).
//
// Problem it solves: the old one-tap "Laporkan soal salah" button could be
// tapped for fun, so a single report meant nothing. Now a report is a FORM
// (what is wrong + which option is actually correct + an optional note),
// reports are collected in Firestore, and a question is only confirmed
// wrong when REPORT_AGREEMENT_THRESHOLD distinct devices report it with
// the SAME proposed correct option. Wording differences do not matter:
// for a multiple-choice question the reporters PICK an option (A-E), so
// agreement is on the option itself — no AI semantic comparison is needed
// to decide that ten people mean the same answer.
//
// When the threshold is reached the backend (this module, best-effort
// from the client) writes a correction to `question-corrections`. The
// question is NEVER deleted and the seed bank file is never modified:
// corrections are serve-time overlays — applyCorrections() overrides the
// answerIndex (and explanation, when the agreeing reports supplied one)
// on the question object handed to the quiz. The corrected question keeps
// serving, now with the right key.
//
// Firestore is best-effort: when it is unavailable (not enabled, no
// network, rules deny) reports still save locally (the old behaviour) and
// the quiz never breaks. Firestore enforcement note: reports and
// corrections live in Firestore, which is a separate service from Firebase
// AI Logic — App Check enforcement on the AI API does not block Firestore
// unless Firestore enforcement is also turned on. See firestore.rules
// for the rules to paste in the Firebase console.

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
  type Firestore,
} from "firebase/firestore";
import { getFirebaseApp } from "./firebase";
import { reportQuestion as saveLocalReport } from "./storage";
import type { Question } from "./types";

/** What the reporter says is wrong with the question. */
export type WrongKind = "key" | "unclear" | "explanation" | "other";

export interface ReportInput {
  questionId: string;
  subtest: string;
  subtopic: string;
  text: string;
  wrongKind: WrongKind;
  /** Proposed correct option index (0-4). Required when wrongKind is "key". */
  proposedAnswerIndex: number | null;
  /** Optional short correction note from the reporter. */
  note: string;
}

export interface StoredReport extends ReportInput {
  deviceId: string;
  reportedAt: string; // ISO string
}

export interface QuestionCorrection {
  questionId: string;
  correctAnswerIndex: number;
  /** Most-agreed correction note, or null when none was supplied. */
  explanation: string | null;
  /** How many distinct devices agreed on this option. */
  reportCount: number;
  agreedAt: string; // ISO string
}

/** Distinct devices that must agree on one option before a fix applies. */
export const REPORT_AGREEMENT_THRESHOLD = 10;
export const REPORTS_COLLECTION = "question-reports";
export const CORRECTIONS_COLLECTION = "question-corrections";
const DEVICE_KEY = "latihsnbt-device-v1";

/** Stable anonymous per-browser id (one "user" for report counting). */
export function getDeviceId(): string {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return "server";
  }
  try {
    const existing = window.localStorage.getItem(DEVICE_KEY);
    if (existing && existing.length > 0) return existing;
    const id = `d-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    window.localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return "unknown";
  }
}

/**
 * Pure: among the "key" reports for a question, find the proposed option
 * with the most DISTINCT devices behind it. Same device reporting twice
 * counts once (its latest report wins). Non-"key" reports never count
 * toward a fix — they are collected for review only.
 */
export function countAgreements(
  reports: StoredReport[],
  questionId: string,
): { option: number; count: number } | null {
  const byOption = new Map<number, Map<string, StoredReport>>();
  for (const r of reports) {
    if (r.questionId !== questionId) continue;
    if (r.wrongKind !== "key") continue;
    if (r.proposedAnswerIndex === null || r.proposedAnswerIndex === undefined) continue;
    let devices = byOption.get(r.proposedAnswerIndex);
    if (!devices) {
      devices = new Map();
      byOption.set(r.proposedAnswerIndex, devices);
    }
    // One device, one vote per option: a re-report overwrites its own.
    devices.set(r.deviceId, r);
  }
  let best: { option: number; count: number } | null = null;
  for (const [option, devices] of byOption) {
    if (!best || devices.size > best.count) best = { option, count: devices.size };
  }
  return best;
}

/**
 * Pure: build the correction when the agreement threshold is reached,
 * otherwise null. The explanation is the most common non-empty note among
 * the agreeing reports (wording may differ — the OPTION is what must
 * agree, the note is supporting context only).
 */
export function findConfirmedCorrection(
  reports: StoredReport[],
  questionId: string,
): QuestionCorrection | null {
  const top = countAgreements(reports, questionId);
  if (!top || top.count < REPORT_AGREEMENT_THRESHOLD) return null;
  const agreeing = reports.filter(
    (r) =>
      r.questionId === questionId &&
      r.wrongKind === "key" &&
      r.proposedAnswerIndex === top.option,
  );
  const noteCounts = new Map<string, { text: string; count: number }>();
  for (const r of agreeing) {
    const text = r.note.trim();
    if (!text) continue;
    const key = text.toLowerCase().replace(/\s+/g, " ");
    const entry = noteCounts.get(key);
    if (entry) entry.count += 1;
    else noteCounts.set(key, { text, count: 1 });
  }
  let explanation: string | null = null;
  let bestCount = 0;
  for (const entry of noteCounts.values()) {
    if (entry.count > bestCount) {
      bestCount = entry.count;
      explanation = entry.text;
    }
  }
  return {
    questionId,
    correctAnswerIndex: top.option,
    explanation,
    reportCount: top.count,
    agreedAt: new Date().toISOString(),
  };
}

/** Serve-time overlay: a corrected question serves with the fixed key. */
export function applyCorrection(
  q: Question,
  corrections: ReadonlyMap<string, QuestionCorrection>,
): Question {
  const c = corrections.get(q.id);
  if (!c) return q;
  return {
    ...q,
    answerIndex: c.correctAnswerIndex,
    explanation: c.explanation ?? q.explanation,
    corrected: true,
  };
}

export function applyCorrections(
  questions: Question[],
  corrections: ReadonlyMap<string, QuestionCorrection>,
): Question[] {
  if (corrections.size === 0) return questions;
  return questions.map((q) => applyCorrection(q, corrections));
}

// --- Firestore (best-effort; never throws, never breaks the quiz) ---

let db: Firestore | null | undefined;
function getDb(): Firestore | null {
  if (db !== undefined) return db;
  const app = getFirebaseApp();
  if (!app) {
    db = null;
    return db;
  }
  try {
    db = getFirestore(app);
  } catch {
    db = null;
  }
  return db;
}

let cachedCorrections: Map<string, QuestionCorrection> = new Map();
let correctionsLoaded = false;

/** Corrections loaded so far (empty until ensureCorrectionsLoaded runs). */
export function getCachedCorrections(): ReadonlyMap<string, QuestionCorrection> {
  return cachedCorrections;
}

/** Load the confirmed corrections once per page load; safe to call often. */
export async function ensureCorrectionsLoaded(): Promise<void> {
  if (correctionsLoaded) return;
  correctionsLoaded = true;
  const firestore = getDb();
  if (!firestore) return;
  try {
    const snap = await getDocs(collection(firestore, CORRECTIONS_COLLECTION));
    const next = new Map<string, QuestionCorrection>();
    snap.forEach((d) => {
      const data = d.data() as Partial<QuestionCorrection>;
      if (
        typeof data.questionId === "string" &&
        typeof data.correctAnswerIndex === "number" &&
        typeof data.reportCount === "number"
      ) {
        next.set(d.id, {
          questionId: data.questionId,
          correctAnswerIndex: data.correctAnswerIndex,
          explanation: typeof data.explanation === "string" ? data.explanation : null,
          reportCount: data.reportCount,
          agreedAt: typeof data.agreedAt === "string" ? data.agreedAt : "",
        });
      }
    });
    cachedCorrections = next;
  } catch {
    // Firestore unavailable — serve uncorrected; the next load retries.
    correctionsLoaded = false;
  }
}

/**
 * Submit one report. Always saves locally (so the per-device "already
 * reported" state keeps working offline); writes to Firestore when
 * available, then checks whether the threshold is reached and, if so,
 * writes the correction. Returns whether the report landed and whether
 * this report confirmed a fix.
 */
export async function submitReport(input: ReportInput): Promise<{
  submitted: boolean;
  confirmed: boolean;
}> {
  const deviceId = getDeviceId();
  const stored: StoredReport = {
    ...input,
    deviceId,
    reportedAt: new Date().toISOString(),
  };
  // Local save first: the reporter sees "tersimpan" even when Firestore
  // is down, and isReported() keeps working.
  saveLocalReport({
    questionId: input.questionId,
    subtest: input.subtest,
    subtopic: input.subtopic,
    text: input.text,
    reportedAt: stored.reportedAt,
  });
  const firestore = getDb();
  if (!firestore) return { submitted: true, confirmed: false };
  try {
    await setDoc(
      doc(firestore, REPORTS_COLLECTION, `${input.questionId}_${deviceId}`),
      stored,
      { merge: true },
    );
    const snap = await getDocs(
      query(
        collection(firestore, REPORTS_COLLECTION),
        where("questionId", "==", input.questionId),
      ),
    );
    const reports: StoredReport[] = [];
    snap.forEach((d) => {
      reports.push(d.data() as StoredReport);
    });
    const correction = findConfirmedCorrection(reports, input.questionId);
    if (!correction) return { submitted: true, confirmed: false };
    const existing = cachedCorrections.get(input.questionId);
    if (existing && existing.correctAnswerIndex === correction.correctAnswerIndex) {
      return { submitted: true, confirmed: true };
    }
    await setDoc(
      doc(firestore, CORRECTIONS_COLLECTION, input.questionId),
      correction,
      { merge: true },
    );
    cachedCorrections = new Map(cachedCorrections).set(input.questionId, correction);
    return { submitted: true, confirmed: true };
  } catch {
    return { submitted: true, confirmed: false };
  }
}
