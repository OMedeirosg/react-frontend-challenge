import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDiscoveryFeedback } from '@/features/movies/model/use-discovery-feedback'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import {
  discoverySearchToListParams,
  type DiscoverySearch,
} from '@/features/movies/model/discovery-search-schema'
import { tryParseDiscoveryDraftFilters } from '@/features/movies/model/parse-discovery-draft-filters'
import { useDiscoveryMovies, useMovieGenres } from '@/features/movies/queries'
import { DEFAULT_DISCOVERY_LIST_PARAMS } from '@/features/movies/model/discovery-list-params'
import { useToastStore } from '@/shared/model/toast-store'

export function useDiscoveryRouteState(
  search: DiscoverySearch,
  navigate: ReturnType<
    typeof import('@tanstack/react-router').useNavigate
  >,
) {
  const showToast = useToastStore((s) => s.showToast)
  const params = useMemo(() => discoverySearchToListParams(search), [search])

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

  const [draftGenreId, setDraftGenreId] = useState(params.genreId)
  const [draftYear, setDraftYear] = useState(params.year)
  const [draftMinVote, setDraftMinVote] = useState(params.minVote)

  useEffect(() => {
    /* Sincroniza rascunho quando a URL muda (navegação, back/forward). */
    /* eslint-disable react-hooks/set-state-in-effect -- estado derivado da fonte externa (search params) */
    setDraftGenreId(params.genreId)
    setDraftYear(params.year)
    setDraftMinVote(params.minVote)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [
    params.genreId,
    params.minVote,
    params.mode,
    params.page,
    params.query,
    params.year,
  ])

  const applyFilters = useCallback(() => {
    const parsed = tryParseDiscoveryDraftFilters(
      {
        genreId: draftGenreId,
        year: draftYear,
        minVote: draftMinVote,
      },
      showToast,
    )
    if (!parsed) return
    void navigate({
      to: '/discovery',
      search: (prev: DiscoverySearch) => ({
        ...prev,
        genre: parsed.genreId ?? undefined,
        year: parsed.year ?? undefined,
        minVote: parsed.minVote ?? undefined,
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

  const draftMatchesApplied =
    draftGenreId === params.genreId &&
    draftYear === params.year &&
    draftMinVote === params.minVote

  const isApplyDisabled = moviesQuery.isFetching || draftMatchesApplied

  return {
    search,
    params,
    /** Invariante estável da lista atual (URL); usar como `paginationResetKey` na tabela. */
    listContextKey: paramsKey,
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
