import type { HomeCuratedListMode } from '@/features/movies/model/use-home-curated-state'

export type HomeCuratedContextMode = 'search' | 'filters'
import type { MovieGenre } from '@/features/movies/types'

export type HomeCuratedToolbarUi = {
  activeList: HomeCuratedListMode
  contextMode: HomeCuratedContextMode
  searchRaw: string
  genreId: number | null
  year: number | null
  minVote: number | null
}

export type HomeCuratedToolbarActions = {
  setActiveList: (mode: HomeCuratedListMode) => void
  setContextMode: (mode: HomeCuratedContextMode) => void
  setSearchRaw: (value: string) => void
  setGenreId: (value: number | null) => void
  setYear: (value: number | null) => void
  setMinVote: (value: number | null) => void
  resetFilters: () => void
}

export type HomeCuratedToolbarSharedProps = {
  ui: HomeCuratedToolbarUi
  actions: HomeCuratedToolbarActions
  genres?: MovieGenre[]
}
