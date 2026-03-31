import { useEffect, useMemo, useState } from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'

import type { MovieGenre, MovieListItem } from '../types'
import {
  buildMoviesDiscoveryColumns,
  type MoviesTableActions,
} from './movies-discovery-table-columns'
import { MoviesDiscoveryTableView } from './movies-discovery-table-view'

export type MoviesDiscoveryTableProps = {
  readonly movies: MovieListItem[]
  readonly className?: string
  readonly genres?: MovieGenre[]
  readonly isLoading?: boolean
  readonly actions?: MoviesTableActions
  readonly viewMode?: 'catalog' | 'watchlist'
  readonly externalPagination?: {
    readonly page: number
    readonly totalPages?: number
    readonly onPrevPage: () => void
    readonly onNextPage: () => void
    readonly disablePrev?: boolean
    readonly disableNext?: boolean
  }
}

export function MoviesDiscoveryTable(props: Readonly<MoviesDiscoveryTableProps>) {
  const {
    movies,
    className,
    genres,
    isLoading = false,
    actions,
    viewMode = 'catalog',
    externalPagination,
  } = props
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const genreNameById = useMemo(() => {
    if (!genres?.length) return undefined
    return new Map(genres.map((g) => [g.id, g.name]))
  }, [genres])

  const columns = useMemo(
    () => buildMoviesDiscoveryColumns(genreNameById, actions, { viewMode }),
    [actions, genreNameById, viewMode],
  )

  /* TanStack Table: React Compiler skips memoization for this hook by design. */
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is the supported API
  const table = useReactTable({
    data: movies,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => String(row.id),
  })

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [movies])

  const external = externalPagination ?? null
  const isExternalPagination = external !== null
  const currentPageLabel = isExternalPagination
    ? external.page
    : table.getState().pagination.pageIndex + 1
  const totalPageLabel = isExternalPagination
    ? external.totalPages
    : Math.max(1, table.getPageCount())

  const disablePrevButton = isExternalPagination
    ? (external.disablePrev ?? external.page <= 1)
    : !table.getCanPreviousPage()

  let disableNextButton = !table.getCanNextPage()
  if (isExternalPagination) {
    const reachedLastPage = external.totalPages
      ? external.page >= external.totalPages
      : false
    disableNextButton = external.disableNext ?? reachedLastPage
  }

  const handlePrevPage = () => {
    if (external) {
      external.onPrevPage()
      return
    }
    table.previousPage()
  }

  const handleNextPage = () => {
    if (external) {
      external.onNextPage()
      return
    }
    table.nextPage()
  }

  return (
    <MoviesDiscoveryTableView
      table={table}
      actions={actions}
      viewMode={viewMode}
      isLoading={isLoading}
      className={className}
      currentPageLabel={currentPageLabel}
      totalPageLabel={totalPageLabel}
      disablePrevButton={disablePrevButton}
      disableNextButton={disableNextButton}
      onPrevPage={handlePrevPage}
      onNextPage={handleNextPage}
    />
  )
}
