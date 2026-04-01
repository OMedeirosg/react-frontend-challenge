import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { MovieGenre } from '@/features/movies/types'

import { MoviesFiltersPanel } from './movies-filters-panel'

export type HomeCuratedToolbarProps = {
  className?: string
  ui: {
    genreId: number | null
    year: number | null
    minVote: number | null
  }
  actions: {
    setGenreId: (value: number | null) => void
    setYear: (value: number | null) => void
    setMinVote: (value: number | null) => void
    resetFilters: () => void
    applyFilters: () => void
  }
  readonly isApplyDisabled?: boolean
  genres?: MovieGenre[]
}

export function HomeCuratedToolbar(props: Readonly<HomeCuratedToolbarProps>) {
  const { className, ui, actions, genres, isApplyDisabled = false } = props

  return (
    <section className={cn('space-y-2', className)} aria-label="Filtros da home">
      <MoviesFiltersPanel
        ariaLabel="Filtros da home"
        idPrefix="home-curated"
        filtersInline
        inlineTrailingSlot={
          <Button
            type="button"
            className="h-8"
            disabled={isApplyDisabled}
            onClick={actions.applyFilters}
          >
            Aplicar filtros
          </Button>
        }
        genreId={ui.genreId}
        year={ui.year}
        minVote={ui.minVote}
        genres={genres}
        onGenreChange={actions.setGenreId}
        onYearChange={actions.setYear}
        onMinVoteChange={actions.setMinVote}
        onReset={actions.resetFilters}
      />
    </section>
  )
}

