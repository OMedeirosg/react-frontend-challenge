import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { DiscoveryListUiState } from '@/features/movies/model/use-discovery-list-params'
import type { MovieGenre } from '@/features/movies/types'

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

function parseOptionalInt(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const n = Number(trimmed)
  return Number.isFinite(n) ? Math.trunc(n) : null
}

function parseOptionalFloat(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {contextMode === 'search' ? (
          <div className="space-y-1 lg:col-span-3">
            <Label htmlFor="discovery-search">Busca</Label>
            <div className="flex items-center gap-2">
              <Input
                id="discovery-search"
                placeholder="Ex.: Duna"
                value={ui.searchRaw}
                onChange={(e) => actions.setSearchRaw(e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => actions.setSearchRaw('')}
              >
                Limpar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Debounce: 400ms (não dispara a API a cada tecla)
            </p>
          </div>
        ) : null}

        {contextMode === 'filters' ? (
          <>
            <div className="space-y-1">
              <Label htmlFor="discovery-genre">Gênero</Label>
              {genres?.length ? (
                <select
                  id="discovery-genre"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={ui.genreId ?? ''}
                  onChange={(e) =>
                    actions.setGenreId(
                      e.target.value === '' ? null : Number(e.target.value),
                    )
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
                  onChange={(e) =>
                    actions.setGenreId(parseOptionalInt(e.target.value))
                  }
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
                onChange={(e) => actions.setYear(parseOptionalInt(e.target.value))}
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
                onChange={(e) =>
                  actions.setMinVote(parseOptionalFloat(e.target.value))
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={actions.reset}
              >
                Limpar filtros
              </Button>
            </div>
          </>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        {contextMode === 'search'
          ? 'Use texto para encontrar um filme específico.'
          : 'Use filtros para descoberta avançada de catálogo.'}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5 text-sm text-muted-foreground">
          {contextLabel ? (
            <p className="text-foreground">{contextLabel}</p>
          ) : null}
          <p>
            Página atual:{' '}
            <span className="font-medium text-foreground">
              {ui.page}
              {totalPages ? ` / ${totalPages}` : ''}
            </span>
          </p>
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

