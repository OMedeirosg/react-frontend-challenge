import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/features/auth/store'
import {
  useMovieGenres,
  usePopularMovies,
  useTrendingMovies,
} from '@/features/movies/queries'
import { MoviesDiscoveryTableSkeleton } from '@/features/movies/ui/movies-discovery-table-skeleton'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { ApiError } from '@/lib/api'
import { useToastStore } from '@/shared/model/toast-store'

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
  const showToast = useToastStore((s) => s.showToast)
  const lastTrendingErrorRef = useRef<string | null>(null)
  const lastPopularErrorRef = useRef<string | null>(null)

  useEffect(() => {
    if (!trendingQuery.isError) {
      lastTrendingErrorRef.current = null
      return
    }

    const errorKey =
      trendingQuery.error instanceof ApiError
        ? `api-${trendingQuery.error.status}`
        : 'generic'

    if (lastTrendingErrorRef.current === errorKey) return
    lastTrendingErrorRef.current = errorKey
    showToast({
      variant: 'error',
      message:
        trendingQuery.error instanceof ApiError
          ? `Falha ao carregar Trending (erro ${trendingQuery.error.status}).`
          : 'Falha ao carregar Trending.',
    })
  }, [showToast, trendingQuery.error, trendingQuery.isError])

  useEffect(() => {
    if (!popularQuery.isError) {
      lastPopularErrorRef.current = null
      return
    }

    const errorKey =
      popularQuery.error instanceof ApiError
        ? `api-${popularQuery.error.status}`
        : 'generic'

    if (lastPopularErrorRef.current === errorKey) return
    lastPopularErrorRef.current = errorKey
    showToast({
      variant: 'error',
      message:
        popularQuery.error instanceof ApiError
          ? `Falha ao carregar Popular (erro ${popularQuery.error.status}).`
          : 'Falha ao carregar Popular.',
    })
  }, [popularQuery.error, popularQuery.isError, showToast])

  return (
    <div className="p-4">
      <h1 className="mb-1 text-2xl font-semibold">Dashboard</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Tendências e populares do dia. Para buscar por texto e usar filtros,
        acesse a rota Discovery.
      </p>

      <section className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold">Trending</h2>
        {trendingQuery.isError ? (
          <p className="text-destructive" role="alert">
            {trendingQuery.error instanceof ApiError
              ? `Erro ${trendingQuery.error.status}: falha ao buscar trending.`
              : 'Não foi possível carregar trending.'}
          </p>
        ) : null}
        {trendingQuery.isPending ? (
          <MoviesDiscoveryTableSkeleton className="max-w-5xl" />
        ) : null}
        {trendingQuery.data?.results.length ? (
          <MoviesDiscoveryTable
            movies={trendingQuery.data.results}
            className="max-w-5xl"
            genres={genresQuery.data?.genres}
            isLoading={trendingQuery.isFetching && !trendingQuery.isPending}
          />
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Popular</h2>
        {popularQuery.isError ? (
          <p className="text-destructive" role="alert">
            {popularQuery.error instanceof ApiError
              ? `Erro ${popularQuery.error.status}: falha ao buscar populares.`
              : 'Não foi possível carregar populares.'}
          </p>
        ) : null}
        {popularQuery.isPending ? (
          <MoviesDiscoveryTableSkeleton className="max-w-5xl" />
        ) : null}
        {popularQuery.data?.results.length ? (
          <MoviesDiscoveryTable
            movies={popularQuery.data.results}
            className="max-w-5xl"
            genres={genresQuery.data?.genres}
            isLoading={popularQuery.isFetching && !popularQuery.isPending}
          />
        ) : null}
      </section>
    </div>
  )
}
