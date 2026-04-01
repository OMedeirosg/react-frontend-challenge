import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store'
import { useCuratedListErrorToasts } from '@/features/movies/model/use-curated-list-error-toasts'
import { useHomeCuratedFilteredMovies } from '@/features/movies/model/use-home-curated-filtered-movies'
import { useHomeCuratedState } from '@/features/movies/model/use-home-curated-state'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import type { MovieListItem } from '@/features/movies/types'
import {
  useMovieGenres,
  usePopularMovies,
  useTrendingMovies,
} from '@/features/movies/queries'
import { CuratedListSection } from '@/features/movies/ui/curated-list-section'
import { HomeCuratedListToggle } from '@/features/movies/ui/home-curated-list-toggle'
import { HomeCuratedToolbar } from '@/features/movies/ui/home-curated-toolbar'
import { MoviesTableLayout } from '@/features/movies/ui/movies-table-layout'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  component: HomeComponent,
})

function HomeComponent() {
  const navigate = useNavigate()
  const { ui, actions, isApplyDisabled } = useHomeCuratedState()
  const watchlistActions = useWatchlistActions()
  const genresQuery = useMovieGenres('pt-BR')
  const trendingQuery = useTrendingMovies(ui.trendingPage, 'day')
  const popularQuery = usePopularMovies(ui.popularPage)
  useCuratedListErrorToasts(trendingQuery, popularQuery)

  const activeQuery = ui.activeList === 'trending' ? trendingQuery : popularQuery
  const activePage = ui.activePage

  const { filteredMovies, emptyMessage } = useHomeCuratedFilteredMovies({
    ui: {
      activeList: ui.activeList,
      genreId: ui.appliedGenreId,
      year: ui.appliedYear,
      minVote: ui.appliedMinVote,
    },
    trendingData: trendingQuery.data,
    popularData: popularQuery.data,
  })

  const tableActions = {
    onToggleWatchlist: watchlistActions.toggleFromMovie,
    isInWatchlist: watchlistActions.isInWatchlist,
    onOpenDetails: (movie: MovieListItem) => {
      void navigate({ to: '/movie/$id', params: { id: String(movie.id) } })
    },
  }

  return (
    <div className="px-4 pt-4 pb-3">
      <h1 className="mb-1 text-2xl font-semibold">Dashboard</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Home mostra listas curadas (Trending/Popular). Discovery cobre catálogo
        geral com busca global na topbar e filtros avançados.
      </p>

      <div className="mb-2">
        <HomeCuratedListToggle
          activeList={ui.activeList}
          onSelectList={actions.setActiveList}
        />
      </div>
      <MoviesTableLayout
        orientation="top"
        content={
          <CuratedListSection
            filtersSlot={
              <HomeCuratedToolbar
                className="space-y-2"
                ui={ui}
                actions={actions}
                isApplyDisabled={isApplyDisabled}
                genres={genresQuery.data?.genres}
              />
            }
            activeList={ui.activeList}
            activePage={activePage}
            totalPages={activeQuery.data?.total_pages}
            totalResults={activeQuery.data?.total_results}
            isPending={activeQuery.isPending}
            isFetching={activeQuery.isFetching}
            isError={activeQuery.isError}
            error={activeQuery.error}
            movies={filteredMovies}
            genres={genresQuery.data?.genres}
            emptyMessage={emptyMessage}
            onPrevPage={actions.prevPage}
            onNextPage={actions.nextPage}
            tableActions={tableActions}
          />
        }
      />
    </div>
  )
}
