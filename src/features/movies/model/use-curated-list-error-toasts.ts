import { useEffect, useRef } from 'react'

import { ApiError } from '@/lib/api'
import { useToastStore } from '@/shared/model/toast-store'

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

    const errorKey =
      trendingQuery.error instanceof ApiError
        ? `api-${trendingQuery.error.status}`
        : 'generic'

    if (lastTrendingErrorRef.current === errorKey) return
    lastTrendingErrorRef.current = errorKey
    showToast({
      variant: 'error',
      message:
        trendingQuery.error instanceof ApiError
          ? `Falha ao carregar Trending (erro ${trendingQuery.error.status}).`
          : 'Falha ao carregar Trending.',
    })
  }, [showToast, trendingQuery.error, trendingQuery.isError])

  useEffect(() => {
    if (!popularQuery.isError) {
      lastPopularErrorRef.current = null
      return
    }

    const errorKey =
      popularQuery.error instanceof ApiError
        ? `api-${popularQuery.error.status}`
        : 'generic'

    if (lastPopularErrorRef.current === errorKey) return
    lastPopularErrorRef.current = errorKey
    showToast({
      variant: 'error',
      message:
        popularQuery.error instanceof ApiError
          ? `Falha ao carregar Popular (erro ${popularQuery.error.status}).`
          : 'Falha ao carregar Popular.',
    })
  }, [popularQuery.error, popularQuery.isError, showToast])
}

