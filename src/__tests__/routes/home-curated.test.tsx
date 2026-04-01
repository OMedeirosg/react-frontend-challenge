import { cleanup, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useAuthStore } from '@/features/auth/store'
import * as movieQueries from '@/features/movies/queries'
import { renderWithApp, resetAuthStore } from '@/test/test-utils'

vi.mock('@/features/movies/queries', async () => {
  const actual = await vi.importActual<typeof import('@/features/movies/queries')>(
    '@/features/movies/queries',
  )
  return {
    ...actual,
    useMovieGenres: vi.fn(),
    useTrendingMovies: vi.fn(),
    usePopularMovies: vi.fn(),
  }
})

const mockedUseMovieGenres = vi.mocked(movieQueries.useMovieGenres)
const mockedUseTrendingMovies = vi.mocked(movieQueries.useTrendingMovies)
const mockedUsePopularMovies = vi.mocked(movieQueries.usePopularMovies)

function setAuthenticatedUser() {
  useAuthStore.setState({
    accounts: {},
    token: 'fake-token',
    currentUserEmail: 'user@test.com',
  })
}

describe('Home curated flow', () => {
  beforeEach(() => {
    cleanup()
    resetAuthStore()
    setAuthenticatedUser()

    mockedUseMovieGenres.mockReturnValue({
      data: { genres: [{ id: 28, name: 'Ação' }, { id: 18, name: 'Drama' }] },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as ReturnType<typeof movieQueries.useMovieGenres>)

    mockedUseTrendingMovies.mockReturnValue({
      data: {
        page: 1,
        total_pages: 10,
        total_results: 2,
        results: [
          {
            id: 1,
            title: 'Duna: Parte Dois',
            overview: '',
            poster_path: null,
            backdrop_path: null,
            vote_average: 8.4,
            release_date: '2024-03-01',
            genre_ids: [28],
          },
          {
            id: 2,
            title: 'Filme Drama',
            overview: '',
            poster_path: null,
            backdrop_path: null,
            vote_average: 7,
            release_date: '2023-01-10',
            genre_ids: [18],
          },
        ],
      },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as ReturnType<typeof movieQueries.useTrendingMovies>)

    mockedUsePopularMovies.mockReturnValue({
      data: {
        page: 1,
        total_pages: 12,
        total_results: 2,
        results: [
          {
            id: 10,
            title: 'Popular Hit',
            overview: '',
            poster_path: null,
            backdrop_path: null,
            vote_average: 8.1,
            release_date: '2022-06-20',
            genre_ids: [28],
          },
          {
            id: 11,
            title: 'Outro Popular',
            overview: '',
            poster_path: null,
            backdrop_path: null,
            vote_average: 6.5,
            release_date: '2020-02-11',
            genre_ids: [18],
          },
        ],
      },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as ReturnType<typeof movieQueries.usePopularMovies>)
  })

  it('alterna entre Trending e Popular', async () => {
    const user = userEvent.setup()
    renderWithApp('/')

    expect(await screen.findByText('Duna: Parte Dois')).toBeTruthy()

    await user.click(screen.getAllByRole('tab', { name: 'Popular' })[0])

    await waitFor(() => {
      expect(screen.getByText('Popular Hit')).toBeTruthy()
    })
  })

  it('aplica filtros na lista ativa', async () => {
    const user = userEvent.setup()
    renderWithApp('/')

    await user.selectOptions(await screen.findByLabelText('Gênero'), '28')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    await waitFor(() => {
      expect(screen.getByText('Duna: Parte Dois')).toBeTruthy()
    })
    await waitFor(() => {
      expect(screen.queryByText('Filme Drama')).toBeNull()
    })
  })
})

