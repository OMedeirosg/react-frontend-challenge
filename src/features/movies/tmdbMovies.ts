import { api } from '@/lib/api'
import type {
  MovieGenresResponse,
  PaginatedMoviesResponse,
} from './types'

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

export type TrendingMoviesParams = {
  page?: number
  /** day | week */
  timeWindow?: 'day' | 'week'
  language?: string
}

export async function getTrendingMovies(
  params: TrendingMoviesParams = {},
): Promise<PaginatedMoviesResponse> {
  const { page = 1, timeWindow = 'day', language = 'pt-BR' } = params
  const search = new URLSearchParams({
    page: String(page),
    language,
  })
  return api.get<PaginatedMoviesResponse>(
    `/trending/movie/${timeWindow}?${search.toString()}`,
  )
}

export type SearchMoviesParams = {
  query: string
  page?: number
  language?: string
  includeAdult?: boolean
}

export async function searchMovies(
  params: SearchMoviesParams,
): Promise<PaginatedMoviesResponse> {
  const {
    query,
    page = 1,
    language = 'pt-BR',
    includeAdult = false,
  } = params

  const search = new URLSearchParams({
    query,
    page: String(page),
    language,
    include_adult: String(includeAdult),
  })

  return api.get<PaginatedMoviesResponse>(
    `/search/movie?${search.toString()}`,
  )
}

export type DiscoverMoviesParams = {
  page?: number
  language?: string
  genreId?: number | null
  year?: number | null
  minVote?: number | null
  sortBy?: string
}

export async function discoverMovies(
  params: DiscoverMoviesParams = {},
): Promise<PaginatedMoviesResponse> {
  const {
    page = 1,
    language = 'pt-BR',
    genreId = null,
    year = null,
    minVote = null,
    sortBy = 'popularity.desc',
  } = params

  const search = new URLSearchParams({
    page: String(page),
    language,
    sort_by: sortBy,
    include_adult: 'false',
    include_video: 'false',
  })

  if (genreId != null) search.set('with_genres', String(genreId))
  if (year != null) search.set('primary_release_year', String(year))
  if (minVote != null) search.set('vote_average.gte', String(minVote))

  return api.get<PaginatedMoviesResponse>(
    `/discover/movie?${search.toString()}`,
  )
}

export type MovieGenresParams = {
  language?: string
}

export async function getMovieGenres(
  params: MovieGenresParams = {},
): Promise<MovieGenresResponse> {
  const { language = 'pt-BR' } = params
  const search = new URLSearchParams({ language })
  return api.get<MovieGenresResponse>(
    `/genre/movie/list?${search.toString()}`,
  )
}
