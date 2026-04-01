import {
  compute429WaitMs,
  delay,
  parseRetryAfterMs,
  TMDB_RATE_LIMIT_MAX_HTTP_ATTEMPTS,
} from './tmdb-rate-limit'

const TMDB_API_BASE_DEFAULT = 'https://api.themoviedb.org/3'

function tmdbBaseUrl(): string {
  const raw = import.meta.env.VITE_TMDB_BASE_URL ?? TMDB_API_BASE_DEFAULT
  return raw.replace(/\/$/, '')
}

function tmdbAuthHeaders(): Record<string, string> {
  const token = import.meta.env.VITE_TMDB_CREDENTIAL_HEADER
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/** Exhausted in-request 429 retries; optional hint from last Retry-After (TanStack may ignore). */
export class RateLimitError extends ApiError {
  readonly retryAfterMs?: number

  constructor(body: unknown, retryAfterMs?: number, message?: string) {
    super(429, body, message ?? 'Too Many Requests')
    this.name = 'RateLimitError'
    this.retryAfterMs = retryAfterMs
  }
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, signal, ...rest } = options
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${tmdbBaseUrl()}${normalizedPath}`

  let httpAttempt = 0

  while (true) {
    httpAttempt += 1

    const response = await fetch(url, {
      ...rest,
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...tmdbAuthHeaders(),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    if (response.status === 429) {
      const retryAfterMs = parseRetryAfterMs(response.headers.get('Retry-After'))
      if (httpAttempt < TMDB_RATE_LIMIT_MAX_HTTP_ATTEMPTS) {
        const waitMs = compute429WaitMs(
          httpAttempt,
          retryAfterMs,
          () => Math.random(),
        )
        await delay(waitMs, signal ?? undefined)
        continue
      }

      const errorBody = await response.json().catch(() => null)
      throw new RateLimitError(errorBody, retryAfterMs)
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw new ApiError(response.status, errorBody)
    }

    if (response.status === 204) return undefined as T

    return response.json() as Promise<T>
  }
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
