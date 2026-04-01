import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

import { useAuthStore } from '@/features/auth/store'
import { normalizeAuthEmail } from '@/features/auth/model/normalize-email'
import type { MovieListItem } from '@/features/movies/types'

export const WATCHLIST_PERSIST_NAME = 'cinedash-watchlist'

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

/** Chave `localStorage` para o utilizador atual (persist Zustand JSON). */
export function getWatchlistStorageKeyForUser(email: string): string {
  return `${WATCHLIST_PERSIST_NAME}:${normalizeAuthEmail(email)}`
}

/** Remove todas as entradas legadas e por utilizador (útil em testes e reset). */
export function clearAllWatchlistStorageKeys(storage: Storage = localStorage) {
  const keys: string[] = []
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i)
    if (!k) continue
    if (k === WATCHLIST_PERSIST_NAME || k.startsWith(`${WATCHLIST_PERSIST_NAME}:`)) {
      keys.push(k)
    }
  }
  for (const k of keys) {
    storage.removeItem(k)
  }
}

function createUserScopedStorage(): StateStorage {
  return {
    getItem: (name) => {
      const user = useAuthStore.getState().currentUserEmail
      if (!user) return null
      const scopedKey = `${name}:${normalizeAuthEmail(user)}`
      let raw = localStorage.getItem(scopedKey)
      if (raw === null) {
        const legacy = localStorage.getItem(name)
        if (legacy) {
          localStorage.setItem(scopedKey, legacy)
          localStorage.removeItem(name)
          raw = legacy
        }
      }
      return raw
    },
    setItem: (name, value) => {
      const user = useAuthStore.getState().currentUserEmail
      if (!user) return
      localStorage.setItem(`${name}:${normalizeAuthEmail(user)}`, value)
    },
    removeItem: (name) => {
      const user = useAuthStore.getState().currentUserEmail
      if (!user) return
      localStorage.removeItem(`${name}:${normalizeAuthEmail(user)}`)
    },
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
      name: WATCHLIST_PERSIST_NAME,
      storage: createJSONStorage(() => createUserScopedStorage()),
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState): WatchlistState => {
        if (
          persistedState != null &&
          typeof persistedState === 'object' &&
          'items' in persistedState
        ) {
          const p = persistedState as { items: MovieListItem[] }
          return { ...currentState, items: p.items }
        }
        return { ...currentState, items: [] }
      },
    },
  ),
)

let previousUserEmail = useAuthStore.getState().currentUserEmail
useAuthStore.subscribe((state) => {
  const email = state.currentUserEmail
  if (email === previousUserEmail) return
  previousUserEmail = email
  if (!email) {
    useWatchlistStore.setState({ items: [] })
  }
  void useWatchlistStore.persist.rehydrate()
})
