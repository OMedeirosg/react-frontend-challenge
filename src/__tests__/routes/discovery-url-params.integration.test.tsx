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
    useDiscoveryMovies: vi.fn(),
  }
})

const mockedUseMovieGenres = vi.mocked(movieQueries.useMovieGenres)
const mockedUseDiscoveryMovies = vi.mocked(movieQueries.useDiscoveryMovies)

function setAuthenticatedUser() {
  useAuthStore.setState({
    accounts: {},
    token: 'fake-token',
    currentUserEmail: 'user@test.com',
  })
}

describe('Discovery URL params integration', () => {
  beforeEach(() => {
    cleanup()
    resetAuthStore()
    setAuthenticatedUser()
    mockedUseMovieGenres.mockReturnValue({
      data: { genres: [{ id: 28, name: 'Ação' }] },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as ReturnType<typeof movieQueries.useMovieGenres>)
    mockedUseDiscoveryMovies.mockReturnValue({
      data: {
        page: 1,
        total_pages: 20,
        total_results: 1,
        results: [
          {
            id: 1,
            title: 'Batman Begins',
            overview: '',
            poster_path: null,
            backdrop_path: null,
            vote_average: 7.8,
            release_date: '2005-06-15',
            genre_ids: [28],
          },
        ],
      },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as ReturnType<typeof movieQueries.useDiscoveryMovies>)
  })

  it('hidrata Discovery via deep-link com q e filtros na URL', async () => {
    renderWithApp('/discovery?q=batman&genre=28&year=2022&minVote=7&page=2')

    await waitFor(() => {
      expect(mockedUseDiscoveryMovies).toHaveBeenCalled()
    })

    const lastCall =
      mockedUseDiscoveryMovies.mock.calls[mockedUseDiscoveryMovies.mock.calls.length - 1]?.[0]
    expect(lastCall).toMatchObject({
      query: 'batman',
      genreId: 28,
      year: 2022,
      minVote: 7,
      page: 2,
    })

    expect(screen.queryByLabelText('Busca', { selector: '#discovery-search' })).toBeNull()
    expect((screen.getByLabelText('Gênero') as HTMLSelectElement).value).toBe('28')
    expect((screen.getByLabelText('Ano') as HTMLInputElement).value).toBe('2022')
    expect((screen.getByLabelText('Nota mínima') as HTMLInputElement).value).toBe('7')
  })

  it('aplica filtros na URL ao confirmar e suporta back/forward', async () => {
    const { router } = renderWithApp('/discovery')
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByLabelText('Gênero')).toBeTruthy()
    })

    await user.selectOptions(screen.getByLabelText('Gênero'), '28')
    expect((router.state.location.search as { genre?: number }).genre).toBeUndefined()

    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    await waitFor(() => {
      expect((router.state.location.search as { genre?: number }).genre).toBe(28)
    })

    router.history.back()

    await waitFor(() => {
      expect((router.state.location.search as { genre?: number }).genre).toBeUndefined()
    })

    router.history.forward()

    await waitFor(() => {
      expect((router.state.location.search as { genre?: number }).genre).toBe(28)
    })
  })

  it('preenche URL com q preservada ao aplicar filtros', async () => {
    const { router } = renderWithApp('/discovery?q=batman')
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByLabelText('Gênero')).toBeTruthy()
    })

    await user.selectOptions(screen.getByLabelText('Gênero'), '28')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))

    await waitFor(() => {
      const s = router.state.location.search as {
        q?: string
        genre?: number
        page?: number
      }
      expect(s.q).toBe('batman')
      expect(s.genre).toBe(28)
      expect(s.page).toBeUndefined()
    })
  })

  it('reidrata estado após refresh com a mesma URL', async () => {
    const url = '/discovery?q=duna&genre=28&year=2021&minVote=7.5&page=3'

    const first = renderWithApp(url)
    await waitFor(() => {
      expect(screen.getByLabelText('Ano')).toBeTruthy()
    })
    first.unmount()

    renderWithApp(url)

    await waitFor(() => {
      const lastCall =
        mockedUseDiscoveryMovies.mock.calls[mockedUseDiscoveryMovies.mock.calls.length - 1]?.[0]
      expect(lastCall).toMatchObject({
        query: 'duna',
        genreId: 28,
        year: 2021,
        minVote: 7.5,
        page: 3,
      })
    })
  })
})
