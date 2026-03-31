import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DiscoveryListUiState } from '@/features/movies/model/use-discovery-list-params'
import type { MovieGenre } from '@/features/movies/types'
import { DiscoveryAdvancedFiltersPanel } from './discovery-advanced-filters-panel'
import { DiscoveryContextToggle } from './discovery-context-toggle'
import { DiscoverySearchPanel } from './discovery-search-panel'

export type DiscoveryFiltersToolbarProps = {
  readonly className?: string
  readonly ui: DiscoveryListUiState
  readonly actions: {
    readonly setSearchRaw: (value: string) => void
    readonly setGenreId: (value: number | null) => void
    readonly setYear: (value: number | null) => void
    readonly setMinVote: (value: number | null) => void
    readonly nextPage: () => void
    readonly prevPage: () => void
    readonly reset: () => void
  }
  readonly genres?: MovieGenre[]
  readonly totalPages?: number
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
    totalPages,
    contextLabel,
    searchActive = false,
    onSelectSearchContext,
    onSelectFilterContext,
  } = props

  const contextMode: 'search' | 'filters' = searchActive
    ? 'search'
    : 'filters'

  return (
    <section className={cn('space-y-3', className)} aria-label="Filtros">
      <DiscoveryContextToggle
        contextMode={contextMode}
        onSelectSearchContext={onSelectSearchContext}
        onSelectFilterContext={onSelectFilterContext}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {contextMode === 'search' ? (
          <DiscoverySearchPanel ui={ui} setSearchRaw={actions.setSearchRaw} />
        ) : null}

        {contextMode === 'filters' ? (
          <DiscoveryAdvancedFiltersPanel
            ui={ui}
            genres={genres}
            setGenreId={actions.setGenreId}
            setYear={actions.setYear}
            setMinVote={actions.setMinVote}
            reset={actions.reset}
          />
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        {contextMode === 'search'
          ? 'Use texto para encontrar um filme específico.'
          : 'Use filtros para descoberta avançada de catálogo.'}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {contextLabel ? (
            <p className="text-foreground">{contextLabel}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={actions.prevPage}
            disabled={ui.page <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={actions.nextPage}
            disabled={totalPages ? ui.page >= totalPages : false}
          >
            Próxima
          </Button>
        </div>
      </div>
    </section>
  )
}

