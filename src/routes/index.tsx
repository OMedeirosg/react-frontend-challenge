import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store'
import { usePopularMovies } from '@/features/movies/queries'
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
  const { data, isPending, isError, error } = usePopularMovies(1)

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">Populares (TMDB)</h1>

      {isPending && (
        <output className="text-muted-foreground" aria-live="polite">
          Carregando…
        </output>
      )}

      {isError && (
        <p className="text-destructive" role="alert">
          {error instanceof ApiError
            ? `Erro ${error.status}: falha ao buscar filmes populares.`
            : 'Não foi possível carregar a lista.'}
        </p>
      )}

      {data && (
        <MoviesDiscoveryTable movies={data.results} className="max-w-5xl" />
      )}
    </div>
  )
}
