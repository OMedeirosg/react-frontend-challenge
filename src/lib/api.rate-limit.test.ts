import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RateLimitError, api } from './api'
import { TMDB_RATE_LIMIT_MAX_HTTP_ATTEMPTS } from './tmdb-rate-limit'

describe('api TMDB rate limit handling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('retries once after 429 when Retry-After allows, then returns JSON', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          status: 429,
          headers: { 'Retry-After': '60' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ hello: 'world' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    vi.stubGlobal('fetch', fetchMock)

    const p = api.get<{ hello: string }>('/movie/1')
    await vi.advanceTimersByTimeAsync(60_000)
    const data = await p

    expect(data).toEqual({ hello: 'world' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('throws RateLimitError after exhausting in-request 429 retries', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status_message: 'limit' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '1',
        },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const p = api.get('/movie/1')
    const assertRejected = expect(p).rejects.toThrow(RateLimitError)
    await vi.runAllTimersAsync()
    await assertRejected

    expect(fetchMock).toHaveBeenCalledTimes(TMDB_RATE_LIMIT_MAX_HTTP_ATTEMPTS)
  })
})
