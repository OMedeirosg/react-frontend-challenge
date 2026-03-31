import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { HomeCuratedToolbarSharedProps } from './home-curated-toolbar.types'

type HomeCuratedSearchPanelProps = Pick<HomeCuratedToolbarSharedProps, 'ui' | 'actions'>

export function HomeCuratedSearchPanel(
  props: Readonly<HomeCuratedSearchPanelProps>,
) {
  const { ui, actions } = props

  return (
    <div className="space-y-1 max-w-5xl">
      <Label htmlFor="home-context-search">Busca</Label>
      <div className="flex items-center gap-2">
        <Input
          id="home-context-search"
          placeholder="Ex.: Duna"
          value={ui.searchRaw}
          onChange={(e) => actions.setSearchRaw(e.target.value)}
        />
        <Button variant="ghost" size="sm" onClick={actions.clearSearch}>
          Limpar
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Debounce: 400ms (não dispara a API a cada tecla)
      </p>
    </div>
  )
}
