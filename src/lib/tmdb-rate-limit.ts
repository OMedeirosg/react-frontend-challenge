/**
 * TMDB rate limiting — client-side only (no proxy). Tuned to avoid amplifying load:
 * bounded HTTP attempts per logical request, capped waits, jittered backoff when
 * Retry-After is absent.
 */

/** Max HTTP attempts for a single `api` call when responses are 429 (initial + retries). */
export const TMDB_RATE_LIMIT_MAX_HTTP_ATTEMPTS = 4

/** Upper bound on a single wait (ms) before retrying after 429. */
export const TMDB_RATE_LIMIT_MAX_DELAY_MS = 60_000

/** Base delay (ms) for exponential backoff when Retry-After is missing (attempt 1). */
export const TMDB_RATE_LIMIT_INITIAL_BACKOFF_MS = 500

/**
 * Parses `Retry-After` per RFC 7231: non-negative integer seconds, or HTTP-date.
 * Returns milliseconds to wait from `nowMs`, or `undefined` if invalid/empty.
 */
export function parseRetryAfterMs(
  header: string | null,
  nowMs: number = Date.now(),
): number | undefined {
  if (header == null) return undefined
  const trimmed = header.trim()
  if (trimmed === '') return undefined

  if (/^\d+$/.test(trimmed)) {
    const sec = Number.parseInt(trimmed, 10)
    if (!Number.isFinite(sec) || sec < 0) return undefined
    return sec * 1000
  }

  const parsed = Date.parse(trimmed)
  if (!Number.isFinite(parsed)) return undefined
  return Math.max(0, parsed - nowMs)
}

/**
 * Computes wait duration after a 429: prefers `Retry-After` when present,
 * otherwise exponential backoff with jitter in [0.5, 1.0) × base × 2^(attempt-1).
 *
 * @param httpAttemptAfter429 1 = first 429 in this request chain
 */
export function compute429WaitMs(
  httpAttemptAfter429: number,
  retryAfterMs: number | undefined,
  random01: () => number,
): number {
  if (
    retryAfterMs != null &&
    retryAfterMs > 0 &&
    Number.isFinite(retryAfterMs)
  ) {
    return Math.min(retryAfterMs, TMDB_RATE_LIMIT_MAX_DELAY_MS)
  }

  const exp = Math.max(0, httpAttemptAfter429 - 1)
  const base =
    TMDB_RATE_LIMIT_INITIAL_BACKOFF_MS * Math.pow(2, exp) * (0.5 + random01() * 0.5)
  return Math.min(Math.floor(base), TMDB_RATE_LIMIT_MAX_DELAY_MS)
}

export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      resolve()
    }, ms)
    if (!signal) return
    if (signal.aborted) {
      clearTimeout(id)
      reject(signal.reason)
      return
    }
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(id)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}
