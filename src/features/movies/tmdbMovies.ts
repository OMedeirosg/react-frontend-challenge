import { api } from '@/lib/api'
import type { PaginatedMoviesResponse } from './types'

export type PopularMoviesParams = {
  page?: number
  /** ISO 639-1 + ISO 3166-1, ex.: pt-BR */
  language?: string
}

export async function getPopularMovies(
  params: PopularMoviesParams = {},
): Promise<PaginatedMoviesResponse> {
  const { page = 1, language = 'pt-BR' } = params
  const search = new URLSearchParams({
    page: String(page),
    language,
  })
  return api.get<PaginatedMoviesResponse>(
    `/movie/popular?${search.toString()}`,
  )
}
