import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseOptionalFloat, parseOptionalInt } from '@/features/movies/lib/parse-optional-number'
import type { DiscoveryListUiState } from '@/features/movies/model/use-discovery-list-params'
import type { MovieGenre } from '@/features/movies/types'

type DiscoveryAdvancedFiltersPanelProps = {
  readonly ui: DiscoveryListUiState
  readonly genres?: MovieGenre[]
  readonly setGenreId: (value: number | null) => void
  readonly setYear: (value: number | null) => void
  readonly setMinVote: (value: number | null) => void
  readonly reset: () => void
}

export function DiscoveryAdvancedFiltersPanel(
  props: Readonly<DiscoveryAdvancedFiltersPanelProps>,
) {
  const { ui, genres, setGenreId, setYear, setMinVote, reset } = props

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="discovery-genre">Gênero</Label>
        {genres?.length ? (
          <select
            id="discovery-genre"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            value={ui.genreId ?? ''}
            onChange={(e) =>
              setGenreId(e.target.value === '' ? null : Number(e.target.value))
            }
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
            id="discovery-genre"
            inputMode="numeric"
            placeholder="ID (ex.: 28)"
            value={ui.genreId ?? ''}
            onChange={(e) => setGenreId(parseOptionalInt(e.target.value))}
          />
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="discovery-year">Ano</Label>
        <Input
          id="discovery-year"
          inputMode="numeric"
          placeholder="Ex.: 2024"
          value={ui.year ?? ''}
          onChange={(e) => setYear(parseOptionalInt(e.target.value))}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="discovery-min-vote">Nota mínima</Label>
        <Input
          id="discovery-min-vote"
          type="number"
          inputMode="decimal"
          min={0}
          max={10}
          step={0.1}
          placeholder="0–10"
          value={ui.minVote ?? ''}
          onChange={(e) => setMinVote(parseOptionalFloat(e.target.value))}
        />
      </div>

      <div className="flex items-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={reset}
        >
          Limpar filtros
        </Button>
      </div>
    </>
  )
}
