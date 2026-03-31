import type {
  HomeCuratedContextMode,
  HomeCuratedListMode,
} from '@/features/movies/model/use-home-curated-state'
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
  clearSearch: () => void
  setGenreIdFromRaw: (value: string) => void
  setYearFromRaw: (value: string) => void
  setMinVoteFromRaw: (value: string) => void
  resetFilters: () => void
}

export type HomeCuratedToolbarSharedProps = {
  ui: HomeCuratedToolbarUi
  actions: HomeCuratedToolbarActions
  genres?: MovieGenre[]
}
