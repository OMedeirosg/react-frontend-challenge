import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { getMovieDetails } from '@/features/movies/tmdbMovies'

import { movieKeys } from './movie-keys'

const DETAIL_STALE_MS = 1000 * 60 * 5

/**
 * Prefetch opcional do detalhe (mesma chave e staleTime que `useMovieDetails`).
 */
export function usePrefetchMovieDetail(language = 'pt-BR') {
  const queryClient = useQueryClient()
  return useCallback(
    (movieId: number) => {
      if (!Number.isFinite(movieId) || movieId <= 0) return
      void queryClient.prefetchQuery({
        queryKey: movieKeys.detail(movieId, language),
        queryFn: () => getMovieDetails({ movieId, language }),
        staleTime: DETAIL_STALE_MS,
      })
    },
    [language, queryClient],
  )
}
