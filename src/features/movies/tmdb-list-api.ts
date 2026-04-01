import {
  discoverMoviesRequestSchema,
  movieGenresRequestSchema,
  movieGenresResponseSchema,
  paginatedMoviesResponseSchema,
  parseTmdbRequest,
  popularMoviesRequestSchema,
  searchMoviesRequestSchema,
  trendingMoviesRequestSchema,
  type DiscoverMoviesParams,
  type MovieGenresParams,
  type PopularMoviesParams,
  type SearchMoviesParamsBase,
  type TrendingMoviesParams,
} from './contracts/tmdb.contracts'
import { TMDB_ENDPOINT, tmdbGetParsed } from './tmdb-http'
import type { MovieGenresResponse, PaginatedMoviesResponse } from './types'

export type SearchMoviesParams = SearchMoviesParamsBase & {
  signal?: AbortSignal
}

export async function getPopularMovies(
  params: PopularMoviesParams = {},
): Promise<PaginatedMoviesResponse> {
  const input = parseTmdbRequest(
    popularMoviesRequestSchema,
    params,
    TMDB_ENDPOINT.popular,
  )
  const q = new URLSearchParams({
    page: String(input.page),
    language: input.language,
  })
  return tmdbGetParsed(
    `/movie/popular?${q}`,
    paginatedMoviesResponseSchema,
    TMDB_ENDPOINT.popular,
  )
}

export async function getTrendingMovies(
  params: TrendingMoviesParams = {},
): Promise<PaginatedMoviesResponse> {
  const input = parseTmdbRequest(
    trendingMoviesRequestSchema,
    params,
    TMDB_ENDPOINT.trending,
  )
  const q = new URLSearchParams({
    page: String(input.page),
    language: input.language,
  })
  return tmdbGetParsed(
    `/trending/movie/${input.timeWindow}?${q}`,
    paginatedMoviesResponseSchema,
    TMDB_ENDPOINT.trending,
  )
}

export async function searchMovies(
  params: SearchMoviesParams,
): Promise<PaginatedMoviesResponse> {
  const { signal, ...rest } = params
  const input = parseTmdbRequest(
    searchMoviesRequestSchema,
    rest,
    TMDB_ENDPOINT.search,
  )
  const q = new URLSearchParams({
    query: input.query,
    page: String(input.page),
    language: input.language,
    include_adult: String(input.includeAdult),
  })
  return tmdbGetParsed(
    `/search/movie?${q}`,
    paginatedMoviesResponseSchema,
    TMDB_ENDPOINT.search,
    { signal },
  )
}

export async function discoverMovies(
  params: DiscoverMoviesParams = {},
): Promise<PaginatedMoviesResponse> {
  const input = parseTmdbRequest(
    discoverMoviesRequestSchema,
    params,
    TMDB_ENDPOINT.discover,
  )
  const q = new URLSearchParams({
    page: String(input.page),
    language: input.language,
    sort_by: input.sortBy,
    include_adult: String(input.includeAdult),
    include_video: 'false',
  })
  if (input.genreId != null) q.set('with_genres', String(input.genreId))
  if (input.year != null) q.set('primary_release_year', String(input.year))
  if (input.minVote != null) q.set('vote_average.gte', String(input.minVote))
  return tmdbGetParsed(
    `/discover/movie?${q}`,
    paginatedMoviesResponseSchema,
    TMDB_ENDPOINT.discover,
  )
}

export async function getMovieGenres(
  params: MovieGenresParams = {},
): Promise<MovieGenresResponse> {
  const input = parseTmdbRequest(
    movieGenresRequestSchema,
    params,
    TMDB_ENDPOINT.genres,
  )
  const q = new URLSearchParams({ language: input.language })
  return tmdbGetParsed(
    `/genre/movie/list?${q}`,
    movieGenresResponseSchema,
    TMDB_ENDPOINT.genres,
  )
}
