import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseOptionalFloat, parseOptionalInt } from '@/features/movies/lib/parse-optional-number'

type MoviesFiltersPanelProps = {
  readonly ariaLabel?: string
  readonly idPrefix?: string
  readonly filtersInline?: boolean
  readonly genreId: number | null
  readonly year: number | null
  readonly minVote: number | null
  readonly genres?: { id: number; name: string }[]
  readonly onGenreChange: (value: number | null) => void
  readonly onYearChange: (value: number | null) => void
  readonly onMinVoteChange: (value: number | null) => void
  readonly onReset: () => void
}

export function MoviesFiltersPanel(props: Readonly<MoviesFiltersPanelProps>) {
  const {
    ariaLabel = 'Filtros de filmes',
    idPrefix = 'movies',
    filtersInline = false,
    genreId,
    year,
    minVote,
    genres,
    onGenreChange,
    onYearChange,
    onMinVoteChange,
    onReset,
  } = props

  const [yearDraft, setYearDraft] = useState(year == null ? '' : String(year))
  const [minVoteDraft, setMinVoteDraft] = useState(
    minVote == null ? '' : String(minVote),
  )

  useEffect(() => {
    setYearDraft(year == null ? '' : String(year))
  }, [year])

  useEffect(() => {
    setMinVoteDraft(minVote == null ? '' : String(minVote))
  }, [minVote])

  const commitYearDraft = useMemo(
    () => () => {
      onYearChange(parseOptionalInt(yearDraft))
    },
    [onYearChange, yearDraft],
  )

  const commitMinVoteDraft = useMemo(
    () => () => {
      onMinVoteChange(parseOptionalFloat(minVoteDraft))
    },
    [minVoteDraft, onMinVoteChange],
  )

  return (
    <section className="space-y-2" aria-label={ariaLabel}>
      <div
        className={
          filtersInline
            ? 'flex flex-wrap items-end gap-2'
            : 'grid grid-cols-1 gap-2'
        }
      >
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-genre`}>Gênero</Label>
          {genres?.length ? (
            <select
              id={`${idPrefix}-genre`}
              className="h-8 min-w-[160px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
              className="h-8 min-w-[120px]"
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
            className="h-8 min-w-[110px]"
            inputMode="numeric"
            placeholder="Ex.: 2024"
            value={yearDraft}
            onChange={(e) => setYearDraft(e.target.value)}
            onBlur={commitYearDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitYearDraft()
            }}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-min-vote`}>Nota mínima</Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${idPrefix}-min-vote`}
              className="h-8 min-w-[100px]"
              type="number"
              inputMode="decimal"
              min={0}
              max={10}
              step={0.1}
              placeholder="0-10"
              value={minVoteDraft}
              onChange={(e) => setMinVoteDraft(e.target.value)}
              onBlur={commitMinVoteDraft}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitMinVoteDraft()
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={onReset}>
              Limpar
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
