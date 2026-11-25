// Tests for the bounded retry + timeout helper (callAiWithRetry) in ai.ts.
// The helper is pure (the AI attempt is injected), so no Firebase config or
// network is needed: fake attempts simulate 500/503, 403, hangs, and success.
import { describe, expect, it, vi } from "vitest";
import {
  AiTimeoutError,
  AI_CALL_BACKOFFS_MS,
  AI_OVERLOADED_MESSAGE,
  AI_TIMEOUT_MESSAGE,
  aiFailureMessage,
  callAiWithRetry,
  isRetryableAiError,
} from "./ai";

const err500 = () =>
  new Error(
    "[500 Internal Server Error] This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.",
  );
const err503 = () =>
  new Error("[503 Service Unavailable] The service is currently unavailable.");
const err403 = () => new Error("[403 Forbidden] Permission denied.");
const err400 = () => new Error("[400 Bad Request] Invalid argument.");

describe("isRetryableAiError", () => {
  it("500 and 503 are retryable, 403/400 are not", () => {
    expect(isRetryableAiError(err500())).toBe(true);
    expect(isRetryableAiError(err503())).toBe(true);
    expect(isRetryableAiError(err403())).toBe(false);
    expect(isRetryableAiError(err400())).toBe(false);
    expect(isRetryableAiError(new Error("boom"))).toBe(false);
  });
});

describe("callAiWithRetry", () => {
  it("retries HTTP 500 with backoff 2s then 4s, then succeeds", async () => {
    const delays: number[] = [];
    const sleep = vi.fn(async (ms: number) => {
      delays.push(ms);
    });
    let calls = 0;
    const value = await callAiWithRetry(
      async () => {
        calls += 1;
        if (calls < 3) throw err500();
        return "ok";
      },
      { sleep },
    );
    expect(value).toBe("ok");
    expect(calls).toBe(3);
    expect(delays).toEqual([2000, 4000]);
    expect(delays).toEqual(AI_CALL_BACKOFFS_MS);
  });

  it("gives up after exactly 3 attempts on persistent 500", async () => {
    const sleep = vi.fn(async () => {});
    let calls = 0;
    await expect(
      callAiWithRetry(
        async () => {
          calls += 1;
          throw err500();
        },
        { sleep },
      ),
    ).rejects.toThrow(/500/);
    expect(calls).toBe(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it("never retries HTTP 403", async () => {
    const sleep = vi.fn(async () => {});
    let calls = 0;
    await expect(
      callAiWithRetry(
        async () => {
          calls += 1;
          throw err403();
        },
        { sleep },
      ),
    ).rejects.toThrow(/403/);
    expect(calls).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("never retries HTTP 400", async () => {
    const sleep = vi.fn(async () => {});
    let calls = 0;
    await expect(
      callAiWithRetry(
        async () => {
          calls += 1;
          throw err400();
        },
        { sleep },
      ),
    ).rejects.toThrow(/400/);
    expect(calls).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("timeout aborts the in-flight request and fails without retry", async () => {
    const sleep = vi.fn(async () => {});
    let calls = 0;
    let aborted = false;
    const start = Date.now();
    await expect(
      callAiWithRetry(
        (signal) => {
          calls += 1;
          signal.addEventListener("abort", () => {
            aborted = true;
          });
          return new Promise<never>(() => {}); // hangs forever
        },
        { timeoutMs: 50, sleep },
      ),
    ).rejects.toBeInstanceOf(AiTimeoutError);
    expect(calls).toBe(1);
    expect(aborted).toBe(true);
    expect(sleep).not.toHaveBeenCalled();
    expect(Date.now() - start).toBeLessThan(1000);
  });

  it("retries HTTP 503 with backoff 2s then 4s, then succeeds", async () => {
    const delays: number[] = [];
    const sleep = vi.fn(async (ms: number) => {
      delays.push(ms);
    });
    let calls = 0;
    const value = await callAiWithRetry(
      async () => {
        calls += 1;
        if (calls < 3) throw err503();
        return "ok-503";
      },
      { sleep },
    );
    expect(value).toBe("ok-503");
    expect(calls).toBe(3);
    expect(delays).toEqual([2000, 4000]);
  });

  it("never retries a 403 even when its message mentions high demand", async () => {
    const sleep = vi.fn(async () => {});
    let calls = 0;
    const err = new Error(
      "[403 Forbidden] Quota exceeded: high demand, try again later.",
    );
    await expect(
      callAiWithRetry(
        async () => {
          calls += 1;
          throw err;
        },
        { sleep },
      ),
    ).rejects.toThrow(/403/);
    expect(calls).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("a slow-but-finishing attempt still resolves", async () => {
    const sleep = vi.fn(async () => {});
    const value = await callAiWithRetry(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        return "slow-ok";
      },
      { timeoutMs: 1000, sleep },
    );
    expect(value).toBe("slow-ok");
    expect(sleep).not.toHaveBeenCalled();
  });
});

describe("aiFailureMessage", () => {
  it("500/503 after retries use the overload message", () => {
    expect(aiFailureMessage(err500())).toBe(AI_OVERLOADED_MESSAGE);
    expect(aiFailureMessage(err503())).toBe(AI_OVERLOADED_MESSAGE);
  });

  it("timeout uses its own message and never claims Google is full", () => {
    const message = aiFailureMessage(new AiTimeoutError());
    expect(message).toBe(AI_TIMEOUT_MESSAGE);
    expect(message).not.toContain("penuh");
    expect(message).toContain("tidak merespons tepat waktu");
  });

  it("other errors keep the technical message", () => {
    expect(aiFailureMessage(err403())).toContain("Gagal memanggil Firebase AI Logic");
    expect(aiFailureMessage(err403())).toContain("403");
  });
});
