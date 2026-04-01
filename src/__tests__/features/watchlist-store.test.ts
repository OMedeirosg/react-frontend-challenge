import type { MovieListItem } from '@/features/movies/types'
import { useAuthStore } from '@/features/auth/store'
import {
  getWatchlistStorageKeyForUser,
  useWatchlistStore,
} from '@/features/movies/model/watchlist-store'
import { resetAuthStore, resetWatchlistStore } from '@/test/test-utils'

const movieA: MovieListItem = {
  id: 1,
  title: 'Duna: Parte Dois',
  overview: '...',
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.4,
  release_date: '2024-03-01',
  genre_ids: [28],
}

const movieB: MovieListItem = {
  id: 2,
  title: 'Outro Filme',
  overview: '...',
  poster_path: null,
  backdrop_path: null,
  vote_average: 7.2,
  release_date: '2023-02-10',
  genre_ids: [18],
}

function loginAs(email: string) {
  useAuthStore.setState({
    token: 'fake-token',
    currentUserEmail: email,
  })
}

describe('watchlist-store', () => {
  beforeEach(() => {
    resetAuthStore()
    resetWatchlistStore()
    loginAs('watchlist@test.com')
  })

  it('adiciona item sem duplicar', () => {
    useWatchlistStore.getState().addMovie(movieA)
    useWatchlistStore.getState().addMovie(movieA)

    expect(useWatchlistStore.getState().items).toHaveLength(1)
    expect(useWatchlistStore.getState().items[0]?.id).toBe(movieA.id)
  })

  it('remove item existente', () => {
    useWatchlistStore.getState().addMovie(movieA)
    useWatchlistStore.getState().addMovie(movieB)

    useWatchlistStore.getState().removeMovie(movieA.id)

    expect(useWatchlistStore.getState().items).toHaveLength(1)
    expect(useWatchlistStore.getState().items[0]?.id).toBe(movieB.id)
  })

  it('toggleMovie alterna estado', () => {
    const firstToggle = useWatchlistStore.getState().toggleMovie(movieA)
    const secondToggle = useWatchlistStore.getState().toggleMovie(movieA)

    expect(firstToggle).toBe(true)
    expect(secondToggle).toBe(false)
    expect(useWatchlistStore.getState().items).toHaveLength(0)
  })

  it('hasMovie reflete estado atual', () => {
    expect(useWatchlistStore.getState().hasMovie(movieA.id)).toBe(false)
    useWatchlistStore.getState().addMovie(movieA)
    expect(useWatchlistStore.getState().hasMovie(movieA.id)).toBe(true)
  })

  it('mantém listas distintas por utilizador (mesmo browser)', async () => {
    useWatchlistStore.getState().addMovie(movieA)
    expect(useWatchlistStore.getState().items).toHaveLength(1)

    loginAs('other@test.com')
    await useWatchlistStore.persist.rehydrate()

    expect(useWatchlistStore.getState().items).toHaveLength(0)
    useWatchlistStore.getState().addMovie(movieB)
    expect(useWatchlistStore.getState().items.map((m) => m.id)).toEqual([movieB.id])

    loginAs('watchlist@test.com')
    await useWatchlistStore.persist.rehydrate()

    expect(useWatchlistStore.getState().items.map((m) => m.id)).toEqual([movieA.id])
  })

  it('esvazia itens ao logout (sem flash da lista anterior)', async () => {
    useWatchlistStore.getState().addMovie(movieA)
    expect(useWatchlistStore.getState().items).toHaveLength(1)

    useAuthStore.getState().logout()
    await useWatchlistStore.persist.rehydrate()

    expect(useAuthStore.getState().currentUserEmail).toBeNull()
    expect(useWatchlistStore.getState().items).toHaveLength(0)
  })

  it('migra chave legada cinedash-watchlist para o utilizador atual', async () => {
    const key = getWatchlistStorageKeyForUser('watchlist@test.com')
    localStorage.setItem(
      'cinedash-watchlist',
      JSON.stringify({
        state: { items: [movieA] },
        version: 0,
      }),
    )
    expect(localStorage.getItem(key)).toBeNull()

    await useWatchlistStore.persist.rehydrate()

    expect(localStorage.getItem('cinedash-watchlist')).toBeNull()
    expect(localStorage.getItem(key)).toBeTruthy()
    expect(useWatchlistStore.getState().items).toHaveLength(1)
    expect(useWatchlistStore.getState().items[0]?.id).toBe(movieA.id)
  })
})
