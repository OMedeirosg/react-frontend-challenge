import { flexRender, type Column, type Header } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import type { MovieListItem } from '@/features/movies/types'

export function sortAriaSort(
  header: Header<MovieListItem, unknown>,
): 'ascending' | 'descending' | 'none' {
  const s = header.column.getIsSorted()
  if (s === 'asc') return 'ascending'
  if (s === 'desc') return 'descending'
  return 'none'
}

function sortIndicator(column: Column<MovieListItem, unknown>): string {
  const s = column.getIsSorted()
  if (s === 'asc') return ' ▲'
  if (s === 'desc') return ' ▼'
  return ''
}

function headerSortLabel(header: Header<MovieListItem, unknown>): string {
  const h = header.column.columnDef.header
  return typeof h === 'string' ? h : 'coluna'
}

export function renderTableHeaderContent(
  header: Header<MovieListItem, unknown>,
): ReactNode {
  if (header.isPlaceholder) return null
  if (!header.column.getCanSort()) {
    return flexRender(header.column.columnDef.header, header.getContext())
  }

  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-1 rounded-md py-0.5 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      onClick={header.column.getToggleSortingHandler()}
      aria-label={`Ordenar por ${headerSortLabel(header)}`}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {sortIndicator(header.column)}
    </button>
  )
}
