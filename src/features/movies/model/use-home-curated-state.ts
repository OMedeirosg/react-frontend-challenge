import { useMemo, useState } from 'react'
export type HomeCuratedListMode = 'trending' | 'popular'

type HomeCuratedFilters = {
  genreId: number | null
  year: number | null
  minVote: number | null
}

export function useHomeCuratedState() {
  const [activeList, setActiveList] = useState<HomeCuratedListMode>('trending')

  const [trendingPage, setTrendingPage] = useState(1)
  const [popularPage, setPopularPage] = useState(1)

  const [filters, setFilters] = useState<HomeCuratedFilters>({
    genreId: null,
    year: null,
    minVote: null,
  })

  const activePage = activeList === 'trending' ? trendingPage : popularPage
  const setActivePage = activeList === 'trending' ? setTrendingPage : setPopularPage

  return useMemo(
    () => ({
      ui: {
        activeList,
        activePage,
        trendingPage,
        popularPage,
        genreId: filters.genreId,
        year: filters.year,
        minVote: filters.minVote,
      },
      actions: {
        setActiveList,
        setGenreId: (genreId: number | null) => {
          setFilters((prev) => ({ ...prev, genreId }))
          setActivePage(1)
        },
        setYear: (year: number | null) => {
          setFilters((prev) => ({ ...prev, year }))
          setActivePage(1)
        },
        setMinVote: (minVote: number | null) => {
          setFilters((prev) => ({ ...prev, minVote }))
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
      activePage,
      trendingPage,
      popularPage,
      filters.genreId,
      filters.year,
      filters.minVote,
      setActivePage,
    ],
  )
}

