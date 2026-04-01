import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import type { MovieListItem } from '@/features/movies/types'

import { MoviesDiscoveryTableColumnsMenu } from './movies-discovery-table-columns-menu'

export type MoviesDiscoveryTableToolbarRowProps = {
  readonly table: Table<MovieListItem>
  readonly filtersSlot?: ReactNode
}

export function MoviesDiscoveryTableToolbarRow(
  props: Readonly<MoviesDiscoveryTableToolbarRowProps>,
) {
  const { table, filtersSlot } = props

  return (
    <div className="mb-3 flex w-full min-w-0 flex-wrap items-end justify-between gap-3">
      <div className="min-w-0 flex-1">{filtersSlot ?? null}</div>
      <MoviesDiscoveryTableColumnsMenu table={table} />
    </div>
  )
}
