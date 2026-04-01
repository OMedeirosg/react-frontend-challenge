import type { ReactNode } from 'react'

import { curatedListInlineErrorMessage } from '@/features/movies/model/movie-query-errors'
import type { MovieListItem } from '@/features/movies/types'
import { EmptyState, QueryInlineError } from '@/shared/ui/feedback'

import type { MoviesTableActions } from './movies-discovery-table-columns'
import { MoviesDiscoveryTable } from './movies-discovery-table'

type CuratedListMode = 'trending' | 'popular'

export type CuratedListSectionProps = {
  readonly filtersSlot?: ReactNode
  activeList: CuratedListMode
  activePage: number
  totalPages?: number
  totalResults?: number
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
  /** Ver `paginationResetKey` em `MoviesDiscoveryTable`. */
  paginationResetKey?: string
  readonly onPrefetchMovieDetail?: (movieId: number) => void
}

export function CuratedListSection(props: Readonly<CuratedListSectionProps>) {
  const {
    filtersSlot,
    activeList,
    activePage,
    totalPages,
    totalResults,
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
    paginationResetKey,
    onPrefetchMovieDetail,
  } = props

  return (
    <section className="space-y-2">
      {isError ? (
        <>
          {filtersSlot ? (
            <div className="mb-3 flex w-full min-w-0 flex-wrap items-end justify-between gap-3">
              <div className="min-w-0 flex-1">{filtersSlot}</div>
            </div>
          ) : null}
          <QueryInlineError>
            {curatedListInlineErrorMessage(error, activeList)}
          </QueryInlineError>
        </>
      ) : (
        <MoviesDiscoveryTable
          filtersSlot={filtersSlot}
          movies={movies}
          className="w-full"
          genres={genres}
          isLoading={isPending || (isFetching && !isPending)}
          actions={tableActions}
          paginationResetKey={paginationResetKey}
          onPrefetchMovieDetail={onPrefetchMovieDetail}
          totalResults={totalResults}
          emptyState={
            !isPending && movies.length === 0 ? (
              <EmptyState description={emptyMessage} />
            ) : undefined
          }
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
      )}
    </section>
  )
}
