import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useAuthStore } from '@/features/auth/store'
import { useWatchlistStore } from '@/features/movies/model/watchlist-store'
import type { MovieDetails } from '@/features/movies/types'
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
    useMovieDetails: vi.fn(),
    useMovieCredits: vi.fn(),
    useMovieVideos: vi.fn(),
    useMovieSimilar: vi.fn(),
  }
})

const mockedUseMovieDetails = vi.mocked(movieQueries.useMovieDetails)
const mockedUseMovieCredits = vi.mocked(movieQueries.useMovieCredits)
const mockedUseMovieVideos = vi.mocked(movieQueries.useMovieVideos)
const mockedUseMovieSimilar = vi.mocked(movieQueries.useMovieSimilar)

const movieId = 999

const movieDetails: MovieDetails = {
  id: movieId,
  title: 'Filme de Teste',
  overview: 'Sinopse de teste.',
  poster_path: null,
  backdrop_path: null,
  vote_average: 7.5,
  release_date: '2024-06-15',
  genres: [
    { id: 28, name: 'Ação' },
    { id: 12, name: 'Aventura' },
  ],
}

function setAuthenticatedUser() {
  useAuthStore.setState({
    accounts: {},
    token: 'fake-token',
    currentUserEmail: 'user@test.com',
  })
}

function mockDetailQueriesSuccess() {
  mockedUseMovieDetails.mockReturnValue({
    data: movieDetails,
    error: null,
    isError: false,
    isFetching: false,
    isPending: false,
  } as unknown as ReturnType<typeof movieQueries.useMovieDetails>)

  mockedUseMovieCredits.mockReturnValue({
    data: {
      cast: [
        { id: 1, name: 'Ator Um', character: 'Personagem', profile_path: null },
      ],
    },
    error: null,
    isError: false,
    isFetching: false,
    isPending: false,
  } as unknown as ReturnType<typeof movieQueries.useMovieCredits>)

  mockedUseMovieVideos.mockReturnValue({
    data: { results: [] },
    error: null,
    isError: false,
    isFetching: false,
    isPending: false,
  } as unknown as ReturnType<typeof movieQueries.useMovieVideos>)

  mockedUseMovieSimilar.mockReturnValue({
    data: {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    },
    error: null,
    isError: false,
    isFetching: false,
    isPending: false,
  } as unknown as ReturnType<typeof movieQueries.useMovieSimilar>)
}

describe('Movie details page — watchlist button', () => {
  beforeEach(() => {
    resetAuthStore()
    resetWatchlistStore()
    setAuthenticatedUser()
    mockDetailQueriesSuccess()
  })

  it('adds and removes movie from watchlist via primary button on /movie/:id', async () => {
    const user = userEvent.setup()
    renderWithApp(`/movie/${movieId}`)

    expect(await screen.findByRole('heading', { name: movieDetails.title })).toBeTruthy()

    const addButton = await screen.findByRole('button', {
      name: 'Adicionar à watchlist',
    })
    await user.click(addButton)

    await waitFor(() => {
      expect(useWatchlistStore.getState().hasMovie(movieId)).toBe(true)
    })

    const removeButton = screen.getByRole('button', {
      name: 'Remover da watchlist',
    })
    await user.click(removeButton)

    await waitFor(() => {
      expect(useWatchlistStore.getState().hasMovie(movieId)).toBe(false)
    })
  })
})
