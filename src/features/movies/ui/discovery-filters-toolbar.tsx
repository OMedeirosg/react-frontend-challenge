import { cn } from '@/lib/utils'
import type { DiscoveryListUiState } from '@/features/movies/model/use-discovery-list-params'
import type { MovieGenre } from '@/features/movies/types'
import { Button } from '@/components/ui/button'
import { MoviesFiltersPanel } from './movies-filters-panel'

export type DiscoveryFiltersToolbarProps = {
  readonly className?: string
  readonly ui: DiscoveryListUiState
  readonly actions: {
    readonly setGenreId: (value: number | null) => void
    readonly setYear: (value: number | null) => void
    readonly setMinVote: (value: number | null) => void
    readonly reset: () => void
    readonly applyFilters: () => void
  }
  readonly genres?: MovieGenre[]
  readonly isApplyDisabled?: boolean
}

export function DiscoveryFiltersToolbar(
  props: Readonly<DiscoveryFiltersToolbarProps>,
) {
  const {
    className,
    ui,
    actions,
    genres,
    isApplyDisabled = false,
  } = props

  return (
    <div className={cn(className)}>
      <MoviesFiltersPanel
        ariaLabel="Filtros"
        idPrefix="discovery"
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
        onReset={actions.reset}
      />
    </div>
  )
}

