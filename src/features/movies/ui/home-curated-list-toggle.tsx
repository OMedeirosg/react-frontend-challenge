import { Button } from '@/components/ui/button'

type HomeCuratedListToggleProps = {
  readonly activeList: 'trending' | 'popular'
  readonly onSelectList: (mode: 'trending' | 'popular') => void
}

export function HomeCuratedListToggle(
  props: Readonly<HomeCuratedListToggleProps>,
) {
  const { activeList, onSelectList } = props

  return (
    <div className="inline-flex rounded-lg border border-border p-1" role="tablist">
      <Button
        type="button"
        variant={activeList === 'trending' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onSelectList('trending')}
        role="tab"
        aria-selected={activeList === 'trending'}
      >
        Trending
      </Button>
      <Button
        type="button"
        variant={activeList === 'popular' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onSelectList('popular')}
        role="tab"
        aria-selected={activeList === 'popular'}
      >
        Popular
      </Button>
    </div>
  )
}
