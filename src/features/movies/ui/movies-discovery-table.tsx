import { useMemo, useState, type ReactNode } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Column,
  type Header,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import type { MovieListItem } from '../types'
import { MovieListPoster } from './movie-list-poster'

const columnHelper = createColumnHelper<MovieListItem>()

export type MoviesDiscoveryTableProps = {
  readonly movies: MovieListItem[]
  readonly className?: string
}

function releaseYear(movie: MovieListItem): string {
  if (!movie.release_date) return '—'
  const y = movie.release_date.slice(0, 4)
  return y || '—'
}

function sortAriaSort(
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

function renderTableHeaderContent(
  header: Header<MovieListItem, unknown>,
): ReactNode {
  if (header.isPlaceholder) return null
  if (!header.column.getCanSort()) {
    return flexRender(
      header.column.columnDef.header,
      header.getContext(),
    )
  }
  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-1 rounded-md py-0.5 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      onClick={header.column.getToggleSortingHandler()}
      aria-label={`Ordenar por ${headerSortLabel(header)}`}
    >
      {flexRender(
        header.column.columnDef.header,
        header.getContext(),
      )}
      {sortIndicator(header.column)}
    </button>
  )
}

function PosterTableCell(props: Readonly<{ movie: MovieListItem }>) {
  return (
    <MovieListPoster
      posterPath={props.movie.poster_path}
      title={props.movie.title}
      className="h-14 max-h-14"
    />
  )
}

function GenreTableCell(props: Readonly<{ movie: MovieListItem }>) {
  const ids = props.movie.genre_ids
  if (!ids.length) {
    return <span className="text-muted-foreground">—</span>
  }
  return (
    <span
      className="text-muted-foreground"
      title="Nomes dos gêneros após integração com /genre/movie/list"
    >
      {ids.length} gênero{ids.length === 1 ? '' : 's'}
    </span>
  )
}

function ActionsPlaceholderCell() {
  return <span className="text-muted-foreground text-xs">—</span>
}

function TitleTableCell(props: Readonly<{ title: string }>) {
  return <span className="font-medium">{props.title}</span>
}

function buildColumns() {
  return [
    columnHelper.display({
      id: 'poster',
      header: 'Pôster',
      cell: ({ row }) => <PosterTableCell movie={row.original} />,
      enableSorting: false,
    }),
    columnHelper.accessor('title', {
      header: 'Título',
      cell: (info) => <TitleTableCell title={info.getValue()} />,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.display({
      id: 'genre',
      header: 'Gênero',
      cell: ({ row }) => <GenreTableCell movie={row.original} />,
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'year',
      header: 'Ano',
      cell: ({ row }) => releaseYear(row.original),
      sortingFn: (a, b) =>
        releaseYear(a.original).localeCompare(releaseYear(b.original)),
    }),
    columnHelper.accessor('vote_average', {
      header: 'Nota',
      cell: (info) => info.getValue().toFixed(1),
      sortingFn: 'basic',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: () => <ActionsPlaceholderCell />,
      enableSorting: false,
    }),
  ]
}

export function MoviesDiscoveryTable(props: Readonly<MoviesDiscoveryTableProps>) {
  const { movies, className } = props
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(() => buildColumns(), [])

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
        'overflow-x-auto rounded-lg ring-1 ring-border',
        className,
      )}
    >
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <caption className="sr-only">
          Tabela de filmes em descoberta: colunas pôster, título, gênero, ano,
          nota e ações. Use os cabeçalhos para ordenar quando disponível.
        </caption>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-muted/40">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  aria-sort={sortAriaSort(header)}
                  className="border-b border-border px-3 py-2 text-left font-medium"
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
              className="border-b border-border last:border-b-0 hover:bg-muted/30"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
