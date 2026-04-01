import { z } from 'zod'

export class TmdbContractError extends Error {
  readonly endpoint: string
  readonly phase: 'request' | 'response'
  readonly zodError: z.ZodError

  constructor(
    endpoint: string,
    phase: 'request' | 'response',
    zodError: z.ZodError,
  ) {
    super(
      `TMDB contract ${phase} validation failed (${endpoint}): ${zodError.message}`,
    )
    this.name = 'TmdbContractError'
    this.endpoint = endpoint
    this.phase = phase
    this.zodError = zodError
  }
}

export function parseTmdbRequest<S extends z.ZodType<unknown>>(
  schema: S,
  raw: unknown,
  endpoint: string,
): z.infer<S> {
  const r = schema.safeParse(raw)
  if (!r.success) {
    throw new TmdbContractError(endpoint, 'request', r.error)
  }
  return r.data
}

export function parseTmdbResponse<S extends z.ZodType<unknown>>(
  schema: S,
  raw: unknown,
  endpoint: string,
): z.infer<S> {
  const r = schema.safeParse(raw)
  if (!r.success) {
    throw new TmdbContractError(endpoint, 'response', r.error)
  }
  return r.data
}
