import { useState } from 'react'

import { cn } from '@/lib/utils'

import { tmdbPosterUrl } from '../lib/tmdb-poster-url'

export type MovieListPosterProps = {
  readonly posterPath: string | null
  readonly title: string
  readonly className?: string
}

function PosterPlaceholder({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <div
      className={cn(
        'flex aspect-2/3 h-20 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground',
        className,
      )}
      aria-hidden
    >
      —
    </div>
  )
}

export function MovieListPoster(props: Readonly<MovieListPosterProps>) {
  const { posterPath, title, className } = props
  const [loadFailed, setLoadFailed] = useState(false)
  const url = tmdbPosterUrl(posterPath, 'w92')

  if (!url || loadFailed) {
    return <PosterPlaceholder className={className} />
  }

  return (
    <img
      src={url}
      alt={`Pôster de ${title}`}
      loading="lazy"
      decoding="async"
      className={cn(
        'aspect-2/3 h-20 w-auto shrink-0 rounded-md object-cover ring-1 ring-border',
        className,
      )}
      width={92}
      height={138}
      onError={() => setLoadFailed(true)}
    />
  )
}
