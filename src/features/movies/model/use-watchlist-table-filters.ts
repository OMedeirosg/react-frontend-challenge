import { useCallback, useMemo, useState } from 'react'

import { discoveryDraftSchema } from '@/features/movies/model/discovery-search-schema'
import type { MovieListItem } from '@/features/movies/types'
import { useToastStore } from '@/shared/model/toast-store'

type WatchlistFilters = {
  genreId: number | null
  year: number | null
  minVote: number | null
}

const EMPTY: WatchlistFilters = { genreId: null, year: null, minVote: null }

function filtersEqual(a: WatchlistFilters, b: WatchlistFilters): boolean {
  return (
    a.genreId === b.genreId && a.year === b.year && a.minVote === b.minVote
  )
}

export function useWatchlistTableFilters(movies: MovieListItem[]) {
  const showToast = useToastStore((s) => s.showToast)

  const [draft, setDraft] = useState<WatchlistFilters>(EMPTY)
  const [applied, setApplied] = useState<WatchlistFilters>(EMPTY)

  const applyFilters = useCallback(() => {
    const parsed = discoveryDraftSchema.safeParse(draft)
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message
      showToast({
        variant: 'error',
        message: first ?? 'Verifique os filtros antes de aplicar.',
      })
      return
    }
    setApplied(parsed.data)
  }, [draft, showToast])

  const resetFilters = useCallback(() => {
    setDraft(EMPTY)
    setApplied(EMPTY)
  }, [])

  const setGenreId = useCallback((genreId: number | null) => {
    setDraft((prev) => ({ ...prev, genreId }))
  }, [])

  const setYear = useCallback((year: number | null) => {
    setDraft((prev) => ({ ...prev, year }))
  }, [])

  const setMinVote = useCallback((minVote: number | null) => {
    setDraft((prev) => ({ ...prev, minVote }))
  }, [])

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (applied.genreId != null && !movie.genre_ids.includes(applied.genreId)) {
        return false
      }
      if (
        applied.year != null &&
        !movie.release_date.startsWith(String(applied.year))
      ) {
        return false
      }
      if (applied.minVote != null && movie.vote_average < applied.minVote) {
        return false
      }
      return true
    })
  }, [applied.genreId, applied.minVote, applied.year, movies])

  const isApplyDisabled = filtersEqual(draft, applied)

  return {
    ui: {
      genreId: draft.genreId,
      year: draft.year,
      minVote: draft.minVote,
    },
    actions: {
      setGenreId,
      setYear,
      setMinVote,
      resetFilters,
      applyFilters,
    },
    isApplyDisabled,
    filteredMovies,
  }
}
