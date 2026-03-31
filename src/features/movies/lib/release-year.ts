import type { MovieListItem } from '@/features/movies/types'

export function releaseYear(movie: MovieListItem): string {
  if (!movie.release_date) return '—'
  const y = movie.release_date.slice(0, 4)
  return y || '—'
}
