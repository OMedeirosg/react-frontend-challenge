import { useQuery } from '@tanstack/react-query'
import type { DiscoveryListParams } from './model/discovery-list-params'
import {
  discoverMovies,
  getMovieGenres,
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
} from './tmdbMovies'

export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  popular: (page: number) =>
    [...movieKeys.lists(), 'popular', { page }] as const,
  trending: (page: number, timeWindow: 'day' | 'week') =>
    [...movieKeys.lists(), 'trending', { page, timeWindow }] as const,
  discover: (params: {
    page: number
    genreId: number | null
    year: number | null
    minVote: number | null
  }) => [...movieKeys.lists(), 'discover', params] as const,
  search: (params: { page: number; query: string }) =>
    [...movieKeys.lists(), 'search', params] as const,
  genres: (language: string) =>
    [...movieKeys.all, 'genres', { language }] as const,
}

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

export function useDiscoveryMovies(params: DiscoveryListParams) {
  const language = 'pt-BR'
  const hasQuery = params.query.length > 0

  const queryKey = hasQuery
    ? movieKeys.search({ page: params.page, query: params.query })
    : (() => {
    switch (params.mode) {
      case 'popular':
        return movieKeys.popular(params.page)
      case 'trending':
        return movieKeys.trending(params.page, 'day')
      case 'discover':
        return movieKeys.discover({
          page: params.page,
          genreId: params.genreId,
          year: params.year,
          minVote: params.minVote,
        })
    }
    })()

  return useQuery({
    queryKey,
    queryFn: () => {
      if (hasQuery) {
        return searchMovies({
          query: params.query,
          page: params.page,
          language,
          includeAdult: false,
        })
      }

      switch (params.mode) {
        case 'popular':
          return getPopularMovies({ page: params.page, language })
        case 'trending':
          return getTrendingMovies({
            page: params.page,
            timeWindow: 'day',
            language,
          })
        case 'discover':
          return discoverMovies({
            page: params.page,
            language,
            genreId: params.genreId,
            year: params.year,
            minVote: params.minVote,
          })
      }
    },
    staleTime: POPULAR_LIST_STALE_MS,
  })
}
