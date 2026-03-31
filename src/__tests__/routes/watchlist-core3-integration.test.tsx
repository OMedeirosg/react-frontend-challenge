import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useAuthStore } from '@/features/auth/store'
import { useWatchlistStore } from '@/features/movies/model/watchlist-store'
import type { MovieListItem } from '@/features/movies/types'
import * as movieQueries from '@/features/movies/queries'
import {
  renderWithApp,
  resetAuthStore,
  resetWatchlistStore,
} from '@/test/test-utils'

vi.mock('@/features/movies/queries', async () => {
  const actual = await vi.importActual<typeof import('@/features/movies/queries')>(
    '@/features/movies/queries',
  )
  return {
    ...actual,
    useMovieGenres: vi.fn(),
    useDiscoveryMovies: vi.fn(),
  }
})

const mockedUseMovieGenres = vi.mocked(movieQueries.useMovieGenres)
const mockedUseDiscoveryMovies = vi.mocked(movieQueries.useDiscoveryMovies)

const movie: MovieListItem = {
  id: 101,
  title: 'Duna: Parte Dois',
  overview: '...',
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.4,
  release_date: '2024-03-01',
  genre_ids: [28],
}

function setAuthenticatedUser() {
  useAuthStore.setState({
    accounts: {},
    token: 'fake-token',
    currentUserEmail: 'user@test.com',
  })
}

describe('Core 3 watchlist integration', () => {
  beforeEach(() => {
    resetAuthStore()
    resetWatchlistStore()
    localStorage.removeItem('cinedash-watchlist')
    setAuthenticatedUser()

    mockedUseMovieGenres.mockReturnValue({
      data: { genres: [{ id: 28, name: 'Ação' }] },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as unknown as ReturnType<typeof movieQueries.useMovieGenres>)
  })

  it('adds and removes a movie from watchlist through discovery UI actions', async () => {
    mockedUseDiscoveryMovies.mockReturnValue({
      data: {
        page: 1,
        results: [movie],
        total_pages: 1,
        total_results: 1,
      },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as unknown as ReturnType<typeof movieQueries.useDiscoveryMovies>)

    const user = userEvent.setup()
    renderWithApp('/discovery')

    expect(await screen.findByText(movie.title)).toBeTruthy()

    await user.click(
      screen.getByRole('button', { name: `Abrir ações de ${movie.title}` }),
    )
    await user.click(await screen.findByRole('menuitem', { name: /adicionar/i }))

    await waitFor(() => {
      expect(useWatchlistStore.getState().hasMovie(movie.id)).toBe(true)
    })

    await user.click(
      screen.getByRole('button', { name: `Abrir ações de ${movie.title}` }),
    )
    await user.click(await screen.findByRole('menuitem', { name: /remover/i }))

    await waitFor(() => {
      expect(useWatchlistStore.getState().hasMovie(movie.id)).toBe(false)
    })
  })

  it('restores watchlist from persisted storage after rehydrate (refresh simulation)', async () => {
    localStorage.setItem(
      'cinedash-watchlist',
      JSON.stringify({
        state: { items: [movie] },
        version: 0,
      }),
    )
    await useWatchlistStore.persist.rehydrate()

    renderWithApp('/watchlist')

    const table = await screen.findByRole('table')
    expect(within(table).getByText(movie.title)).toBeTruthy()
    expect(within(table).getByText('Ação')).toBeTruthy()
  })
})
