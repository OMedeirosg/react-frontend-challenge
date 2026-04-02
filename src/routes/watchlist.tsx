import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import { useMovieGenres, usePrefetchMovieDetail } from '@/features/movies/queries'
import type { MovieListItem } from '@/features/movies/types'
import { MoviesFiltersPanel } from '@/features/movies/ui/movies-filters-panel'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { MoviesTableLayout } from '@/features/movies/ui/movies-table-layout'
import { useWatchlistTableFilters } from '@/features/movies/model/use-watchlist-table-filters'
import { useWatchlistStore } from '@/features/movies/model/watchlist-store'
import {
  watchlistEmptyDescription,
  watchlistFilteredEmptyDescription,
} from '@/features/movies/model/movie-query-errors'
import { EmptyState } from '@/shared/ui/feedback'
import { RoutePendingTablePage } from '@/shared/ui/route-pending-fallback'

export const Route = createFileRoute('/watchlist')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  pendingComponent: RoutePendingTablePage,
  component: WatchlistPage,
})

function WatchlistPage() {
  const navigate = useNavigate()
  const prefetchMovieDetail = usePrefetchMovieDetail('pt-BR')
  const movies = useWatchlistStore((state) => state.items)
  const genresQuery = useMovieGenres('pt-BR')
  const watchlistActions = useWatchlistActions()
  const {
    listPaginationResetKey,
    ui: filterUi,
    actions: filterActions,
    isApplyDisabled,
    filteredMovies,
  } = useWatchlistTableFilters(movies)

  return (
    <div className="p-4">
      <h1 className="mb-1 text-2xl font-semibold">Watchlist</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Filmes que você adicionou para acompanhar.
      </p>

      {movies.length === 0 ? (
        <EmptyState
          variant="bordered"
          description={watchlistEmptyDescription}
          action={
            <Button asChild variant="outline">
              <Link to="/discovery">Ir para Discovery</Link>
            </Button>
          }
        />
      ) : (
        <MoviesTableLayout
          orientation="top"
          content={
            <MoviesDiscoveryTable
              paginationResetKey={listPaginationResetKey}
              onPrefetchMovieDetail={prefetchMovieDetail}
              filtersSlot={
                <MoviesFiltersPanel
                  ariaLabel="Filtros da watchlist"
                  idPrefix="watchlist"
                  filtersInline
                  inlineTrailingSlot={
                    <Button
                      type="button"
                      className="h-8"
                      disabled={isApplyDisabled}
                      onClick={filterActions.applyFilters}
                    >
                      Aplicar filtros
                    </Button>
                  }
                  genreId={filterUi.genreId}
                  year={filterUi.year}
                  minVote={filterUi.minVote}
                  genres={genresQuery.data?.genres}
                  onGenreChange={filterActions.setGenreId}
                  onYearChange={filterActions.setYear}
                  onMinVoteChange={filterActions.setMinVote}
                  onReset={filterActions.resetFilters}
                />
              }
              movies={filteredMovies}
              totalResults={filteredMovies.length}
              genres={genresQuery.data?.genres}
              viewMode="watchlist"
              emptyState={
                filteredMovies.length === 0 ? (
                  <EmptyState description={watchlistFilteredEmptyDescription} />
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
            />
          }
        />
      )}
    </div>
  )
}
