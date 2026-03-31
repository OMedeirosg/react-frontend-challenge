/**
 * URLs absolutas de imagens da TMDB.
 *
 * Contrato de fallback na UI (Camada 2):
 * - Se `tmdbPosterUrl` retornar `null`: usar placeholder sem `<img>` (ex.: poster ausente).
 * - Se retornar URL: renderizar `<img>` e, em `onError`, trocar pelo mesmo placeholder
 *   (evita ícone quebrado e loop se o `src` não for removido após erro).
 *
 * @see https://developer.themoviedb.org/docs/image-basics
 */
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p' as const

export type TmdbPosterSize = 'w92' | 'w185' | 'w342' | 'w500'

/**
 * Monta a URL do poster a partir de `poster_path` retornado pela API.
 * Retorna `null` se não houver path utilizável.
 */
export function tmdbPosterUrl(
  posterPath: string | null | undefined,
  size: TmdbPosterSize,
): string | null {
  if (posterPath == null) return null
  const trimmed = posterPath.trim()
  if (trimmed === '') return null

  const relative = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `${TMDB_IMAGE_BASE}/${size}/${relative}`
}
