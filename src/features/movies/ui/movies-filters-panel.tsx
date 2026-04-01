import { useState, type ReactNode } from 'react'

import { parseOptionalFloat, parseOptionalInt } from '@/features/movies/lib/parse-optional-number'
import { MoviesFiltersPanelFields } from '@/features/movies/ui/movies-filters-panel-fields'

type MoviesFiltersPanelProps = {
  readonly ariaLabel?: string
  readonly idPrefix?: string
  readonly filtersInline?: boolean
  /** Ação principal na mesma fila dos campos (ex.: Aplicar filtros), com `gap` compartilhado. */
  readonly inlineTrailingSlot?: ReactNode
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
    inlineTrailingSlot,
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
  const [prevYear, setPrevYear] = useState(year)
  const [prevMinVote, setPrevMinVote] = useState(minVote)
  if (year !== prevYear) {
    setPrevYear(year)
    setYearDraft(year == null ? '' : String(year))
  }
  if (minVote !== prevMinVote) {
    setPrevMinVote(minVote)
    setMinVoteDraft(minVote == null ? '' : String(minVote))
  }

  const handleYearDraft = (raw: string) => {
    setYearDraft(raw)
    onYearChange(parseOptionalInt(raw))
  }

  const handleMinVoteDraft = (raw: string) => {
    setMinVoteDraft(raw)
    onMinVoteChange(parseOptionalFloat(raw))
  }

  const fieldColumns = (
    <MoviesFiltersPanelFields
      idPrefix={idPrefix}
      genreId={genreId}
      yearDraft={yearDraft}
      minVoteDraft={minVoteDraft}
      genres={genres}
      onGenreChange={onGenreChange}
      onYearDraftChange={handleYearDraft}
      onMinVoteDraftChange={handleMinVoteDraft}
      onReset={onReset}
    />
  )

  return (
    <section className="space-y-2" aria-label={ariaLabel}>
      {filtersInline ? (
        <div className="flex flex-wrap items-end gap-2">
          {fieldColumns}
          {inlineTrailingSlot ? (
            <div className="flex shrink-0 items-end">{inlineTrailingSlot}</div>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">{fieldColumns}</div>
      )}
    </section>
  )
}
