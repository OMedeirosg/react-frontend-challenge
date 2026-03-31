import { Button } from '@/components/ui/button'

type DiscoveryContextToggleProps = {
  readonly contextMode: 'search' | 'filters'
  readonly onSelectSearchContext?: () => void
  readonly onSelectFilterContext?: () => void
}

export function DiscoveryContextToggle(
  props: Readonly<DiscoveryContextToggleProps>,
) {
  const { contextMode, onSelectSearchContext, onSelectFilterContext } = props

  return (
    <div
      className="inline-flex rounded-lg border border-border p-1"
      role="tablist"
      aria-label="Modo de descoberta"
    >
      <Button
        type="button"
        variant={contextMode === 'search' ? 'default' : 'ghost'}
        size="sm"
        onClick={onSelectSearchContext}
        role="tab"
        aria-selected={contextMode === 'search'}
      >
        Pesquisa contextual
      </Button>
      <Button
        type="button"
        variant={contextMode === 'filters' ? 'default' : 'ghost'}
        size="sm"
        onClick={onSelectFilterContext}
        role="tab"
        aria-selected={contextMode === 'filters'}
      >
        Filtros avancados
      </Button>
    </div>
  )
}
