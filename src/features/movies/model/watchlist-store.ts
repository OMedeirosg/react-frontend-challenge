import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { MovieListItem } from '@/features/movies/types'

type WatchlistState = {
  items: MovieListItem[]
  addMovie: (movie: MovieListItem) => void
  removeMovie: (movieId: number) => void
  toggleMovie: (movie: MovieListItem) => boolean
  hasMovie: (movieId: number) => boolean
}

function normalizeMovie(movie: MovieListItem): MovieListItem {
  return {
    ...movie,
    genre_ids: [...movie.genre_ids],
  }
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addMovie: (movie) => {
        const alreadyAdded = get().items.some((item) => item.id === movie.id)
        if (alreadyAdded) return
        set((state) => ({
          items: [...state.items, normalizeMovie(movie)],
        }))
      },
      removeMovie: (movieId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== movieId),
        }))
      },
      toggleMovie: (movie) => {
        const exists = get().items.some((item) => item.id === movie.id)
        if (exists) {
          get().removeMovie(movie.id)
          return false
        }
        get().addMovie(movie)
        return true
      },
      hasMovie: (movieId) => get().items.some((item) => item.id === movieId),
    }),
    {
      name: 'cinedash-watchlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
