import { useMemo } from 'react'
import { useQuery, type QueryKey } from '@tanstack/react-query'

import { usePageSizeStore } from '@/shared/model/page-size-store'

import type { DiscoveryListParams } from './model/discovery-list-params'
import type { MovieListItem } from './types'
import {
  appendUniqueMatch,
  MAX_AGGREGATED_API_PAGES,
  movieMatchesDiscoveryFilters,
  sliceAggregatedToPaginatedResponse,
  type AggregatedSearchListPayload,
} from './model/aggregated-discovery-search'
import {
  discoverMovies,
  getMovieCredits,
  getMovieDetails,
  getMovieGenres,
  getMovieVideos,
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
  search: (params: {
    page: number
    query: string
    genreId: number | null
    year: number | null
    minVote: number | null
    pageSize: number
  }) =>
    [...movieKeys.lists(), 'search', params] as const,
  /** `q` + filtros: cache da lista filtrada completa (sem `page` da UI). */
  searchAggregated: (params: {
    query: string
    genreId: number | null
    year: number | null
    minVote: number | null
    pageSize: number
  }) => [...movieKeys.lists(), 'search-aggregated', params] as const,
  genres: (language: string) =>
    [...movieKeys.all, 'genres', { language }] as const,
  detail: (movieId: number, language: string) =>
    [...movieKeys.all, 'detail', { movieId, language }] as const,
  credits: (movieId: number, language: string) =>
    [...movieKeys.all, 'credits', { movieId, language }] as const,
  videos: (movieId: number, language: string) =>
    [...movieKeys.all, 'videos', { movieId, language }] as const,
}

const POPULAR_LIST_STALE_MS = 1000 * 60 * 5
const GENRES_STALE_MS = 1000 * 60 * 60 * 24 // 24h

async function fetchAggregatedSearchMatches(
  params: DiscoveryListParams,
  signal: AbortSignal | undefined,
): Promise<AggregatedSearchListPayload> {
  const language = 'pt-BR'
  const matches: MovieListItem[] = []
  const seen = new Set<number>()

  for (let apiPage = 1; apiPage <= MAX_AGGREGATED_API_PAGES; apiPage++) {
    signal?.throwIfAborted()
    const response = await searchMovies({
      query: params.query,
      page: apiPage,
      language,
      includeAdult: false,
      signal,
    })

    for (const movie of response.results) {
      if (!movieMatchesDiscoveryFilters(movie, params)) continue
      appendUniqueMatch(seen, matches, movie)
    }

    if (apiPage >= response.total_pages) break
  }

  return { matches }
}

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
  const pageSize = usePageSizeStore((s) => s.pageSize)
  const hasQuery = params.query.length > 0
  const hasActiveFilters =
    params.genreId != null || params.year != null || params.minVote != null

  let listKey: QueryKey
  if (hasQuery && hasActiveFilters) {
    listKey = movieKeys.searchAggregated({
      query: params.query,
      genreId: params.genreId,
      year: params.year,
      minVote: params.minVote,
      pageSize,
    })
  } else if (hasQuery) {
    listKey = movieKeys.search({
      page: params.page,
      query: params.query,
      genreId: params.genreId,
      year: params.year,
      minVote: params.minVote,
      pageSize,
    })
  } else {
    switch (params.mode) {
      case 'popular':
        listKey = movieKeys.popular(params.page)
        break
      case 'trending':
        listKey = movieKeys.trending(params.page, 'day')
        break
      case 'discover':
        listKey = movieKeys.discover({
          page: params.page,
          genreId: params.genreId,
          year: params.year,
          minVote: params.minVote,
        })
        break
    }
  }

  const baseQuery = useQuery({
    queryKey: listKey,
    queryFn: async ({ signal }) => {
      if (hasQuery && hasActiveFilters) {
        return fetchAggregatedSearchMatches(params, signal)
      }

      if (hasQuery) {
        return searchMovies({
          query: params.query,
          page: params.page,
          language,
          includeAdult: false,
          signal,
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

  const data = useMemo(() => {
    if (!baseQuery.data) return undefined
    if (hasQuery && hasActiveFilters) {
      return sliceAggregatedToPaginatedResponse(
        baseQuery.data as AggregatedSearchListPayload,
        params.page,
        pageSize,
      )
    }
    return baseQuery.data as Awaited<ReturnType<typeof searchMovies>>
  }, [baseQuery.data, hasActiveFilters, hasQuery, pageSize, params.page])

  return { ...baseQuery, data }
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
