import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMemo } from 'react'

import { useAuthStore } from '@/features/auth/store'
import { tmdbPosterUrl } from '@/features/movies/lib/tmdb-poster-url'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import {
  useMovieCredits,
  useMovieDetails,
  useMovieVideos,
} from '@/features/movies/queries'
import { useMovieDetailsErrorToast } from '@/features/movies/model/use-movie-details-error-toast'
import {
  invalidMovieIdParamMessage,
  movieCreditsEmptyMessage,
  movieCreditsInlineErrorMessage,
  movieDetailErrorMessage,
  movieDetailGenericFailureMessage,
  movieTrailerUnavailableMessage,
} from '@/features/movies/model/movie-query-errors'
import { MovieDetailsLoaded } from '@/features/movies/ui/movie-details-loaded'
import { MovieDetailsPageSkeleton } from '@/features/movies/ui/movie-details-page-skeleton'
import { useToastStore } from '@/shared/model/toast-store'
import { QueryInlineError } from '@/shared/ui/feedback'

export const Route = createFileRoute('/movie/$id')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  component: MovieDetailsPage,
})

function MovieDetailsPage() {
  const { id } = Route.useParams()
  const showToast = useToastStore((state) => state.showToast)
  const watchlistActions = useWatchlistActions()
  const movieId = Number(id)

  const detailsQuery = useMovieDetails(movieId, 'pt-BR')
  const creditsQuery = useMovieCredits(movieId, 'pt-BR')
  const videosQuery = useMovieVideos(movieId, 'pt-BR')
  useMovieDetailsErrorToast(detailsQuery)

  const topCast = useMemo(
    () => (creditsQuery.data?.cast ?? []).slice(0, 8),
    [creditsQuery.data?.cast],
  )

  const trailer = useMemo(() => {
    const videos = videosQuery.data?.results ?? []
    const preferredTrailer = videos.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer',
    )
    if (preferredTrailer) return preferredTrailer
    return videos.find((video) => video.site === 'YouTube')
  }, [videosQuery.data?.results])

  const movie = detailsQuery.data

  const castContent = (() => {
    if (creditsQuery.isError) {
      return (
        <QueryInlineError className="text-sm">
          {movieCreditsInlineErrorMessage(creditsQuery.error)}
        </QueryInlineError>
      )
    }
    if (topCast.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">{movieCreditsEmptyMessage}</p>
      )
    }
    return (
      <ul className="grid gap-2 sm:grid-cols-2">
        {topCast.map((member) => (
          <li key={member.id} className="rounded-md border p-2 text-sm">
            <p className="font-medium">{member.name}</p>
            <p className="text-muted-foreground">{member.character || '—'}</p>
          </li>
        ))}
      </ul>
    )
  })()

  const trailerBlock = trailer ? (
    <a
      href={`https://www.youtube.com/watch?v=${trailer.key}`}
      target="_blank"
      rel="noreferrer"
      className="text-sm text-primary underline-offset-4 hover:underline"
    >
      Assistir trailer: {trailer.name}
    </a>
  ) : (
    <p className="text-sm text-muted-foreground">{movieTrailerUnavailableMessage}</p>
  )

  if (!Number.isFinite(movieId) || movieId <= 0) {
    return (
      <div className="p-4">
        <QueryInlineError className="text-sm">{invalidMovieIdParamMessage}</QueryInlineError>
      </div>
    )
  }

  if (detailsQuery.isPending) {
    return <MovieDetailsPageSkeleton />
  }

  if (detailsQuery.isError || !movie) {
    return (
      <div className="p-4">
        <QueryInlineError className="text-sm">
          {detailsQuery.isError
            ? movieDetailErrorMessage(detailsQuery.error)
            : movieDetailGenericFailureMessage}
        </QueryInlineError>
      </div>
    )
  }

  const posterUrl = tmdbPosterUrl(movie.poster_path, 'w342')
  const inWatchlist = watchlistActions.isInWatchlist(movie.id)

  return (
    <MovieDetailsLoaded
      movie={movie}
      posterUrl={posterUrl}
      inWatchlist={inWatchlist}
      watchlistActions={watchlistActions}
      showToast={showToast}
      castContent={castContent}
      trailerBlock={trailerBlock}
    />
  )
}
