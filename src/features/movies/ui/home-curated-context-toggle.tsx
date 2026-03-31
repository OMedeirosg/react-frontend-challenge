import { Button } from '@/components/ui/button'

import type { HomeCuratedToolbarSharedProps } from './home-curated-toolbar.types'

type HomeCuratedContextToggleProps = Pick<
  HomeCuratedToolbarSharedProps,
  'ui' | 'actions'
>

export function HomeCuratedContextToggle(
  props: Readonly<HomeCuratedContextToggleProps>,
) {
  const { ui, actions } = props

  return (
    <div className="inline-flex rounded-lg border border-border p-1" role="tablist">
      <Button
        type="button"
        variant={ui.contextMode === 'search' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => actions.setContextMode('search')}
        role="tab"
        aria-selected={ui.contextMode === 'search'}
      >
        Pesquisa contextual
      </Button>
      <Button
        type="button"
        variant={ui.contextMode === 'filters' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => actions.setContextMode('filters')}
        role="tab"
        aria-selected={ui.contextMode === 'filters'}
      >
        Filtros avancados
      </Button>
    </div>
  )
}
