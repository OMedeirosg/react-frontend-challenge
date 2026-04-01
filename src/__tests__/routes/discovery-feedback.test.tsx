import { screen, waitFor } from '@testing-library/react'
import { z } from 'zod'

import { useAuthStore } from '@/features/auth/store'
import { TmdbContractError } from '@/features/movies/types'
import { ApiError } from '@/lib/api'
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

describe('Discovery feedback states', () => {
  beforeEach(() => {
    resetAuthStore()
    setAuthenticatedUser()
    mockedUseMovieGenres.mockReturnValue({
      data: { genres: [] },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as unknown as ReturnType<typeof movieQueries.useMovieGenres>)
  })

  it('exibe mensagem orientativa quando não há resultados', async () => {
    mockedUseDiscoveryMovies.mockReturnValue({
      data: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    } as unknown as ReturnType<typeof movieQueries.useDiscoveryMovies>)

    renderWithApp('/discovery')

    await waitFor(() => {
      expect(
        screen.getByText(
          'Ainda não achamos o que você procura. Tente ajustar os filtros para ampliar os resultados.',
        ),
      ).toBeTruthy()
    })
  })

  it('exibe toast de erro quando a busca falha', async () => {
    mockedUseDiscoveryMovies.mockReturnValue({
      data: undefined,
      error: new ApiError(500, null),
      isError: true,
      isFetching: false,
      isPending: false,
    } as unknown as ReturnType<typeof movieQueries.useDiscoveryMovies>)

    renderWithApp('/discovery')

    await waitFor(() => {
      expect(
        screen.getAllByText('Falha ao buscar filmes (erro 500).').length,
      ).toBeGreaterThan(0)
    })
  })

  it('exibe toast específico para falha de contrato TMDB', async () => {
    const zod = z.string().safeParse(1)
    if (zod.success) throw new Error('expected zod failure')
    mockedUseDiscoveryMovies.mockReturnValue({
      data: undefined,
      error: new TmdbContractError('GET /search/movie', 'response', zod.error),
      isError: true,
      isFetching: false,
      isPending: false,
    } as unknown as ReturnType<typeof movieQueries.useDiscoveryMovies>)

    renderWithApp('/discovery')

    await waitFor(() => {
      expect(
        screen.getAllByText(
          'Não foi possível validar os dados recebidos da API. Tente novamente mais tarde.',
        ).length,
      ).toBeGreaterThan(0)
    })
  })
})

