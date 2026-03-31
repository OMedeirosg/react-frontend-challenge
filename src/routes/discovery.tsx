import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { useAuthStore } from '@/features/auth/store'
import { useDiscoveryListParams } from '@/features/movies/model/use-discovery-list-params'
import { useDiscoveryMovies, useMovieGenres } from '@/features/movies/queries'
import { DiscoveryFiltersToolbar } from '@/features/movies/ui/discovery-filters-toolbar'
import { MoviesDiscoveryTableSkeleton } from '@/features/movies/ui/movies-discovery-table-skeleton'
import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import { ApiError } from '@/lib/api'
import { useToastStore } from '@/shared/model/toast-store'

export const Route = createFileRoute('/discovery')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  component: DiscoveryComponent,
})

function DiscoveryComponent() {
  const { ui, params, actions } = useDiscoveryListParams({
    searchDebounceMs: 400,
  })
  const [contextMode, setContextMode] = useState<'search' | 'filters'>(
    'filters',
  )
  const genresQuery = useMovieGenres('pt-BR')
  const moviesQuery = useDiscoveryMovies(params)
  const showToast = useToastStore((s) => s.showToast)
  const lastErrorToastRef = useRef<string | null>(null)
  const lastEmptyToastRef = useRef<string | null>(null)
  const hasQuery = params.query.length > 0

  let contextLabel = 'Discovering with filters'
  if (contextMode === 'search') {
    contextLabel = hasQuery
      ? `Searching for "${params.query}"`
      : 'Pesquisa contextual ativa'
  }

  const emptyMessage = hasQuery
    ? `Ainda não achamos o que você procura para "${params.query}". Tente busca contextual ou filtros mais amplos.`
    : 'Ainda não achamos o que você procura. Tente busca contextual ou filtros mais amplos.'

  useEffect(() => {
    if (!moviesQuery.isError) {
      lastErrorToastRef.current = null
      return
    }
    const errorKey =
      moviesQuery.error instanceof ApiError
        ? `api-${moviesQuery.error.status}`
        : 'generic'

    if (lastErrorToastRef.current === errorKey) return
    lastErrorToastRef.current = errorKey

    const message =
      moviesQuery.error instanceof ApiError
        ? `Falha ao buscar filmes (erro ${moviesQuery.error.status}).`
        : 'Falha ao buscar filmes. Verifique a conexão e tente novamente.'
    showToast({ variant: 'error', message })
  }, [moviesQuery.error, moviesQuery.isError, showToast])

  useEffect(() => {
    if (moviesQuery.isPending || moviesQuery.isError) return
    if (moviesQuery.data?.results.length !== 0) {
      lastEmptyToastRef.current = null
      return
    }
    const emptyKey = hasQuery
      ? `search-${params.query}`
      : `filters-${params.genreId ?? 'all'}-${params.year ?? 'all'}-${params.minVote ?? 'all'}`

    if (lastEmptyToastRef.current === emptyKey) return
    lastEmptyToastRef.current = emptyKey
    showToast({
      variant: 'info',
      message: 'Sem resultados no momento. Tente busca contextual ou filtros mais amplos.',
    })
  }, [
    hasQuery,
    moviesQuery.data?.results.length,
    moviesQuery.isError,
    moviesQuery.isPending,
    params.genreId,
    params.minVote,
    params.query,
    params.year,
    showToast,
  ])

  return (
    <div className="p-4">
      <h1 className="mb-1 text-2xl font-semibold">Discovery</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Busca textual e filtros avançados em um único fluxo.
      </p>

      <DiscoveryFiltersToolbar
        className="mb-4 max-w-5xl"
        ui={ui}
        actions={actions}
        genres={genresQuery.data?.genres}
        totalPages={moviesQuery.data?.total_pages}
        contextLabel={contextLabel}
        searchActive={contextMode === 'search'}
        onSelectSearchContext={() => {
          setContextMode('search')
          actions.setGenreId(null)
          actions.setYear(null)
          actions.setMinVote(null)
          showToast({
            variant: 'info',
            message: 'Modo de busca contextual ativado.',
          })
        }}
        onSelectFilterContext={() => {
          setContextMode('filters')
          actions.setSearchRaw('')
          showToast({
            variant: 'info',
            message: 'Modo de filtros avançados ativado.',
          })
        }}
      />

      {moviesQuery.isError ? (
        <p className="text-destructive" role="alert">
          {moviesQuery.error instanceof ApiError
            ? `Erro ${moviesQuery.error.status}: falha ao buscar filmes.`
            : 'Não foi possível carregar a lista.'}
        </p>
      ) : null}
      {moviesQuery.isPending ? (
        <MoviesDiscoveryTableSkeleton className="max-w-5xl" />
      ) : null}

      {moviesQuery.data?.results.length === 0 ? (
        <p className="text-muted-foreground" role="status" aria-live="polite">
          {emptyMessage}
        </p>
      ) : null}

      {moviesQuery.data?.results.length ? (
        <MoviesDiscoveryTable
          movies={moviesQuery.data.results}
          className="max-w-5xl"
          genres={genresQuery.data?.genres}
          isLoading={moviesQuery.isFetching && !moviesQuery.isPending}
        />
      ) : null}
    </div>
  )
}

