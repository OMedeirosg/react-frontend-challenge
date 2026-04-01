import { discoveryListInlineErrorMessage } from '@/features/movies/model/movie-query-errors'
import type { MovieListItem } from '@/features/movies/types'
import { DiscoveryFiltersToolbar } from '@/features/movies/ui/discovery-filters-toolbar'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { MoviesDiscoveryTableSkeleton } from '@/features/movies/ui/movies-discovery-table-skeleton'
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
  } = ctx

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
              <QueryInlineError>
                {discoveryListInlineErrorMessage(moviesQuery.error)}
              </QueryInlineError>
            ) : null}

            {moviesQuery.isPending ? (
              <MoviesDiscoveryTableSkeleton className="w-full" />
            ) : null}

            {moviesQuery.isFetching && !moviesQuery.isPending ? (
              <QueryFetchingHint>Aplicando filtros…</QueryFetchingHint>
            ) : null}

            {moviesQuery.data?.results.length === 0 ? (
              <EmptyState description={emptyMessage} />
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
