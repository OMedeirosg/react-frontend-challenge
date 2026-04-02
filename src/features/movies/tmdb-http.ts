import type { z } from 'zod'

import { api } from '@/lib/api'

import { parseTmdbResponse } from './contracts/tmdb.contracts'

/** Rótulos para mensagens de `TmdbContractError` (não são URLs completas). */
export const TMDB_ENDPOINT = {
  popular: 'GET /movie/popular',
  trending: 'GET /trending/movie/:timeWindow',
  search: 'GET /search/movie',
  discover: 'GET /discover/movie',
  genres: 'GET /genre/movie/list',
  detail: 'GET /movie/:id',
  credits: 'GET /movie/:id/credits',
  videos: 'GET /movie/:id/videos',
  similar: 'GET /movie/:id/similar',
} as const

export async function tmdbGetParsed<S extends z.ZodType<unknown>>(
  path: string,
  schema: S,
  endpoint: string,
  init?: Parameters<typeof api.get>[1],
): Promise<z.infer<S>> {
  const raw = await api.get<unknown>(path, init)
  return parseTmdbResponse(schema, raw, endpoint)
}
