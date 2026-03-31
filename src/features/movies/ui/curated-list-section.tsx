import type { MovieListItem } from '@/features/movies/types'
import { ApiError } from '@/lib/api'

import type { MoviesTableActions } from './movies-discovery-table-columns'
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
  onPrevPage?: () => void
  onNextPage?: () => void
  tableActions?: MoviesTableActions
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
    tableActions,
  } = props

  return (
    <section className="space-y-2">
      {isError ? (
        <p className="text-destructive" role="alert">
          {error instanceof ApiError
            ? `Erro ${error.status}: falha ao buscar ${activeList}.`
            : `Não foi possível carregar ${activeList}.`}
        </p>
      ) : null}
      {isPending ? <MoviesDiscoveryTableSkeleton className="w-full" /> : null}
      {!isPending && !isError && movies.length === 0 ? (
        <p className="w-full text-muted-foreground">{emptyMessage}</p>
      ) : null}
      {movies.length > 0 ? (
        <MoviesDiscoveryTable
          movies={movies}
          className="w-full"
          genres={genres}
          isLoading={isFetching && !isPending}
          actions={tableActions}
          externalPagination={
            onPrevPage && onNextPage
              ? {
                  page: activePage,
                  totalPages,
                  onPrevPage,
                  onNextPage,
                  disablePrev: activePage <= 1 || isPending,
                  disableNext:
                    isPending || (totalPages ? activePage >= totalPages : false),
                }
              : undefined
          }
        />
      ) : null}
    </section>
  )
}

