import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseOptionalFloat, parseOptionalInt } from '@/features/movies/lib/parse-optional-number'

import { DiscoveryContextToggle } from './discovery-context-toggle'
import { FiltersContextHint } from './filters-context-hint'

type MoviesFiltersPanelProps = {
  readonly ariaLabel?: string
  readonly idPrefix?: string
  readonly contextMode: 'search' | 'filters'
  readonly searchRaw: string
  readonly genreId: number | null
  readonly year: number | null
  readonly minVote: number | null
  readonly genres?: { id: number; name: string }[]
  readonly contextLabel?: string
  readonly onSelectSearchContext?: () => void
  readonly onSelectFilterContext?: () => void
  readonly onSearchChange: (value: string) => void
  readonly onGenreChange: (value: number | null) => void
  readonly onYearChange: (value: number | null) => void
  readonly onMinVoteChange: (value: number | null) => void
  readonly onReset: () => void
}

export function MoviesFiltersPanel(props: Readonly<MoviesFiltersPanelProps>) {
  const {
    ariaLabel = 'Filtros de filmes',
    idPrefix = 'movies',
    contextMode,
    searchRaw,
    genreId,
    year,
    minVote,
    genres,
    contextLabel,
    onSelectSearchContext,
    onSelectFilterContext,
    onSearchChange,
    onGenreChange,
    onYearChange,
    onMinVoteChange,
    onReset,
  } = props

  return (
    <section className="space-y-2" aria-label={ariaLabel}>
      <DiscoveryContextToggle
        contextMode={contextMode}
        onSelectSearchContext={onSelectSearchContext}
        onSelectFilterContext={onSelectFilterContext}
      />

      {contextMode === 'search' ? (
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-search`}>Busca</Label>
          <div className="flex items-center gap-1.5">
            <Input
              id={`${idPrefix}-search`}
              placeholder="Ex.: Duna"
              value={searchRaw}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Button type="button" variant="ghost" size="xs" onClick={() => onSearchChange('')}>
              Limpar
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-genre`}>Gênero</Label>
            {genres?.length ? (
              <select
                id={`${idPrefix}-genre`}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                value={genreId ?? ''}
                onChange={(e) =>
                  onGenreChange(e.target.value === '' ? null : Number(e.target.value))
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
                id={`${idPrefix}-genre`}
                inputMode="numeric"
                placeholder="ID (ex.: 28)"
                value={genreId ?? ''}
                onChange={(e) => onGenreChange(parseOptionalInt(e.target.value))}
              />
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-year`}>Ano</Label>
            <Input
              id={`${idPrefix}-year`}
              inputMode="numeric"
              placeholder="Ex.: 2024"
              value={year ?? ''}
              onChange={(e) => onYearChange(parseOptionalInt(e.target.value))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`${idPrefix}-min-vote`}>Nota mínima</Label>
            <div className="flex items-center gap-2">
              <Input
                id={`${idPrefix}-min-vote`}
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.1}
                placeholder="0-10"
                value={minVote ?? ''}
                onChange={(e) => onMinVoteChange(parseOptionalFloat(e.target.value))}
              />
              <Button type="button" variant="outline" size="sm" onClick={onReset}>
                Limpar
              </Button>
            </div>
          </div>
        </div>
      )}

      <FiltersContextHint contextMode={contextMode} />

      {contextLabel ? (
        <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
          <p className="text-foreground">{contextLabel}</p>
        </div>
      ) : null}
    </section>
  )
}
