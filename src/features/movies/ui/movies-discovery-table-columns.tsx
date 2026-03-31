import { createColumnHelper } from '@tanstack/react-table'

import { genreSortValue } from '@/features/movies/lib/movie-sorters'
import { releaseYear } from '@/features/movies/lib/release-year'
import type { MovieListItem } from '@/features/movies/types'

import {
  GenreTableCell,
  PosterTableCell,
  TitleTableCell,
} from './movies-discovery-table-cells'

const columnHelper = createColumnHelper<MovieListItem>()

export function buildMoviesDiscoveryColumns(genreNameById?: Map<number, string>) {
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
    columnHelper.accessor((row) => genreSortValue(row, genreNameById), {
      id: 'genre',
      header: 'Gênero',
      cell: ({ row }) => (
        <GenreTableCell movie={row.original} genreNameById={genreNameById} />
      ),
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor((row) => releaseYear(row), {
      id: 'year',
      header: 'Ano',
      cell: ({ row }) => releaseYear(row.original),
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('vote_average', {
      header: 'Nota',
      cell: (info) => info.getValue().toFixed(1),
      sortingFn: 'basic',
    }),
  ]
}
