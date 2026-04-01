import { useEffect, useRef } from 'react'

import { useToastStore } from '@/shared/model/toast-store'

import {
  curatedErrorToastMessage,
  movieQueryErrorToastKey,
} from './movie-query-errors'
import { usePopularMovies, useTrendingMovies } from '../queries'

export function useCuratedListErrorToasts(
  trendingQuery: ReturnType<typeof useTrendingMovies>,
  popularQuery: ReturnType<typeof usePopularMovies>,
) {
  const showToast = useToastStore((s) => s.showToast)
  const lastTrendingErrorRef = useRef<string | null>(null)
  const lastPopularErrorRef = useRef<string | null>(null)

  useEffect(() => {
    if (!trendingQuery.isError) {
      lastTrendingErrorRef.current = null
      return
    }

    const errorKey = movieQueryErrorToastKey(trendingQuery.error)

    if (lastTrendingErrorRef.current === errorKey) return
    lastTrendingErrorRef.current = errorKey
    showToast({
      variant: 'error',
      message: curatedErrorToastMessage(trendingQuery.error, 'trending'),
    })
  }, [showToast, trendingQuery.error, trendingQuery.isError])

  useEffect(() => {
    if (!popularQuery.isError) {
      lastPopularErrorRef.current = null
      return
    }

    const errorKey = movieQueryErrorToastKey(popularQuery.error)

    if (lastPopularErrorRef.current === errorKey) return
    lastPopularErrorRef.current = errorKey
    showToast({
      variant: 'error',
      message: curatedErrorToastMessage(popularQuery.error, 'popular'),
    })
  }, [popularQuery.error, popularQuery.isError, showToast])
}

