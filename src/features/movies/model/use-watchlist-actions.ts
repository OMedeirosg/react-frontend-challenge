import { useCallback, useMemo } from 'react'

import type { MovieListItem } from '@/features/movies/types'
import { useToastStore } from '@/shared/model/toast-store'

import { useWatchlistStore } from './watchlist-store'

export function useWatchlistActions() {
  const toggleMovie = useWatchlistStore((state) => state.toggleMovie)
  const removeMovie = useWatchlistStore((state) => state.removeMovie)
  const watchlistItems = useWatchlistStore((state) => state.items)
  const showToast = useToastStore((state) => state.showToast)

  const watchlistIds = useMemo(
    () => new Set(watchlistItems.map((item) => item.id)),
    [watchlistItems],
  )

  const isInWatchlist = useCallback(
    (movieId: number) => watchlistIds.has(movieId),
    [watchlistIds],
  )

  const toggleFromMovie = useCallback(
    (movie: MovieListItem) => {
      try {
        const added = toggleMovie(movie)
        showToast({
          variant: 'success',
          message: added
            ? 'Filme adicionado à Watchlist.'
            : 'Filme removido da Watchlist.',
        })
      } catch {
        showToast({
          variant: 'error',
          message: 'Não foi possível atualizar a Watchlist. Tente novamente.',
        })
      }
    },
    [showToast, toggleMovie],
  )

  const removeById = useCallback(
    (movieId: number) => {
      try {
        removeMovie(movieId)
        showToast({
          variant: 'success',
          message: 'Filme removido da Watchlist.',
        })
      } catch {
        showToast({
          variant: 'error',
          message: 'Não foi possível atualizar a Watchlist. Tente novamente.',
        })
      }
    },
    [removeMovie, showToast],
  )

  return {
    isInWatchlist,
    toggleFromMovie,
    removeById,
  }
}
