import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import { useMovieGenres } from '@/features/movies/queries'
import type { MovieListItem } from '@/features/movies/types'
import { MoviesFiltersPanel } from '@/features/movies/ui/movies-filters-panel'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { MoviesTableLayout } from '@/features/movies/ui/movies-table-layout'
import { useWatchlistStore } from '@/features/movies/model/watchlist-store'

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
  const navigate = useNavigate()
  const movies = useWatchlistStore((state) => state.items)
  const genresQuery = useMovieGenres('pt-BR')
  const watchlistActions = useWatchlistActions()
  const [genreId, setGenreId] = useState<number | null>(null)
  const [year, setYear] = useState<number | null>(null)
  const [minVote, setMinVote] = useState<number | null>(null)

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (genreId != null && !movie.genre_ids.includes(genreId)) return false
      if (year != null && !movie.release_date.startsWith(String(year))) return false
      if (minVote != null && movie.vote_average < minVote) return false
      return true
    })
  }, [genreId, minVote, movies, year])

  return (
    <div className="p-4">
      <h1 className="mb-1 text-2xl font-semibold">Watchlist</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Filmes que você adicionou para acompanhar.
      </p>

      {movies.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Sua Watchlist está vazia. Adicione filmes em Discovery, Trending ou
            Popular.
          </p>
          <Button asChild variant="outline">
            <Link to="/discovery">Ir para Discovery</Link>
          </Button>
        </div>
      ) : (
        <MoviesTableLayout
          orientation="top"
          filters={
            <MoviesFiltersPanel
              ariaLabel="Filtros da watchlist"
              idPrefix="watchlist"
              filtersInline
              genreId={genreId}
              year={year}
              minVote={minVote}
              genres={genresQuery.data?.genres}
              onGenreChange={setGenreId}
              onYearChange={setYear}
              onMinVoteChange={setMinVote}
              onReset={() => {
                setGenreId(null)
                setYear(null)
                setMinVote(null)
              }}
            />
          }
          content={
            <>
              {filteredMovies.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum filme da sua watchlist corresponde aos filtros atuais.
                </p>
              ) : null}
              <MoviesDiscoveryTable
                movies={filteredMovies}
                totalResults={filteredMovies.length}
                genres={genresQuery.data?.genres}
                viewMode="watchlist"
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
            </>
          }
        />
      )}
    </div>
  )
}
