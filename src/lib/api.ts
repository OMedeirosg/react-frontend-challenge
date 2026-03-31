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

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  const response = await fetch(`${tmdbBaseUrl()}${normalizedPath}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...tmdbAuthHeaders(),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new ApiError(response.status, errorBody)
  }

  // 204 No Content
  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
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
