import { useEffect, useMemo, useState } from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'

import { usePageSizeStore } from '@/shared/model/page-size-store'
import type { MovieGenre, MovieListItem } from '../types'
import {
  buildMoviesDiscoveryColumns,
  type MoviesTableActions,
} from './movies-discovery-table-columns'
import { MoviesDiscoveryTableView } from './movies-discovery-table-view'

const API_BATCH_SIZE = 20

export type MoviesDiscoveryTableProps = {
  readonly movies: MovieListItem[]
  readonly className?: string
  readonly genres?: MovieGenre[]
  readonly isLoading?: boolean
  readonly actions?: MoviesTableActions
  readonly viewMode?: 'catalog' | 'watchlist'
  readonly totalResults?: number
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
    totalResults: totalResultsProp,
    externalPagination,
  } = props
  const [sorting, setSorting] = useState<SortingState>([])
  const storedPageSize = usePageSizeStore((s) => s.pageSize)
  const setStoredPageSize = usePageSizeStore((s) => s.setPageSize)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: storedPageSize,
  })

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize: storedPageSize }))
  }, [storedPageSize])

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
  const { pageSize } = pagination
  const localPageIndex = table.getState().pagination.pageIndex
  const totalResults = totalResultsProp ?? movies.length

  const localPagesPerApiBatch = Math.ceil(API_BATCH_SIZE / pageSize)

  const currentPageLabel = isExternalPagination
    ? (external.page - 1) * localPagesPerApiBatch + localPageIndex + 1
    : localPageIndex + 1

  const totalPageLabel = totalResults > 0
    ? Math.ceil(totalResults / pageSize)
    : 1

  const isLastLocalPage = !table.getCanNextPage()
  const isFirstLocalPage = !table.getCanPreviousPage()

  const reachedLastApiPage = external?.totalPages
    ? external.page >= external.totalPages
    : false
  const isLastApiBatch = isExternalPagination ? reachedLastApiPage : true

  const isFirstApiBatch = isExternalPagination
    ? (external.page <= 1)
    : true

  const disablePrevButton = isExternalPagination
    ? isFirstLocalPage && (external.disablePrev ?? isFirstApiBatch)
    : isFirstLocalPage

  const disableNextButton = isExternalPagination
    ? isLastLocalPage && (external.disableNext ?? isLastApiBatch)
    : isLastLocalPage

  const handlePrevPage = () => {
    if (table.getCanPreviousPage()) {
      table.previousPage()
      return
    }
    if (external) {
      external.onPrevPage()
      const lastLocal = Math.max(0, localPagesPerApiBatch - 1)
      setPagination((prev) => ({ ...prev, pageIndex: lastLocal }))
    }
  }

  const handleNextPage = () => {
    if (table.getCanNextPage()) {
      table.nextPage()
      return
    }
    if (external) {
      external.onNextPage()
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    setStoredPageSize(newSize)
    setPagination({ pageIndex: 0, pageSize: newSize })
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
      totalResults={totalResults}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      disablePrevButton={disablePrevButton}
      disableNextButton={disableNextButton}
      onPrevPage={handlePrevPage}
      onNextPage={handleNextPage}
    />
  )
}
