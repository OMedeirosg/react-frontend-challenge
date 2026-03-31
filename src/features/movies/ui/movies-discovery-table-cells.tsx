import type { MovieListItem } from '@/features/movies/types'
import { Star } from 'lucide-react'

import { MovieListPoster } from './movie-list-poster'

export function PosterTableCell(props: Readonly<{ movie: MovieListItem }>) {
  return (
    <MovieListPoster
      posterPath={props.movie.poster_path}
      title={props.movie.title}
      className="h-14 max-h-14"
    />
  )
}

export function GenreTableCell(
  props: Readonly<{ movie: MovieListItem; genreNameById?: Map<number, string> }>,
) {
  const ids = props.movie.genre_ids
  if (!ids.length) {
    return <span className="text-muted-foreground">—</span>
  }

  const names =
    props.genreNameById &&
    ids.map((id) => props.genreNameById?.get(id)).filter(Boolean)

  if (names?.length) {
    const label = names.join(', ')
    return (
      <span className="block truncate text-muted-foreground" title={label}>
        {label}
      </span>
    )
  }

  return <span className="text-muted-foreground">—</span>
}

export function TitleTableCell(
  props: Readonly<{ title: string; isInWatchlist?: boolean }>,
) {
  return (
    <div className="flex items-center gap-2">
      <span className="block truncate font-medium" title={props.title}>
        {props.title}
      </span>
      {props.isInWatchlist ? (
        <Star
          className="size-4 fill-amber-400 text-amber-500"
          aria-label="Filme na Watchlist"
        />
      ) : null}
    </div>
  )
}
