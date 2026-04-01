import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MoviesDiscoveryTable } from '@/features/movies/ui/movies-discovery-table'
import type { MovieListItem } from '@/features/movies/types'
import { usePageSizeStore } from '@/shared/model/page-size-store'

const movies: MovieListItem[] = [
  {
    id: 1,
    title: 'Beta',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 6.2,
    release_date: '2024-01-01',
    genre_ids: [2],
  },
  {
    id: 2,
    title: 'Alpha',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.5,
    release_date: '2023-01-01',
    genre_ids: [1],
  },
  {
    id: 3,
    title: 'Charlie',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 7.1,
    release_date: '2022-01-01',
    genre_ids: [3],
  },
]

const genres = [
  { id: 1, name: 'Ação' },
  { id: 2, name: 'Drama' },
  { id: 3, name: 'Comédia' },
]

function getColumnValues(columnIndex: number): string[] {
  const table = screen.getByRole('table')
  const rows = within(table).getAllByRole('row').slice(1)
  return rows.map((row) => {
    const cells = within(row).getAllByRole('cell')
    return cells[columnIndex]?.textContent?.trim() ?? ''
  })
}

describe('MoviesDiscoveryTable sorting', () => {
  it('shows footer with page size and total count', () => {
    render(<MoviesDiscoveryTable movies={movies} genres={genres} />)

    expect(
      screen.getByRole('button', { name: 'Colunas da tabela' }),
    ).toBeTruthy()
    expect(
      screen.getByText(/20 itens por página de 3 total/),
    ).toBeTruthy()
  })

  it('renders at most pageSize data rows when store uses a smaller page size', () => {
    usePageSizeStore.setState({ pageSize: 5 })
    const eight: MovieListItem[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: `Filme ${i + 1}`,
      overview: '',
      poster_path: null,
      backdrop_path: null,
      vote_average: 7,
      release_date: '2024-01-01',
      genre_ids: [1],
    }))

    render(<MoviesDiscoveryTable movies={eight} genres={genres} />)

    const table = screen.getByRole('table')
    const dataRows = within(table).getAllByRole('row').slice(1)
    expect(dataRows).toHaveLength(5)
  })

  it('orders title, genre and rating when clicking headers', async () => {
    const user = userEvent.setup()
    render(<MoviesDiscoveryTable movies={movies} genres={genres} />)

    await user.click(screen.getByRole('button', { name: 'Ordenar por Título' }))
    expect(getColumnValues(1)).toEqual(['Alpha', 'Beta', 'Charlie'])

    await user.click(screen.getByRole('button', { name: 'Ordenar por Gênero' }))
    expect(getColumnValues(2)).toEqual(['Ação', 'Comédia', 'Drama'])

    await user.click(screen.getByRole('button', { name: 'Ordenar por Nota' }))
    expect(getColumnValues(4)).toEqual(['8.5', '7.1', '6.2'])

    await user.click(screen.getByRole('button', { name: 'Ordenar por Nota' }))
    expect(getColumnValues(4)).toEqual(['6.2', '7.1', '8.5'])
  })
})
