import { useMemo } from 'react'

import type { MovieListItem, PaginatedMoviesResponse } from '../types'
import type { HomeCuratedListMode } from './use-home-curated-state'

type UseHomeCuratedFilteredMoviesParams = {
  ui: {
    activeList: HomeCuratedListMode
    searchDebounced: string
    genreId: number | null
    year: number | null
    minVote: number | null
  }
  trendingData?: PaginatedMoviesResponse
  popularData?: PaginatedMoviesResponse
}

export function useHomeCuratedFilteredMovies(
  params: Readonly<UseHomeCuratedFilteredMoviesParams>,
) {
  const { ui, trendingData, popularData } = params

  return useMemo(() => {
    const sourceList =
      ui.activeList === 'trending'
        ? (trendingData?.results ?? [])
        : (popularData?.results ?? [])

    const filteredMovies = sourceList.filter((movie: MovieListItem) => {
      if (ui.searchDebounced.trim()) {
        const query = ui.searchDebounced.trim().toLowerCase()
        if (!movie.title.toLowerCase().includes(query)) return false
      }
      if (ui.genreId != null && !movie.genre_ids.includes(ui.genreId)) return false
      if (ui.year != null && Number(movie.release_date?.slice(0, 4) || 0) !== ui.year) {
        return false
      }
      if (ui.minVote != null && movie.vote_average < ui.minVote) return false
      return true
    })

    const sourceCount = sourceList.length
    const emptyMessage =
      sourceCount > 0
        ? 'Nenhum filme da lista atual corresponde aos filtros. Tente ampliar os critérios.'
        : 'Nenhum filme disponível nesta página da lista selecionada.'

    return { filteredMovies, emptyMessage }
  }, [
    ui.activeList,
    ui.genreId,
    ui.minVote,
    ui.searchDebounced,
    ui.year,
    trendingData?.results,
    popularData?.results,
  ])
}

