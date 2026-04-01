import {
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'

import { useAuthStore } from '@/features/auth/store'
import { useDiscoveryFeedback } from '@/features/movies/model/use-discovery-feedback'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import {
  discoveryDraftSchema,
  discoveryUrlSearchSchema,
  type DiscoverySearch,
} from '@/features/movies/model/discovery-search-schema'
import { useDiscoveryMovies, useMovieGenres } from '@/features/movies/queries'
import type { MovieListItem } from '@/features/movies/types'
import { DiscoveryFiltersToolbar } from '@/features/movies/ui/discovery-filters-toolbar'
import { MoviesDiscoveryTableSkeleton } from '@/features/movies/ui/movies-discovery-table-skeleton'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { MoviesTableLayout } from '@/features/movies/ui/movies-table-layout'
import { discoveryListInlineErrorMessage } from '@/features/movies/model/movie-query-errors'
import { useToastStore } from '@/shared/model/toast-store'
import {
  DEFAULT_DISCOVERY_LIST_PARAMS,
  normalizeDiscoveryListParams,
  type DiscoveryListParams,
} from '@/features/movies/model/discovery-list-params'

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

export const Route = createFileRoute('/discovery')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  validateSearch: (search): DiscoverySearch => {
    return discoveryUrlSearchSchema.parse(search)
  },
  component: DiscoveryComponent,
})

function DiscoveryComponent() {
  const navigate = useNavigate()
  const showToast = useToastStore((s) => s.showToast)
  const search = Route.useSearch()
  const params = useMemo(() => toDiscoveryParams(search), [search])

  const [draftGenreId, setDraftGenreId] = useState<number | null>(params.genreId)
  const [draftYear, setDraftYear] = useState<number | null>(params.year)
  const [draftMinVote, setDraftMinVote] = useState<number | null>(params.minVote)

  useLayoutEffect(() => {
    setDraftGenreId(params.genreId)
    setDraftYear(params.year)
    setDraftMinVote(params.minVote)
  }, [
    params.genreId,
    params.minVote,
    params.mode,
    params.page,
    params.query,
    params.year,
  ])

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

  return (
    <div className="p-4">
      <h1 className="mb-1 text-2xl font-semibold">Discovery</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Busca global via topbar e filtros avançados em um único fluxo.
      </p>

      <MoviesTableLayout
        orientation="top"
        filters={
          <DiscoveryFiltersToolbar
            className="w-full"
            ui={ui}
            actions={actions}
            genres={genresQuery.data?.genres}
            isApplyDisabled={isApplyDisabled}
          />
        }
        content={
          <>
            {moviesQuery.isError ? (
              <p className="w-full text-destructive" role="alert">
                {discoveryListInlineErrorMessage(moviesQuery.error)}
              </p>
            ) : null}

            {moviesQuery.isPending ? (
              <MoviesDiscoveryTableSkeleton className="w-full" />
            ) : null}

            {moviesQuery.isFetching && !moviesQuery.isPending ? (
              <p
                className="mb-2 w-full text-sm text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                Aplicando filtros…
              </p>
            ) : null}

            {moviesQuery.data?.results.length === 0 ? (
              <p
                className="w-full text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                {emptyMessage}
              </p>
            ) : null}

            {moviesQuery.data?.results.length ? (
              <MoviesDiscoveryTable
                movies={moviesQuery.data.results}
                totalResults={moviesQuery.data.total_results}
                className="w-full"
                genres={genresQuery.data?.genres}
                isLoading={moviesQuery.isFetching && !moviesQuery.isPending}
                actions={{
                  onToggleWatchlist: watchlistActions.toggleFromMovie,
                  isInWatchlist: watchlistActions.isInWatchlist,
                  onOpenDetails: (movie: MovieListItem) => {
                    void navigate({
                      to: '/movie/$id',
                      params: { id: String(movie.id) },
                    })
                  },
                }}
                externalPagination={{
                  page: ui.page,
                  totalPages: moviesQuery.data?.total_pages,
                  onPrevPage: actions.prevPage,
                  onNextPage: actions.nextPage,
                  disablePrev: ui.page <= 1 || moviesQuery.isPending,
                  disableNext:
                    moviesQuery.isPending ||
                    (moviesQuery.data?.total_pages
                      ? ui.page >= moviesQuery.data.total_pages
                      : false),
                }}
              />
            ) : null}
          </>
        }
      />
    </div>
  )
}
