import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseOptionalInt } from '@/features/movies/lib/parse-optional-number'

export type MoviesFiltersPanelFieldsProps = {
  readonly idPrefix: string
  readonly genreId: number | null
  readonly yearDraft: string
  readonly minVoteDraft: string
  readonly genres?: { id: number; name: string }[]
  readonly onGenreChange: (value: number | null) => void
  readonly onYearDraftChange: (raw: string) => void
  readonly onMinVoteDraftChange: (raw: string) => void
  readonly onReset: () => void
}

export function MoviesFiltersPanelFields(
  props: Readonly<MoviesFiltersPanelFieldsProps>,
) {
  const {
    idPrefix,
    genreId,
    yearDraft,
    minVoteDraft,
    genres,
    onGenreChange,
    onYearDraftChange,
    onMinVoteDraftChange,
    onReset,
  } = props

  return (
    <>
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
          onChange={(e) => onYearDraftChange(e.target.value)}
          onBlur={() => onYearDraftChange(yearDraft)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onYearDraftChange(yearDraft)
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
            onChange={(e) => onMinVoteDraftChange(e.target.value)}
            onBlur={() => onMinVoteDraftChange(minVoteDraft)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onMinVoteDraftChange(minVoteDraft)
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            Limpar
          </Button>
        </div>
      </div>
    </>
  )
}
