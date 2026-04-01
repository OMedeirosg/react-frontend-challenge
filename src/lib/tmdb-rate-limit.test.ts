import { describe, expect, it, vi } from 'vitest'

import {
  compute429WaitMs,
  parseRetryAfterMs,
  TMDB_RATE_LIMIT_INITIAL_BACKOFF_MS,
  TMDB_RATE_LIMIT_MAX_DELAY_MS,
} from './tmdb-rate-limit'

describe('parseRetryAfterMs', () => {
  it('parses delay-seconds as milliseconds', () => {
    expect(parseRetryAfterMs('120')).toBe(120_000)
    expect(parseRetryAfterMs('0')).toBe(0)
  })

  it('parses HTTP-date as ms until that instant', () => {
    const now = Date.parse('Wed, 01 Apr 2026 12:00:00 GMT')
    const future = 'Wed, 01 Apr 2026 12:02:00 GMT'
    expect(parseRetryAfterMs(future, now)).toBe(120_000)
  })

  it('returns 0 for past HTTP-date', () => {
    const now = Date.parse('Wed, 01 Apr 2026 12:00:00 GMT')
    const past = 'Wed, 01 Apr 2026 11:00:00 GMT'
    expect(parseRetryAfterMs(past, now)).toBe(0)
  })

  it('returns undefined for empty or invalid', () => {
    expect(parseRetryAfterMs(null)).toBeUndefined()
    expect(parseRetryAfterMs('')).toBeUndefined()
    expect(parseRetryAfterMs('not-a-date')).toBeUndefined()
  })
})

describe('compute429WaitMs', () => {
  it('uses capped Retry-After when positive', () => {
    const fixed = () => 0
    expect(compute429WaitMs(1, 30_000, fixed)).toBe(30_000)
    expect(compute429WaitMs(1, TMDB_RATE_LIMIT_MAX_DELAY_MS + 1, fixed)).toBe(
      TMDB_RATE_LIMIT_MAX_DELAY_MS,
    )
  })

  it('uses exponential backoff with jitter when Retry-After missing or zero', () => {
    const r = () => 0
    const w1 = compute429WaitMs(1, undefined, r)
    const w2 = compute429WaitMs(2, undefined, r)
    expect(w1).toBe(Math.floor(TMDB_RATE_LIMIT_INITIAL_BACKOFF_MS * 0.5))
    expect(w2).toBe(
      Math.floor(TMDB_RATE_LIMIT_INITIAL_BACKOFF_MS * 2 * 0.5),
    )
  })

  it('jitter stays within factor range', () => {
    const random = vi.fn().mockReturnValue(0.99)
    const w = compute429WaitMs(1, undefined, random)
    const max =
      TMDB_RATE_LIMIT_INITIAL_BACKOFF_MS * (0.5 + 0.99 * 0.5)
    expect(w).toBe(Math.floor(max))
  })
})
