import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store'
import {
  useMovieGenres,
  usePopularMovies,
  useTrendingMovies,
} from '@/features/movies/queries'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { ApiError } from '@/lib/api'

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
  const genresQuery = useMovieGenres('pt-BR')
  const trendingQuery = useTrendingMovies(1, 'day')
  const popularQuery = usePopularMovies(1)

  return (
    <div className="p-4">
      <h1 className="mb-1 text-2xl font-semibold">Dashboard</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Tendências e populares do dia. Para buscar por texto e usar filtros,
        acesse a rota Discovery.
      </p>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">Trending</h2>
        {trendingQuery.isPending ? (
          <output className="text-muted-foreground" aria-live="polite">
            Carregando trending…
          </output>
        ) : null}
        {trendingQuery.isError ? (
          <p className="text-destructive" role="alert">
            {trendingQuery.error instanceof ApiError
              ? `Erro ${trendingQuery.error.status}: falha ao buscar trending.`
              : 'Não foi possível carregar trending.'}
          </p>
        ) : null}
        {trendingQuery.data?.results.length ? (
          <MoviesDiscoveryTable
            movies={trendingQuery.data.results}
            className="max-w-5xl"
            genres={genresQuery.data?.genres}
          />
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Popular</h2>
        {popularQuery.isPending ? (
          <output className="text-muted-foreground" aria-live="polite">
            Carregando populares…
          </output>
        ) : null}
        {popularQuery.isError ? (
          <p className="text-destructive" role="alert">
            {popularQuery.error instanceof ApiError
              ? `Erro ${popularQuery.error.status}: falha ao buscar populares.`
              : 'Não foi possível carregar populares.'}
          </p>
        ) : null}
        {popularQuery.data?.results.length ? (
          <MoviesDiscoveryTable
            movies={popularQuery.data.results}
            className="max-w-5xl"
            genres={genresQuery.data?.genres}
          />
        ) : null}
      </section>
    </div>
  )
}
