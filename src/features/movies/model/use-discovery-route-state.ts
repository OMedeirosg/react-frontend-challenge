import { useCallback, useMemo, useState } from 'react'

import { useDiscoveryFeedback } from '@/features/movies/model/use-discovery-feedback'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import {
  discoveryDraftSchema,
  type DiscoverySearch,
} from '@/features/movies/model/discovery-search-schema'
import { useDiscoveryMovies, useMovieGenres } from '@/features/movies/queries'
import {
  DEFAULT_DISCOVERY_LIST_PARAMS,
  normalizeDiscoveryListParams,
  type DiscoveryListParams,
} from '@/features/movies/model/discovery-list-params'
import { useToastStore } from '@/shared/model/toast-store'

function toDiscoveryParams(search: DiscoverySearch): DiscoveryListParams {
  return normalizeDiscoveryListParams({
    query: search.q ?? '',
    mode: search.mode ?? DEFAULT_DISCOVERY_LIST_PARAMS.mode,
    page: search.page ?? DEFAULT_DISCOVERY_LIST_PARAMS.page,
    genreId: search.genre ?? null,
    year: search.year ?? null,
    minVote: search.minVote ?? null,
  })
}

export function useDiscoveryRouteState(
  search: DiscoverySearch,
  navigate: ReturnType<
    typeof import('@tanstack/react-router').useNavigate
  >,
) {
  const showToast = useToastStore((s) => s.showToast)
  const params = useMemo(() => toDiscoveryParams(search), [search])

  const paramsKey = useMemo(
    () =>
      `${params.genreId}-${params.year}-${params.minVote}-${params.mode}-${params.page}-${params.query}`,
    [
      params.genreId,
      params.minVote,
      params.mode,
      params.page,
      params.query,
      params.year,
    ],
  )

  const [draftGenreId, setDraftGenreId] = useState<number | null>(params.genreId)
  const [draftYear, setDraftYear] = useState<number | null>(params.year)
  const [draftMinVote, setDraftMinVote] = useState<number | null>(params.minVote)
  const [lastSyncedKey, setLastSyncedKey] = useState(paramsKey)

  if (paramsKey !== lastSyncedKey) {
    setLastSyncedKey(paramsKey)
    setDraftGenreId(params.genreId)
    setDraftYear(params.year)
    setDraftMinVote(params.minVote)
  }

  const applyFilters = useCallback(() => {
    const parsed = discoveryDraftSchema.safeParse({
      genreId: draftGenreId,
      year: draftYear,
      minVote: draftMinVote,
    })
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message
      showToast({
        variant: 'error',
        message: first ?? 'Verifique os filtros antes de aplicar.',
      })
      return
    }
    void navigate({
      to: '/discovery',
      search: (prev: DiscoverySearch) => ({
        ...prev,
        genre: parsed.data.genreId ?? undefined,
        year: parsed.data.year ?? undefined,
        minVote: parsed.data.minVote ?? undefined,
        page: 1,
      }),
    })
  }, [draftGenreId, draftMinVote, draftYear, navigate, showToast])

  const ui = useMemo(
    () => ({
      searchRaw: search.q ?? '',
      mode: params.mode,
      page: params.page,
      genreId: draftGenreId,
      year: draftYear,
      minVote: draftMinVote,
    }),
    [draftGenreId, draftMinVote, draftYear, params.mode, params.page, search.q],
  )

  const actions = useMemo(
    () => ({
      setGenreId: (value: number | null) => {
        setDraftGenreId(value)
      },
      setYear: (value: number | null) => {
        if (value != null && Math.abs(value) < 1000) return
        setDraftYear(value)
      },
      setMinVote: (value: number | null) => {
        setDraftMinVote(value)
      },
      prevPage: () => {
        void navigate({
          to: '/discovery',
          search: (prev: DiscoverySearch) => {
            const currentPage = prev.page ?? DEFAULT_DISCOVERY_LIST_PARAMS.page
            const nextPage = Math.max(1, currentPage - 1)
            return { ...prev, page: nextPage === 1 ? undefined : nextPage }
          },
        })
      },
      nextPage: () => {
        void navigate({
          to: '/discovery',
          search: (prev: DiscoverySearch) => {
            const currentPage = prev.page ?? DEFAULT_DISCOVERY_LIST_PARAMS.page
            return { ...prev, page: currentPage + 1 }
          },
        })
      },
      reset: () => {
        setDraftGenreId(null)
        setDraftYear(null)
        setDraftMinVote(null)
      },
      applyFilters,
    }),
    [applyFilters, navigate],
  )

  const genresQuery = useMovieGenres('pt-BR')
  const moviesQuery = useDiscoveryMovies(params)
  const watchlistActions = useWatchlistActions()
  const { emptyMessage } = useDiscoveryFeedback({ params, moviesQuery })

  const isApplyDisabled = moviesQuery.isFetching

  return {
    search,
    params,
    ui,
    actions,
    genresQuery,
    moviesQuery,
    watchlistActions,
    emptyMessage,
    isApplyDisabled,
    navigate,
  }
}
