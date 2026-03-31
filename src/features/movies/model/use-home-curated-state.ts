import { useMemo, useState } from 'react'

import { useDebouncedValue } from '@/shared/lib/use-debounced-value'

export type HomeCuratedContextMode = 'search' | 'filters'
export type HomeCuratedListMode = 'trending' | 'popular'

type HomeCuratedFilters = {
  genreId: number | null
  year: number | null
  minVote: number | null
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

export function useHomeCuratedState() {
  const [activeList, setActiveList] = useState<HomeCuratedListMode>('trending')
  const [contextMode, setContextMode] = useState<HomeCuratedContextMode>('search')

  const [trendingPage, setTrendingPage] = useState(1)
  const [popularPage, setPopularPage] = useState(1)

  const [searchRaw, setSearchRaw] = useState('')
  const [filters, setFilters] = useState<HomeCuratedFilters>({
    genreId: null,
    year: null,
    minVote: null,
  })

  const searchDebounced = useDebouncedValue(searchRaw, 400)

  const activePage = activeList === 'trending' ? trendingPage : popularPage
  const setActivePage = activeList === 'trending' ? setTrendingPage : setPopularPage

  return useMemo(
    () => ({
      ui: {
        activeList,
        contextMode,
        activePage,
        trendingPage,
        popularPage,
        searchRaw,
        searchDebounced,
        genreId: filters.genreId,
        year: filters.year,
        minVote: filters.minVote,
      },
      actions: {
        setActiveList,
        setContextMode,
        setSearchRaw: (value: string) => {
          setSearchRaw(value)
          setActivePage(1)
          if (value.trim().length > 0) {
            setFilters({ genreId: null, year: null, minVote: null })
          }
        },
        clearSearch: () => {
          setSearchRaw('')
          setActivePage(1)
        },
        setGenreIdFromRaw: (value: string) => {
          const genreId = parseOptionalInt(value)
          setFilters((prev) => ({ ...prev, genreId }))
          setSearchRaw('')
          setActivePage(1)
        },
        setYearFromRaw: (value: string) => {
          const year = parseOptionalInt(value)
          setFilters((prev) => ({ ...prev, year }))
          setSearchRaw('')
          setActivePage(1)
        },
        setMinVoteFromRaw: (value: string) => {
          const minVote = parseOptionalFloat(value)
          setFilters((prev) => ({ ...prev, minVote }))
          setSearchRaw('')
          setActivePage(1)
        },
        resetFilters: () => {
          setFilters({ genreId: null, year: null, minVote: null })
          setActivePage(1)
        },
        prevPage: () => setActivePage((p) => Math.max(1, p - 1)),
        nextPage: () => setActivePage((p) => p + 1),
      },
    }),
    [
      activeList,
      contextMode,
      activePage,
      trendingPage,
      popularPage,
      searchRaw,
      searchDebounced,
      filters.genreId,
      filters.year,
      filters.minVote,
      setActivePage,
    ],
  )
}

