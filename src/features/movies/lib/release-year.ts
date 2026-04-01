import type { MovieListItem } from '@/features/movies/types'

/**
 * Ano numérico a partir de `release_date` TMDB (`YYYY-MM-DD` ou vazio).
 * Home curada e watchlist usam esta mesma regra para o filtro por ano (evita
 * divergir de `startsWith` vs número parseado).
 */
export function releaseYearNumber(
  releaseDate: string | null | undefined,
): number | null {
  if (!releaseDate?.length) return null
  const y = Number(releaseDate.slice(0, 4))
  return Number.isFinite(y) && y > 0 ? y : null
}

export function releaseYear(movie: MovieListItem): string {
  if (!movie.release_date) return '—'
  const y = movie.release_date.slice(0, 4)
  return y || '—'
}
