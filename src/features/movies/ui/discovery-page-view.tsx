import { discoveryListInlineErrorMessage } from '@/features/movies/model/movie-query-errors'
import { usePrefetchMovieDetail } from '@/features/movies/queries'
import type { MovieListItem } from '@/features/movies/types'
import { DiscoveryFiltersToolbar } from '@/features/movies/ui/discovery-filters-toolbar'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { MoviesTableLayout } from '@/features/movies/ui/movies-table-layout'
import {
  EmptyState,
  QueryFetchingHint,
  QueryInlineError,
} from '@/shared/ui/feedback'

import type { useDiscoveryRouteState } from '../model/use-discovery-route-state'

type DiscoveryPageViewProps = {
  readonly ctx: ReturnType<typeof useDiscoveryRouteState>
}

export function DiscoveryPageView(props: Readonly<DiscoveryPageViewProps>) {
  const { ctx } = props
  const {
    ui,
    actions,
    genresQuery,
    moviesQuery,
    watchlistActions,
    emptyMessage,
    isApplyDisabled,
    navigate,
    listContextKey,
  } = ctx

  const prefetchMovieDetail = usePrefetchMovieDetail('pt-BR')

  const results = moviesQuery.data?.results ?? []

  const filtersToolbar = (
    <DiscoveryFiltersToolbar
      className="w-full"
      ui={ui}
      actions={actions}
      genres={genresQuery.data?.genres}
      isApplyDisabled={isApplyDisabled}
    />
  )

  return (
    <div className="min-w-0 p-4">
      <h1 className="mb-1 text-2xl font-semibold">Discovery</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Catálogo do TMDB com busca na barra superior e filtros para a tabela.
      </p>

      <MoviesTableLayout
        orientation="top"
        content={
          <>
            {moviesQuery.isError ? (
              <>
                <div className="mb-3 flex w-full min-w-0 flex-wrap items-end justify-between gap-3">
                  <div className="min-w-0 flex-1">{filtersToolbar}</div>
                </div>
                <QueryInlineError>
                  {discoveryListInlineErrorMessage(moviesQuery.error)}
                </QueryInlineError>
              </>
            ) : (
              <>
                {moviesQuery.isFetching && !moviesQuery.isPending ? (
                  <QueryFetchingHint>Aplicando filtros…</QueryFetchingHint>
                ) : null}

                <MoviesDiscoveryTable
                  filtersSlot={filtersToolbar}
                  movies={results}
                  paginationResetKey={listContextKey}
                  onPrefetchMovieDetail={prefetchMovieDetail}
                  totalResults={moviesQuery.data?.total_results}
                  className="w-full"
                  genres={genresQuery.data?.genres}
                  isLoading={
                    moviesQuery.isPending ||
                    (moviesQuery.isFetching && !moviesQuery.isPending)
                  }
                  emptyState={
                    !moviesQuery.isPending && results.length === 0 ? (
                      <EmptyState description={emptyMessage} />
                    ) : undefined
                  }
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
              </>
            )}
          </>
        }
      />
    </div>
  )
}
