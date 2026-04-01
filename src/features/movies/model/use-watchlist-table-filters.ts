import { useCallback, useMemo, useState } from 'react'

import { releaseYearNumber } from '@/features/movies/lib/release-year'
import {
  discoveryDraftFiltersEqual,
  tryParseDiscoveryDraftFilters,
} from '@/features/movies/model/parse-discovery-draft-filters'
import type { MovieListItem } from '@/features/movies/types'
import { useToastStore } from '@/shared/model/toast-store'

type WatchlistFilters = {
  genreId: number | null
  year: number | null
  minVote: number | null
}

const EMPTY: WatchlistFilters = { genreId: null, year: null, minVote: null }

export function useWatchlistTableFilters(movies: MovieListItem[]) {
  const showToast = useToastStore((s) => s.showToast)

  const [draft, setDraft] = useState<WatchlistFilters>(EMPTY)
  const [applied, setApplied] = useState<WatchlistFilters>(EMPTY)

  const applyFilters = useCallback(() => {
    const parsed = tryParseDiscoveryDraftFilters(draft, showToast)
    if (!parsed) return
    setApplied(parsed)
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
        releaseYearNumber(movie.release_date) !== applied.year
      ) {
        return false
      }
      if (applied.minVote != null && movie.vote_average < applied.minVote) {
        return false
      }
      return true
    })
  }, [applied.genreId, applied.minVote, applied.year, movies])

  const isApplyDisabled = discoveryDraftFiltersEqual(draft, applied)

  const listPaginationResetKey = useMemo(
    () => `${applied.genreId}-${applied.year}-${applied.minVote}`,
    [applied.genreId, applied.minVote, applied.year],
  )

  return {
    listPaginationResetKey,
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
