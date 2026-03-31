import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DiscoveryListUiState } from '@/features/movies/model/use-discovery-list-params'

type DiscoverySearchPanelProps = {
  readonly ui: DiscoveryListUiState
  readonly setSearchRaw: (value: string) => void
}

export function DiscoverySearchPanel(props: Readonly<DiscoverySearchPanelProps>) {
  const { ui, setSearchRaw } = props

  return (
    <div className="space-y-1 lg:col-span-3">
      <Label htmlFor="discovery-search">Busca</Label>
      <div className="flex items-center gap-2">
        <Input
          id="discovery-search"
          placeholder="Ex.: Duna"
          value={ui.searchRaw}
          onChange={(e) => setSearchRaw(e.target.value)}
        />
        <Button variant="ghost" size="sm" onClick={() => setSearchRaw('')}>
          Limpar
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Debounce: 400ms (não dispara a API a cada tecla)
      </p>
    </div>
  )
}
