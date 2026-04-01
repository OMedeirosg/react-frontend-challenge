import { act, renderHook } from '@testing-library/react'

import { useAuthStore } from '@/features/auth/store'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import { useWatchlistStore } from '@/features/movies/model/watchlist-store'
import { useToastStore } from '@/shared/model/toast-store'
import type { MovieListItem } from '@/features/movies/types'
import { resetAuthStore, resetWatchlistStore } from '@/test/test-utils'

const movie: MovieListItem = {
  id: 99,
  title: 'Interstellar',
  overview: '...',
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.7,
  release_date: '2014-11-07',
  genre_ids: [12],
}

describe('use-watchlist-actions', () => {
  beforeEach(() => {
    resetAuthStore()
    resetWatchlistStore()
    useAuthStore.setState({ token: 't', currentUserEmail: 'actions@test.com' })
    useToastStore.setState({ toasts: [] })
  })

  it('dispara toast de sucesso ao adicionar/remover', () => {
    const showToastSpy = vi.fn()
    useToastStore.setState({ showToast: showToastSpy })
    const { result } = renderHook(() => useWatchlistActions())

    act(() => {
      result.current.toggleFromMovie(movie)
    })
    expect(showToastSpy).toHaveBeenLastCalledWith({
      variant: 'success',
      message: 'Filme adicionado à Watchlist.',
    })
    expect(result.current.isInWatchlist(movie.id)).toBe(true)

    act(() => {
      result.current.toggleFromMovie(movie)
    })
    expect(showToastSpy).toHaveBeenLastCalledWith({
      variant: 'success',
      message: 'Filme removido da Watchlist.',
    })
    expect(result.current.isInWatchlist(movie.id)).toBe(false)
  })

  it('removeById remove item e mostra sucesso', () => {
    const showToastSpy = vi.fn()
    useToastStore.setState({ showToast: showToastSpy })
    useWatchlistStore.getState().addMovie(movie)
    const { result } = renderHook(() => useWatchlistActions())

    act(() => {
      result.current.removeById(movie.id)
    })

    expect(result.current.isInWatchlist(movie.id)).toBe(false)
    expect(showToastSpy).toHaveBeenCalledWith({
      variant: 'success',
      message: 'Filme removido da Watchlist.',
    })
  })
})
