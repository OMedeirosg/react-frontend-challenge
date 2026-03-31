import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'

import { useAuthStore } from '@/features/auth/store'
import { useDiscoveryFeedback } from '@/features/movies/model/use-discovery-feedback'
import { useDiscoveryListParams } from '@/features/movies/model/use-discovery-list-params'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
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
  const watchlistActions = useWatchlistActions()
  const { contextLabel, emptyMessage } = useDiscoveryFeedback({
    contextMode,
    params,
    moviesQuery,
  })

  return (
    <div className="p-4">
      <h1 className="mb-1 text-2xl font-semibold">Discovery</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Busca textual e filtros avançados em um único fluxo.
      </p>

      <section className="mx-auto w-full max-w-5xl">
        <DiscoveryFiltersToolbar
          className="mb-4 w-full"
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
          <p className="w-full text-destructive" role="alert">
            {moviesQuery.error instanceof ApiError
              ? `Erro ${moviesQuery.error.status}: falha ao buscar filmes.`
              : 'Não foi possível carregar a lista.'}
          </p>
        ) : null}
        {moviesQuery.isPending ? (
          <MoviesDiscoveryTableSkeleton className="w-full" />
        ) : null}

        {moviesQuery.data?.results.length === 0 ? (
          <p
            className="w-full text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {emptyMessage}
          </p>
        ) : null}

        {moviesQuery.data?.results.length ? (
          <MoviesDiscoveryTable
            movies={moviesQuery.data.results}
            className="w-full"
            genres={genresQuery.data?.genres}
            isLoading={moviesQuery.isFetching && !moviesQuery.isPending}
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
        ) : null}
      </section>
    </div>
  )
}

