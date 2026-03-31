import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import type { MovieGenre, MovieListItem } from '../types'
import {
  buildMoviesDiscoveryColumns,
  type MoviesTableActions,
} from './movies-discovery-table-columns'
import {
  renderTableHeaderContent,
  sortAriaSort,
} from './movies-discovery-table-header-content'

export type MoviesDiscoveryTableProps = {
  readonly movies: MovieListItem[]
  readonly className?: string
  readonly genres?: MovieGenre[]
  readonly isLoading?: boolean
  readonly actions?: MoviesTableActions
  readonly viewMode?: 'catalog' | 'watchlist'
}

export function MoviesDiscoveryTable(props: Readonly<MoviesDiscoveryTableProps>) {
  const {
    movies,
    className,
    genres,
    isLoading = false,
    actions,
    viewMode = 'catalog',
  } = props
  const [sorting, setSorting] = useState<SortingState>([])

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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String(row.id),
  })

  return (
    <div
      className={cn(
        'relative overflow-x-auto rounded-lg ring-1 ring-border',
        className,
      )}
    >
      <table
        className="w-full min-w-[920px] table-fixed border-collapse text-sm"
        aria-busy={isLoading}
      >
        <colgroup>
          <col className="w-[76px]" />
          <col className="w-[280px]" />
          <col className="w-[220px]" />
          <col className="w-[80px]" />
          <col className="w-[64px]" />
          <col className="w-[52px]" />
        </colgroup>
        <caption className="sr-only">
          {viewMode === 'watchlist'
            ? 'Tabela da watchlist: colunas pôster, título, gênero, data de lançamento, nota e ações.'
            : 'Tabela de filmes em descoberta: colunas pôster, título, gênero, ano, nota e ações. Use os cabeçalhos para ordenar quando disponível.'}
        </caption>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-muted/40">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  aria-sort={sortAriaSort(header)}
                  className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap"
                >
                  {renderTableHeaderContent(header)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                'border-b border-border last:border-b-0 hover:bg-muted/30',
                actions?.isInWatchlist(row.original.id)
                  ? 'bg-amber-500/5 hover:bg-amber-500/10'
                  : undefined,
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 align-middle whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/65">
          <div
            className="size-7 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-foreground"
            aria-label="Atualizando lista de filmes"
          />
        </div>
      ) : null}
    </div>
  )
}
