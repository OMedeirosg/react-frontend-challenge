import type { MovieListItem } from '@/features/movies/types'
import { ApiError } from '@/lib/api'

import { Button } from '@/components/ui/button'

import { MoviesDiscoveryTable } from './movies-discovery-table'
import { MoviesDiscoveryTableSkeleton } from './movies-discovery-table-skeleton'

type CuratedListMode = 'trending' | 'popular'

export type CuratedListSectionProps = {
  activeList: CuratedListMode
  activePage: number
  totalPages?: number
  isPending: boolean
  isFetching: boolean
  isError: boolean
  error: unknown
  movies: MovieListItem[]
  genres?: { id: number; name: string }[]
  emptyMessage: string
  onPrevPage: () => void
  onNextPage: () => void
}

export function CuratedListSection(props: Readonly<CuratedListSectionProps>) {
  const {
    activeList,
    activePage,
    totalPages,
    isPending,
    isFetching,
    isError,
    error,
    movies,
    genres,
    emptyMessage,
    onPrevPage,
    onNextPage,
  } = props

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 max-w-5xl">
        <h2 className="text-xl font-semibold">
          {activeList === 'trending' ? 'Trending' : 'Popular'}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Página {activePage}
            {totalPages ? ` / ${totalPages}` : ''}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={activePage <= 1 || isPending}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={isPending || (totalPages ? activePage >= totalPages : false)}
          >
            Próxima
          </Button>
        </div>
      </div>
      {isError ? (
        <p className="text-destructive" role="alert">
          {error instanceof ApiError
            ? `Erro ${error.status}: falha ao buscar ${activeList}.`
            : `Não foi possível carregar ${activeList}.`}
        </p>
      ) : null}
      {isPending ? <MoviesDiscoveryTableSkeleton className="max-w-5xl" /> : null}
      {!isPending && !isError && movies.length === 0 ? (
        <p className="text-muted-foreground max-w-5xl">{emptyMessage}</p>
      ) : null}
      {movies.length > 0 ? (
        <MoviesDiscoveryTable
          movies={movies}
          className="max-w-5xl"
          genres={genres}
          isLoading={isFetching && !isPending}
        />
      ) : null}
    </section>
  )
}

