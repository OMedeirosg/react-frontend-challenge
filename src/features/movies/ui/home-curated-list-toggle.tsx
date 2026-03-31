import { Button } from '@/components/ui/button'

import type { HomeCuratedToolbarSharedProps } from './home-curated-toolbar.types'

type HomeCuratedListToggleProps = Pick<HomeCuratedToolbarSharedProps, 'ui' | 'actions'>

export function HomeCuratedListToggle(
  props: Readonly<HomeCuratedListToggleProps>,
) {
  const { ui, actions } = props

  return (
    <div className="inline-flex rounded-lg border border-border p-1" role="tablist">
      <Button
        type="button"
        variant={ui.activeList === 'trending' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => actions.setActiveList('trending')}
        role="tab"
        aria-selected={ui.activeList === 'trending'}
      >
        Trending
      </Button>
      <Button
        type="button"
        variant={ui.activeList === 'popular' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => actions.setActiveList('popular')}
        role="tab"
        aria-selected={ui.activeList === 'popular'}
      >
        Popular
      </Button>
    </div>
  )
}
