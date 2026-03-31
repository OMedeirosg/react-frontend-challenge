import type { MovieListItem } from '@/features/movies/types'
import { useWatchlistStore } from '@/features/movies/model/watchlist-store'

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

describe('watchlist-store', () => {
  beforeEach(() => {
    useWatchlistStore.persist.clearStorage()
    useWatchlistStore.setState({ items: [] })
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
})
