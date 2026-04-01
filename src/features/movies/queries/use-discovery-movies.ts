import { useMemo } from 'react'
import { useQuery, type QueryKey } from '@tanstack/react-query'

import { usePageSizeStore } from '@/shared/model/page-size-store'

import type { DiscoveryListParams } from '../model/discovery-list-params'
import type { AggregatedSearchListPayload } from '../model/aggregated-discovery-search'
import { sliceAggregatedToPaginatedResponse } from '../model/aggregated-discovery-search'
import {
  discoverMovies,
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
} from '../tmdbMovies'
import { fetchAggregatedSearchMatches } from './fetch-aggregated-discovery-search'
import { movieKeys } from './movie-keys'

const POPULAR_LIST_STALE_MS = 1000 * 60 * 5

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
    const mode = params.mode
    if (mode === 'popular') {
      listKey = movieKeys.popular(params.page)
    } else if (mode === 'trending') {
      listKey = movieKeys.trending(params.page, 'day')
    } else {
      listKey = movieKeys.discover({
        page: params.page,
        genreId: params.genreId,
        year: params.year,
        minVote: params.minVote,
      })
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

      const mode = params.mode
      if (mode === 'popular') {
        return getPopularMovies({ page: params.page, language })
      }
      if (mode === 'trending') {
        return getTrendingMovies({
          page: params.page,
          timeWindow: 'day',
          language,
        })
      }
      return discoverMovies({
        page: params.page,
        language,
        genreId: params.genreId,
        year: params.year,
        minVote: params.minVote,
      })
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
