import { Fragment, useEffect, useMemo, useState } from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  useReactTable,
} from '@tanstack/react-table'

import { usePageSizeStore } from '@/shared/model/page-size-store'
import { buildMoviesDiscoveryColumns } from './movies-discovery-table-columns'
import { computeMoviesTablePagination } from './movies-discovery-table-pagination'
import type { UseMoviesDiscoveryTableArgs } from './movies-discovery-table-args'
import { MoviesDiscoveryTableToolbarRow } from './movies-discovery-table-toolbar-row'
import { MoviesDiscoveryTableView } from './movies-discovery-table-view'

export type { UseMoviesDiscoveryTableArgs } from './movies-discovery-table-args'

export function useMoviesDiscoveryTable(args: UseMoviesDiscoveryTableArgs) {
  const {
    movies,
    genres,
    isLoading = false,
    actions,
    viewMode = 'catalog',
    totalResults: totalResultsProp,
    externalPagination,
    className,
    filtersSlot,
    emptyState,
    paginationResetKey,
    onPrefetchMovieDetail,
  } = args

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
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
    state: { sorting, pagination, columnVisibility },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => String(row.id),
  })

  useEffect(() => {
    if (paginationResetKey === undefined) return
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [paginationResetKey])

  const external = externalPagination ?? null
  const { pageSize } = pagination

  const {
    currentPageLabel,
    totalPageLabel,
    disablePrevButton,
    disableNextButton,
    localPagesPerApiBatch,
    totalResults,
  } = computeMoviesTablePagination({
    table,
    moviesLength: movies.length,
    totalResultsProp,
    pageSize,
    external,
  })

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

  const showEmptyState =
    emptyState != null && movies.length === 0 && !isLoading

  const view = (
    <Fragment>
      <MoviesDiscoveryTableToolbarRow table={table} filtersSlot={filtersSlot} />
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
        showEmptyState={showEmptyState}
        emptyState={emptyState}
        onPrefetchMovieDetail={onPrefetchMovieDetail}
      />
    </Fragment>
  )

  return { view }
}
