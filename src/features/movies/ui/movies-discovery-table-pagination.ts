import type { Table } from '@tanstack/react-table'

import type { MovieListItem } from '../types'

const API_BATCH_SIZE = 20

type ExternalPagination = {
  readonly page: number
  readonly totalPages?: number
  readonly disablePrev?: boolean
  readonly disableNext?: boolean
}

export function computeMoviesTablePagination(args: {
  readonly table: Table<MovieListItem>
  readonly moviesLength: number
  readonly totalResultsProp: number | undefined
  readonly pageSize: number
  readonly external: ExternalPagination | null
}) {
  const {
    table,
    moviesLength,
    totalResultsProp,
    pageSize,
    external,
  } = args

  const isExternalPagination = external !== null
  const localPageIndex = table.getState().pagination.pageIndex
  const totalResults = totalResultsProp ?? moviesLength

  const effectiveBatchSize =
    moviesLength > 0 ? moviesLength : API_BATCH_SIZE
  const localPagesPerApiBatch = Math.max(
    1,
    Math.ceil(effectiveBatchSize / pageSize),
  )

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

  return {
    currentPageLabel,
    totalPageLabel,
    disablePrevButton,
    disableNextButton,
    localPagesPerApiBatch,
    totalResults,
    isExternalPagination,
    external,
  }
}
