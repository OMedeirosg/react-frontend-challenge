import type { MovieListItem } from '@/features/movies/types'

export function genreSortValue(
  movie: MovieListItem,
  genreNameById?: Map<number, string>,
): string {
  if (!movie.genre_ids.length || !genreNameById) return ''
  return movie.genre_ids
    .map((id) => genreNameById.get(id))
    .filter((name): name is string => Boolean(name))
    .join(', ')
}
