import { useCallback, useState } from 'react'

import {
  discoveryDraftFiltersEqual,
  tryParseDiscoveryDraftFilters,
} from '@/features/movies/model/parse-discovery-draft-filters'
import { useToastStore } from '@/shared/model/toast-store'

export type HomeCuratedListMode = 'trending' | 'popular'

type HomeCuratedFilters = {
  genreId: number | null
  year: number | null
  minVote: number | null
}

const EMPTY_FILTERS: HomeCuratedFilters = {
  genreId: null,
  year: null,
  minVote: null,
}

export function useHomeCuratedState() {
  const showToast = useToastStore((s) => s.showToast)

  const [activeList, setActiveList] = useState<HomeCuratedListMode>('trending')

  const [trendingPage, setTrendingPage] = useState(1)
  const [popularPage, setPopularPage] = useState(1)

  const [filtersDraft, setFiltersDraft] =
    useState<HomeCuratedFilters>(EMPTY_FILTERS)
  const [filtersApplied, setFiltersApplied] =
    useState<HomeCuratedFilters>(EMPTY_FILTERS)

  const activePage = activeList === 'trending' ? trendingPage : popularPage
  const setActivePage =
    activeList === 'trending' ? setTrendingPage : setPopularPage

  const applyFilters = useCallback(() => {
    const parsed = tryParseDiscoveryDraftFilters(filtersDraft, showToast)
    if (!parsed) return
    setFiltersApplied(parsed)
    setActivePage(1)
  }, [filtersDraft, setActivePage, showToast])

  const resetFilters = useCallback(() => {
    setFiltersDraft(EMPTY_FILTERS)
    setFiltersApplied(EMPTY_FILTERS)
    setActivePage(1)
  }, [setActivePage])

  const setGenreId = useCallback((genreId: number | null) => {
    setFiltersDraft((prev) => ({ ...prev, genreId }))
  }, [])

  const setYear = useCallback((year: number | null) => {
    setFiltersDraft((prev) => ({ ...prev, year }))
  }, [])

  const setMinVote = useCallback((minVote: number | null) => {
    setFiltersDraft((prev) => ({ ...prev, minVote }))
  }, [])

  const isApplyDisabled = discoveryDraftFiltersEqual(
    filtersDraft,
    filtersApplied,
  )

  const prevPage = useCallback(() => {
    setActivePage((p) => Math.max(1, p - 1))
  }, [setActivePage])

  const nextPage = useCallback(() => {
    setActivePage((p) => p + 1)
  }, [setActivePage])

  return {
    ui: {
      activeList,
      activePage,
      trendingPage,
      popularPage,
      genreId: filtersDraft.genreId,
      year: filtersDraft.year,
      minVote: filtersDraft.minVote,
      appliedGenreId: filtersApplied.genreId,
      appliedYear: filtersApplied.year,
      appliedMinVote: filtersApplied.minVote,
    },
    actions: {
      setActiveList,
      setGenreId,
      setYear,
      setMinVote,
      resetFilters,
      applyFilters,
      prevPage,
      nextPage,
    },
    isApplyDisabled,
  }
}
