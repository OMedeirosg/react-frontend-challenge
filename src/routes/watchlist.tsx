import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import { useMovieGenres } from '@/features/movies/queries'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { useWatchlistStore } from '@/features/movies/model/watchlist-store'
import { useToastStore } from '@/shared/model/toast-store'

export const Route = createFileRoute('/watchlist')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  component: WatchlistPage,
})

function WatchlistPage() {
  const movies = useWatchlistStore((state) => state.items)
  const genresQuery = useMovieGenres('pt-BR')
  const showToast = useToastStore((state) => state.showToast)
  const watchlistActions = useWatchlistActions()

  return (
    <div className="p-4">
      <h1 className="mb-1 text-2xl font-semibold">Watchlist</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Filmes que voce adicionou para acompanhar.
      </p>

      {movies.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Sua Watchlist esta vazia. Adicione filmes em Discovery, Trending ou
            Popular.
          </p>
          <Button asChild variant="outline">
            <Link to="/discovery">Ir para Discovery</Link>
          </Button>
        </div>
      ) : (
        <MoviesDiscoveryTable
          movies={movies}
          genres={genresQuery.data?.genres}
          viewMode="watchlist"
          actions={{
            onToggleWatchlist: watchlistActions.toggleFromMovie,
            isInWatchlist: watchlistActions.isInWatchlist,
            onOpenDetails: () => {
              showToast({
                variant: 'info',
                message: 'Página de detalhes será disponibilizada em breve.',
              })
            },
          }}
        />
      )}
    </div>
  )
}
