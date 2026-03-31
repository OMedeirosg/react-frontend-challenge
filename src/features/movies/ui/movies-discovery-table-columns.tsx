import { createColumnHelper } from '@tanstack/react-table'

import { genreSortValue } from '@/features/movies/lib/movie-sorters'
import { releaseYear } from '@/features/movies/lib/release-year'
import type { MovieListItem } from '@/features/movies/types'

import {
  GenreTableCell,
  PosterTableCell,
  TitleTableCell,
} from './movies-discovery-table-cells'
import { MovieRowActionsMenu } from './movie-row-actions-menu'

const columnHelper = createColumnHelper<MovieListItem>()

export type MoviesTableActions = {
  onToggleWatchlist: (movie: MovieListItem) => void
  onOpenDetails: (movie: MovieListItem) => void
  isInWatchlist: (movieId: number) => boolean
}

type MoviesTableViewMode = 'catalog' | 'watchlist'

type BuildMoviesDiscoveryColumnsOptions = {
  viewMode?: MoviesTableViewMode
}

function releaseDateLabel(rawDate: string): string {
  const [year, month, day] = rawDate.split('-')
  if (!year || !month || !day) return '—'
  return `${day}/${month}/${year}`
}

export function buildMoviesDiscoveryColumns(
  genreNameById: Map<number, string> | undefined,
  actions?: MoviesTableActions,
  options?: BuildMoviesDiscoveryColumnsOptions,
) {
  const viewMode = options?.viewMode ?? 'catalog'
  const dateColumn =
    viewMode === 'watchlist'
      ? columnHelper.accessor('release_date', {
          id: 'releaseDate',
          header: 'Data de Lançamento',
          cell: (info) => releaseDateLabel(info.getValue()),
          enableSorting: false,
        })
      : columnHelper.accessor((row) => releaseYear(row), {
          id: 'year',
          header: 'Ano',
          cell: ({ row }) => releaseYear(row.original),
          sortingFn: 'alphanumeric',
        })

  return [
    columnHelper.display({
      id: 'poster',
      header: 'Pôster',
      cell: ({ row }) => <PosterTableCell movie={row.original} />,
      enableSorting: false,
    }),
    columnHelper.accessor('title', {
      header: 'Título',
      cell: ({ row }) => (
        <TitleTableCell
          title={row.original.title}
          isInWatchlist={actions?.isInWatchlist(row.original.id)}
        />
      ),
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor((row) => genreSortValue(row, genreNameById), {
      id: 'genre',
      header: 'Gênero',
      cell: ({ row }) => (
        <GenreTableCell movie={row.original} genreNameById={genreNameById} />
      ),
      sortingFn: 'alphanumeric',
    }),
    dateColumn,
    columnHelper.accessor('vote_average', {
      header: 'Nota',
      cell: (info) => info.getValue().toFixed(1),
      sortingFn: 'basic',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        if (!actions) return null

        const movie = row.original

        return (
          <MovieRowActionsMenu
            movie={movie}
            onToggleWatchlist={actions.onToggleWatchlist}
            onOpenDetails={actions.onOpenDetails}
            isInWatchlist={actions.isInWatchlist}
          />
        )
      },
      enableSorting: false,
    }),
  ]
}
