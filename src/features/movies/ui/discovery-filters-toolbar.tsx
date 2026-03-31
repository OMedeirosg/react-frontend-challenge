import { cn } from '@/lib/utils'
import type { DiscoveryListUiState } from '@/features/movies/model/use-discovery-list-params'
import type { MovieGenre } from '@/features/movies/types'
import { MoviesFiltersPanel } from './movies-filters-panel'

export type DiscoveryFiltersToolbarProps = {
  readonly className?: string
  readonly ui: DiscoveryListUiState
  readonly actions: {
    readonly setSearchRaw: (value: string) => void
    readonly setGenreId: (value: number | null) => void
    readonly setYear: (value: number | null) => void
    readonly setMinVote: (value: number | null) => void
    readonly reset: () => void
  }
  readonly genres?: MovieGenre[]
  readonly contextLabel?: string
  readonly searchActive?: boolean
  readonly onSelectSearchContext?: () => void
  readonly onSelectFilterContext?: () => void
}

export function DiscoveryFiltersToolbar(
  props: Readonly<DiscoveryFiltersToolbarProps>,
) {
  const {
    className,
    ui,
    actions,
    genres,
    contextLabel,
    searchActive = false,
    onSelectSearchContext,
    onSelectFilterContext,
  } = props

  const contextMode: 'search' | 'filters' = searchActive
    ? 'search'
    : 'filters'

  return (
    <div className={cn(className)}>
      <MoviesFiltersPanel
        ariaLabel="Filtros"
        idPrefix="discovery"
        contextMode={contextMode}
        searchRaw={ui.searchRaw}
        genreId={ui.genreId}
        year={ui.year}
        minVote={ui.minVote}
        genres={genres}
        contextLabel={contextLabel}
        onSelectSearchContext={onSelectSearchContext}
        onSelectFilterContext={onSelectFilterContext}
        onSearchChange={actions.setSearchRaw}
        onGenreChange={actions.setGenreId}
        onYearChange={actions.setYear}
        onMinVoteChange={actions.setMinVote}
        onReset={actions.reset}
      />
    </div>
  )
}

