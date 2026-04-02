import { useQuery } from '@tanstack/react-query'

import {
  getMovieCredits,
  getMovieDetails,
  getMovieGenres,
  getMovieSimilar,
  getMovieVideos,
  getPopularMovies,
  getTrendingMovies,
} from '../tmdbMovies'
import { movieKeys } from './movie-keys'

const POPULAR_LIST_STALE_MS = 1000 * 60 * 5
const GENRES_STALE_MS = 1000 * 60 * 60 * 24 // 24h

export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: movieKeys.popular(page),
    queryFn: () => getPopularMovies({ page }),
    staleTime: POPULAR_LIST_STALE_MS,
  })
}

export function useTrendingMovies(page = 1, timeWindow: 'day' | 'week' = 'day') {
  return useQuery({
    queryKey: movieKeys.trending(page, timeWindow),
    queryFn: () => getTrendingMovies({ page, timeWindow, language: 'pt-BR' }),
    staleTime: POPULAR_LIST_STALE_MS,
  })
}

export function useMovieGenres(language = 'pt-BR') {
  return useQuery({
    queryKey: movieKeys.genres(language),
    queryFn: () => getMovieGenres({ language }),
    staleTime: GENRES_STALE_MS,
  })
}

export function useMovieDetails(movieId: number, language = 'pt-BR') {
  return useQuery({
    queryKey: movieKeys.detail(movieId, language),
    queryFn: () => getMovieDetails({ movieId, language }),
    enabled: Number.isFinite(movieId) && movieId > 0,
    staleTime: POPULAR_LIST_STALE_MS,
  })
}

export function useMovieCredits(movieId: number, language = 'pt-BR') {
  return useQuery({
    queryKey: movieKeys.credits(movieId, language),
    queryFn: () => getMovieCredits({ movieId, language }),
    enabled: Number.isFinite(movieId) && movieId > 0,
    staleTime: POPULAR_LIST_STALE_MS,
  })
}

export function useMovieVideos(movieId: number, language = 'pt-BR') {
  return useQuery({
    queryKey: movieKeys.videos(movieId, language),
    queryFn: () => getMovieVideos({ movieId, language }),
    enabled: Number.isFinite(movieId) && movieId > 0,
    staleTime: POPULAR_LIST_STALE_MS,
  })
}

const SIMILAR_PAGE = 1

export function useMovieSimilar(movieId: number, language = 'pt-BR') {
  return useQuery({
    queryKey: movieKeys.similar(movieId, language, SIMILAR_PAGE),
    queryFn: () => getMovieSimilar({ movieId, language, page: SIMILAR_PAGE }),
    enabled: Number.isFinite(movieId) && movieId > 0,
    staleTime: POPULAR_LIST_STALE_MS,
  })
}
