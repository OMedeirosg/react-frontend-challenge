import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import type { MovieGenre } from '../types'

type HomeCuratedContextMode = 'search' | 'filters'
type HomeCuratedListMode = 'trending' | 'popular'

export type HomeCuratedToolbarProps = {
  className?: string
  ui: {
    activeList: HomeCuratedListMode
    contextMode: HomeCuratedContextMode
    searchRaw: string
    genreId: number | null
    year: number | null
    minVote: number | null
  }
  actions: {
    setActiveList: (mode: HomeCuratedListMode) => void
    setContextMode: (mode: HomeCuratedContextMode) => void
    setSearchRaw: (value: string) => void
    clearSearch: () => void
    setGenreIdFromRaw: (value: string) => void
    setYearFromRaw: (value: string) => void
    setMinVoteFromRaw: (value: string) => void
    resetFilters: () => void
  }
  genres?: MovieGenre[]
}

export function HomeCuratedToolbar(props: Readonly<HomeCuratedToolbarProps>) {
  const { className, ui, actions, genres } = props

  return (
    <section className={cn('space-y-3', className)} aria-label="Filtros da home">
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

      {ui.contextMode === 'search' ? (
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
      ) : (
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
      )}
    </section>
  )
}

