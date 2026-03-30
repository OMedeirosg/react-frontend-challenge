import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store'
import { usePopularMovies } from '@/features/movies/queries'
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
        <ul className="max-w-2xl space-y-2">
          {data.results.map((movie) => (
            <li key={movie.id} className="border-b border-border py-2">
              <span className="font-medium">{movie.title}</span>
              {movie.release_date ? (
                <span className="text-muted-foreground">
                  {' '}
                  ({movie.release_date.slice(0, 4)})
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
