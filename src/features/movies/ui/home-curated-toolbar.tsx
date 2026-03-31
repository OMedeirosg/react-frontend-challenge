import { cn } from '@/lib/utils'
import type {
  HomeCuratedContextMode,
  HomeCuratedListMode,
} from '@/features/movies/model/use-home-curated-state'
import type { MovieGenre } from '@/features/movies/types'

import { HomeCuratedListToggle } from './home-curated-list-toggle'
import { MoviesFiltersPanel } from './movies-filters-panel'

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
    setGenreId: (value: number | null) => void
    setYear: (value: number | null) => void
    setMinVote: (value: number | null) => void
    resetFilters: () => void
  }
  genres?: MovieGenre[]
}

export function HomeCuratedToolbar(props: Readonly<HomeCuratedToolbarProps>) {
  const { className, ui, actions, genres } = props

  return (
    <section className={cn('space-y-2', className)} aria-label="Filtros da home">
      <HomeCuratedListToggle
        activeList={ui.activeList}
        onSelectList={actions.setActiveList}
      />
      <MoviesFiltersPanel
        ariaLabel="Filtros da home"
        idPrefix="home-curated"
        contextMode={ui.contextMode}
        searchRaw={ui.searchRaw}
        genreId={ui.genreId}
        year={ui.year}
        minVote={ui.minVote}
        genres={genres}
        onSelectSearchContext={() => actions.setContextMode('search')}
        onSelectFilterContext={() => actions.setContextMode('filters')}
        onSearchChange={actions.setSearchRaw}
        onGenreChange={actions.setGenreId}
        onYearChange={actions.setYear}
        onMinVoteChange={actions.setMinVote}
        onReset={actions.resetFilters}
      />
    </section>
  )
}

