import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { HomeCuratedToolbarSharedProps } from './home-curated-toolbar.types'

type HomeCuratedFiltersPanelProps = HomeCuratedToolbarSharedProps

export function HomeCuratedFiltersPanel(
  props: Readonly<HomeCuratedFiltersPanelProps>,
) {
  const { ui, actions, genres } = props

  return (
    <div className="grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
      <div className="space-y-1">
        <Label htmlFor="home-genre">Gênero</Label>
        {genres?.length ? (
          <select
            id="home-genre"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            value={ui.genreId ?? ''}
            onChange={(e) => actions.setGenreIdFromRaw(e.target.value)}
          >
            <option value="">Todos</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id="home-genre"
            inputMode="numeric"
            placeholder="ID do gênero"
            value={ui.genreId ?? ''}
            onChange={(e) => actions.setGenreIdFromRaw(e.target.value)}
          />
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="home-year">Ano</Label>
        <Input
          id="home-year"
          inputMode="numeric"
          placeholder="Ex.: 2024"
          value={ui.year ?? ''}
          onChange={(e) => actions.setYearFromRaw(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="home-min-vote">Nota mínima</Label>
        <div className="flex items-center gap-2">
          <Input
            id="home-min-vote"
            type="number"
            inputMode="decimal"
            min={0}
            max={10}
            step={0.1}
            placeholder="0-10"
            value={ui.minVote ?? ''}
            onChange={(e) => actions.setMinVoteFromRaw(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={actions.resetFilters}
          >
            Limpar
          </Button>
        </div>
      </div>
    </div>
  )
}
