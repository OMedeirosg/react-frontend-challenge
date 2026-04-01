import { act, renderHook } from '@testing-library/react'

import { useDiscoveryRouteState } from '@/features/movies/model/use-discovery-route-state'
import { useHomeCuratedState } from '@/features/movies/model/use-home-curated-state'
import { useWatchlistTableFilters } from '@/features/movies/model/use-watchlist-table-filters'
import type { DiscoverySearch } from '@/features/movies/model/discovery-search-schema'
import type { MovieListItem } from '@/features/movies/types'
import { useToastStore } from '@/shared/model/toast-store'

/** Alterar rascunho e chamar `applyFilters` em `act`s separados garante que o estado do rascunho já foi commitado antes do apply (React 18). */

const mockNavigate = vi.fn()
const mockUseDiscoveryMovies = vi.fn()

function renderDiscoveryRoute(initial: DiscoverySearch) {
  return renderHook(
    ({ search }) => useDiscoveryRouteState(search, mockNavigate),
    { initialProps: { search: initial } },
  )
}

vi.mock('@/features/movies/queries', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/movies/queries')>()
  return {
    ...actual,
    useDiscoveryMovies: (...args: unknown[]) => mockUseDiscoveryMovies(...args),
    useMovieGenres: () => ({
      data: { genres: [] },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    }),
  }
})

vi.mock('@/features/movies/model/use-discovery-feedback', () => ({
  useDiscoveryFeedback: () => ({ emptyMessage: null }),
}))

vi.mock('@/features/movies/model/use-watchlist-actions', () => ({
  useWatchlistActions: () => ({
    toggleFromMovie: vi.fn(),
    removeById: vi.fn(),
    isInWatchlist: vi.fn(() => false),
  }),
}))

function movie(partial: Partial<MovieListItem> & Pick<MovieListItem, 'id'>): MovieListItem {
  return {
    title: 'T',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    vote_average: 7,
    release_date: '2020-01-01',
    genre_ids: [28],
    ...partial,
  }
}

describe('useHomeCuratedState (filtros)', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [], showToast: vi.fn() })
  })

  it('inicia com rascunho igual ao aplicado e Aplicar desabilitado', () => {
    const { result } = renderHook(() => useHomeCuratedState())
    expect(result.current.isApplyDisabled).toBe(true)
    expect(result.current.ui.appliedGenreId).toBeNull()
  })

  it('habilita Aplicar ao alterar o rascunho e volta a desabilitar após aplicar', () => {
    const { result } = renderHook(() => useHomeCuratedState())

    act(() => {
      result.current.actions.setGenreId(28)
    })
    expect(result.current.isApplyDisabled).toBe(false)

    act(() => {
      result.current.actions.applyFilters()
    })
    expect(result.current.ui.appliedGenreId).toBe(28)
    expect(result.current.isApplyDisabled).toBe(true)
  })

  it('reset limpa rascunho e aplicado', () => {
    const { result } = renderHook(() => useHomeCuratedState())

    act(() => {
      result.current.actions.setGenreId(28)
      result.current.actions.applyFilters()
    })
    act(() => {
      result.current.actions.resetFilters()
    })

    expect(result.current.ui.appliedGenreId).toBeNull()
    expect(result.current.isApplyDisabled).toBe(true)
  })

  it('não aplica rascunho inválido e dispara toast de erro', () => {
    const showToast = vi.fn()
    useToastStore.setState({ showToast })

    const { result } = renderHook(() => useHomeCuratedState())

    act(() => {
      result.current.actions.setYear(1700)
    })
    act(() => {
      result.current.actions.applyFilters()
    })

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    )
    expect(result.current.ui.appliedYear).toBeNull()
  })
})

describe('useWatchlistTableFilters (filtros)', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [], showToast: vi.fn() })
  })

  const movies: MovieListItem[] = [
    movie({
      id: 1,
      title: 'Ação',
      genre_ids: [28],
      release_date: '2024-06-01',
      vote_average: 8,
    }),
    movie({
      id: 2,
      title: 'Drama',
      genre_ids: [18],
      release_date: '2023-03-15',
      vote_average: 6,
    }),
  ]

  it('sem filtros aplicados, retorna todos os filmes', () => {
    const { result } = renderHook(() => useWatchlistTableFilters(movies))
    expect(result.current.filteredMovies).toHaveLength(2)
    expect(result.current.isApplyDisabled).toBe(true)
  })

  it('aplica gênero na lista filtrada', () => {
    const { result } = renderHook(() => useWatchlistTableFilters(movies))

    act(() => {
      result.current.actions.setGenreId(28)
    })
    act(() => {
      result.current.actions.applyFilters()
    })

    expect(result.current.filteredMovies.map((m) => m.id)).toEqual([1])
    expect(result.current.isApplyDisabled).toBe(true)
  })

  it('aplica ano e nota mínima', () => {
    const { result } = renderHook(() => useWatchlistTableFilters(movies))

    act(() => {
      result.current.actions.setYear(2024)
      result.current.actions.setMinVote(7.5)
    })
    act(() => {
      result.current.actions.applyFilters()
    })

    expect(result.current.filteredMovies.map((m) => m.id)).toEqual([1])
  })

  it('reset volta lista completa e alinha rascunho com aplicado', () => {
    const { result } = renderHook(() => useWatchlistTableFilters(movies))

    act(() => {
      result.current.actions.setGenreId(28)
      result.current.actions.applyFilters()
    })
    act(() => {
      result.current.actions.resetFilters()
    })

    expect(result.current.filteredMovies).toHaveLength(2)
    expect(result.current.isApplyDisabled).toBe(true)
  })

  it('rascunho inválido não altera o aplicado', () => {
    const showToast = vi.fn()
    useToastStore.setState({ showToast })

    const { result } = renderHook(() => useWatchlistTableFilters(movies))

    act(() => {
      result.current.actions.setMinVote(11)
    })
    act(() => {
      result.current.actions.applyFilters()
    })

    expect(showToast).toHaveBeenCalled()
    expect(result.current.filteredMovies).toHaveLength(2)
  })
})

describe('useDiscoveryRouteState (filtros)', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    useToastStore.setState({ toasts: [], showToast: vi.fn() })
    mockUseDiscoveryMovies.mockReturnValue({
      data: { page: 1, results: [], total_pages: 0, total_results: 0 },
      error: null,
      isError: false,
      isFetching: false,
      isPending: false,
    })
  })

  it('desabilita Aplicar quando rascunho coincide com a URL e query não está em fetch', () => {
    const { result } = renderDiscoveryRoute({ genre: 28 })

    expect(result.current.params.genreId).toBe(28)
    expect(result.current.ui.genreId).toBe(28)
    expect(result.current.isApplyDisabled).toBe(true)
  })

  it('habilita Aplicar quando o rascunho difere dos parâmetros da URL', () => {
    const { result } = renderDiscoveryRoute({ genre: 28 })

    act(() => {
      result.current.actions.setGenreId(18)
    })

    expect(result.current.isApplyDisabled).toBe(false)
  })

  it('desabilita Aplicar enquanto a lista está em fetch', () => {
    mockUseDiscoveryMovies.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isFetching: true,
      isPending: true,
    })

    const { result } = renderDiscoveryRoute({})

    act(() => {
      result.current.actions.setGenreId(28)
    })

    expect(result.current.isApplyDisabled).toBe(true)
  })

  it('applyFilters chama navigate com gênero e zera página', () => {
    const { result } = renderDiscoveryRoute({ page: 3 })

    act(() => {
      result.current.actions.setGenreId(28)
    })
    act(() => {
      result.current.actions.applyFilters()
    })

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/discovery',
        search: expect.any(Function),
      }),
    )
    const updater = mockNavigate.mock.calls[0][0].search as (
      prev: DiscoverySearch,
    ) => DiscoverySearch
    const next = updater({ page: 3, q: 'x' })
    expect(next.genre).toBe(28)
    expect(next.page).toBe(1)
    expect(next.q).toBe('x')
  })

  it('rascunho inválido não navega e mostra toast', () => {
    const showToast = vi.fn()
    useToastStore.setState({ showToast })

    const { result } = renderDiscoveryRoute({})

    act(() => {
      result.current.actions.setYear(1700)
    })
    act(() => {
      result.current.actions.applyFilters()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    )
  })

  it('atualiza o rascunho de ano a cada mudança (inclui valores &lt; 1000 enquanto digita)', () => {
    const { result } = renderDiscoveryRoute({ year: 2020 })

    act(() => {
      result.current.actions.setYear(999)
    })

    expect(result.current.ui.year).toBe(999)
    expect(result.current.isApplyDisabled).toBe(false)
  })

  it('sincroniza rascunho quando a URL muda (rerender)', () => {
    const { result, rerender } = renderHook(
      ({ search }) => useDiscoveryRouteState(search, mockNavigate),
      { initialProps: { search: { genre: 28 } as DiscoverySearch } },
    )

    expect(result.current.ui.genreId).toBe(28)

    rerender({ search: { genre: 18 } })

    expect(result.current.ui.genreId).toBe(18)
    expect(result.current.isApplyDisabled).toBe(true)
  })
})
