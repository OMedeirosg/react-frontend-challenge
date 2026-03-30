import { useQuery } from '@tanstack/react-query'
import { getPopularMovies } from './tmdbMovies'

export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  popular: (page: number) =>
    [...movieKeys.lists(), 'popular', { page }] as const,
}

const POPULAR_LIST_STALE_MS = 1000 * 60 * 5

export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: movieKeys.popular(page),
    queryFn: () => getPopularMovies({ page }),
    staleTime: POPULAR_LIST_STALE_MS,
  })
}
