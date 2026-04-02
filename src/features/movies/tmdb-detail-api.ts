import {
  movieCreditsRequestSchema,
  movieCreditsResponseSchema,
  movieDetailsRequestSchema,
  movieDetailsResponseSchema,
  movieSimilarRequestSchema,
  movieSimilarResponseSchema,
  movieVideosRequestSchema,
  movieVideosResponseSchema,
  parseTmdbRequest,
  type MovieCreditsParams,
  type MovieDetailsParams,
  type MovieSimilarParams,
  type MovieVideosParams,
} from './contracts/tmdb.contracts'
import { TMDB_ENDPOINT, tmdbGetParsed } from './tmdb-http'
import type {
  MovieCreditsResponse,
  MovieDetails,
  MovieVideosResponse,
  PaginatedMoviesResponse,
} from './types'

export async function getMovieDetails(
  params: MovieDetailsParams,
): Promise<MovieDetails> {
  const input = parseTmdbRequest(
    movieDetailsRequestSchema,
    params,
    TMDB_ENDPOINT.detail,
  )
  const q = new URLSearchParams({ language: input.language })
  return tmdbGetParsed(
    `/movie/${input.movieId}?${q}`,
    movieDetailsResponseSchema,
    TMDB_ENDPOINT.detail,
  )
}

export async function getMovieCredits(
  params: MovieCreditsParams,
): Promise<MovieCreditsResponse> {
  const input = parseTmdbRequest(
    movieCreditsRequestSchema,
    params,
    TMDB_ENDPOINT.credits,
  )
  const q = new URLSearchParams({ language: input.language })
  return tmdbGetParsed(
    `/movie/${input.movieId}/credits?${q}`,
    movieCreditsResponseSchema,
    TMDB_ENDPOINT.credits,
  )
}

export async function getMovieVideos(
  params: MovieVideosParams,
): Promise<MovieVideosResponse> {
  const input = parseTmdbRequest(
    movieVideosRequestSchema,
    params,
    TMDB_ENDPOINT.videos,
  )
  const q = new URLSearchParams({ language: input.language })
  return tmdbGetParsed(
    `/movie/${input.movieId}/videos?${q}`,
    movieVideosResponseSchema,
    TMDB_ENDPOINT.videos,
  )
}

export async function getMovieSimilar(
  params: MovieSimilarParams,
): Promise<PaginatedMoviesResponse> {
  const input = parseTmdbRequest(
    movieSimilarRequestSchema,
    params,
    TMDB_ENDPOINT.similar,
  )
  const q = new URLSearchParams({
    language: input.language,
    page: String(input.page),
  })
  return tmdbGetParsed(
    `/movie/${input.movieId}/similar?${q}`,
    movieSimilarResponseSchema,
    TMDB_ENDPOINT.similar,
  )
}
