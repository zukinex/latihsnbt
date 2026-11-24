// Firebase initialization for LatihSNBT.
//
// Config comes ONLY from env vars (NEXT_PUBLIC_FIREBASE_*). Placeholder
// values (YOUR_*) count as "not configured": the app then runs in
// "Soal contoh" mode and shows a clear banner — it never pretends an AI
// call succeeded.
//
// App Check: the guided Firebase AI Logic setup enforces App Check. For
// local development the App Check *debug provider* is supported via the
// NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG env flag ("true" only).
//
// How it works in the installed SDK (firebase/app-check v13.4.0, verified
// in node_modules/@firebase/app-check): setting
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true before initializeAppCheck()
// enables debug mode, and in debug mode getToken() exchanges the debug
// token and NEVER calls the configured provider. There is no exported
// DebugProvider class in this SDK version, so local dev uses a
// CustomProvider placeholder that is never invoked in debug mode. The SDK
// prints the debug token to the browser console — register it in the
// Firebase console (Security > App Check > Apps > Manage debug tokens).
// NEVER commit a debug token, service account key, or .env file.
//
// Production: set NEXT_PUBLIC_FIREBASE_RECAPTCHA_ENTERPRISE_SITE_KEY to use
// the reCAPTCHA Enterprise provider. If neither is set, App Check is not
// initialized here: AI calls still work when the project does not enforce
// App Check, and fail with a clear error when it does (surfaced honestly
// in the UI via AiError).

import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  CustomProvider,
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
} from "firebase/app-check";

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

function isPlaceholder(v: string | undefined): boolean {
  if (!v) return true;
  return v.startsWith("YOUR_") || v.startsWith("PLACEHOLDER");
}

export interface FirebaseConfigStatus {
  configured: boolean;
  projectId: string | null;
}

/** True only when a real (non-placeholder) config is present. */
export function getFirebaseConfigStatus(): FirebaseConfigStatus {
  const apiKey = env("NEXT_PUBLIC_FIREBASE_API_KEY");
  const projectId = env("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const appId = env("NEXT_PUBLIC_FIREBASE_APP_ID");
  const configured =
    !isPlaceholder(apiKey) && !isPlaceholder(projectId) && !isPlaceholder(appId);
  return { configured, projectId: configured ? (projectId ?? null) : null };
}

let app: FirebaseApp | null = null;
let appCheckTried = false;

/** Initialize (once) and return the Firebase app, or null when not configured. */
export function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;
  if (typeof window === "undefined") return null;
  const status = getFirebaseConfigStatus();
  if (!status.configured) return null;
  const config = {
    apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: env("NEXT_PUBLIC_FIREBASE_APP_ID"),
    measurementId: env("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"),
  };
  try {
    app = initializeApp(config);
  } catch {
    return null;
  }
  // App Check — best-effort, never breaks the app if it fails.
  if (!appCheckTried) {
    appCheckTried = true;
    try {
      if (env("NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG") === "true") {
        (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        initializeAppCheck(app, {
          // Placeholder only: in debug mode the SDK never calls this
          // provider (it exchanges the debug token instead).
          provider: new CustomProvider({
            getToken: () =>
              Promise.reject(new Error("CustomProvider is unused in App Check debug mode.")),
          }),
        });
      } else {
        const siteKey = env("NEXT_PUBLIC_FIREBASE_RECAPTCHA_ENTERPRISE_SITE_KEY");
        if (siteKey && !isPlaceholder(siteKey)) {
          initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(siteKey) });
        }
      }
    } catch {
      // App Check is best-effort; AI calls can still proceed if the
      // project does not enforce it.
    }
  }
  return app;
}
