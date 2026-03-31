import { cn } from '@/lib/utils'
import type {
  HomeCuratedContextMode,
  HomeCuratedListMode,
} from '@/features/movies/model/use-home-curated-state'
import type { MovieGenre } from '@/features/movies/types'

import { HomeCuratedContextToggle } from './home-curated-context-toggle'
import { HomeCuratedFiltersPanel } from './home-curated-filters-panel'
import { HomeCuratedListToggle } from './home-curated-list-toggle'
import { HomeCuratedSearchPanel } from './home-curated-search-panel'

export type HomeCuratedToolbarProps = {
  className?: string
  ui: {
    activeList: HomeCuratedListMode
    contextMode: HomeCuratedContextMode
    searchRaw: string
    genreId: number | null
    year: number | null
    minVote: number | null
  }
  actions: {
    setActiveList: (mode: HomeCuratedListMode) => void
    setContextMode: (mode: HomeCuratedContextMode) => void
    setSearchRaw: (value: string) => void
    clearSearch: () => void
    setGenreIdFromRaw: (value: string) => void
    setYearFromRaw: (value: string) => void
    setMinVoteFromRaw: (value: string) => void
    resetFilters: () => void
  }
  genres?: MovieGenre[]
}

export function HomeCuratedToolbar(props: Readonly<HomeCuratedToolbarProps>) {
  const { className, ui, actions, genres } = props

  return (
    <section className={cn('space-y-3', className)} aria-label="Filtros da home">
      <HomeCuratedListToggle ui={ui} actions={actions} />
      <HomeCuratedContextToggle ui={ui} actions={actions} />
      {ui.contextMode === 'search' ? (
        <HomeCuratedSearchPanel ui={ui} actions={actions} />
      ) : (
        <HomeCuratedFiltersPanel ui={ui} actions={actions} genres={genres} />
      )}
    </section>
  )
}

