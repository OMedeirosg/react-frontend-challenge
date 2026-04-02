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

export function buildMoviesDiscoveryColumns(
  genreNameById: Map<number, string> | undefined,
  actions?: MoviesTableActions,
) {
  const yearColumn = columnHelper.accessor((row) => releaseYear(row), {
    id: 'year',
    header: 'Ano',
    cell: ({ row }) => releaseYear(row.original),
    sortingFn: 'alphanumeric',
    enableHiding: true,
  })

  return [
    columnHelper.display({
      id: 'poster',
      header: 'Pôster',
      cell: ({ row }) => <PosterTableCell movie={row.original} />,
      enableSorting: false,
      enableHiding: true,
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
      enableHiding: true,
    }),
    columnHelper.accessor((row) => genreSortValue(row, genreNameById), {
      id: 'genre',
      header: 'Gênero',
      cell: ({ row }) => (
        <GenreTableCell movie={row.original} genreNameById={genreNameById} />
      ),
      sortingFn: 'alphanumeric',
      enableHiding: true,
    }),
    yearColumn,
    columnHelper.accessor('vote_average', {
      header: 'Nota',
      cell: (info) => info.getValue().toFixed(1),
      sortingFn: 'basic',
      enableHiding: true,
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
      enableHiding: false,
    }),
  ]
}
