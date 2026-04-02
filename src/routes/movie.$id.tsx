import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { useMemo } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/features/auth/store'
import { tmdbPosterUrl } from '@/features/movies/lib/tmdb-poster-url'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import {
  useMovieCredits,
  useMovieDetails,
  useMovieSimilar,
  useMovieVideos,
} from '@/features/movies/queries'
import { useMovieDetailsErrorToast } from '@/features/movies/model/use-movie-details-error-toast'
import type { MovieListItem } from '@/features/movies/types'
import {
  invalidMovieIdParamMessage,
  movieCreditsEmptyMessage,
  movieCreditsInlineErrorMessage,
  movieDetailErrorMessage,
  movieDetailGenericFailureMessage,
  movieSimilarEmptyMessage,
  movieSimilarInlineErrorMessage,
  movieTrailerUnavailableMessage,
} from '@/features/movies/model/movie-query-errors'
import { MovieDetailsLoaded } from '@/features/movies/ui/movie-details-loaded'
import { MovieDetailsPageSkeleton } from '@/features/movies/ui/movie-details-page-skeleton'
import { QueryInlineError } from '@/shared/ui/feedback'

const SIMILAR_ROW_LIMIT = 12

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
  const watchlistActions = useWatchlistActions()
  const movieId = Number(id)

  const detailsQuery = useMovieDetails(movieId, 'pt-BR')
  const creditsQuery = useMovieCredits(movieId, 'pt-BR')
  const videosQuery = useMovieVideos(movieId, 'pt-BR')
  const similarQuery = useMovieSimilar(movieId, 'pt-BR')
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

  const similarMovies = useMemo(
    () => (similarQuery.data?.results ?? []).slice(0, SIMILAR_ROW_LIMIT),
    [similarQuery.data?.results],
  )

  const movie = detailsQuery.data

  const castContent = (() => {
    if (creditsQuery.isPending) {
      return (
        <ul className="grid gap-2 sm:grid-cols-2">
          {['sk-cast-pending-1', 'sk-cast-pending-2', 'sk-cast-pending-3', 'sk-cast-pending-4'].map(
            (key) => (
              <li key={key} className="flex gap-3 rounded-md border p-2">
                <Skeleton className="h-[72px] w-12 shrink-0 rounded-sm" />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </li>
            ),
          )}
        </ul>
      )
    }
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
        {topCast.map((member) => {
          const profileUrl = tmdbPosterUrl(member.profile_path, 'w185')
          return (
            <li
              key={member.id}
              className="flex gap-3 rounded-md border p-2 text-sm"
            >
              <div className="h-[72px] w-12 shrink-0 overflow-hidden rounded-sm bg-muted/40">
                {profileUrl ? (
                  <img
                    src={profileUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-muted-foreground">
                    —
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-muted-foreground">{member.character || '—'}</p>
              </div>
            </li>
          )
        })}
      </ul>
    )
  })()

  const trailerBlock = (() => {
    if (videosQuery.isPending) {
      return <Skeleton className="aspect-video w-full max-w-3xl rounded-md" />
    }
    if (trailer?.site === 'YouTube') {
      return (
        <div className="space-y-3">
          <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-md border bg-muted/20">
            <iframe
              title={`Trailer: ${trailer.name}`}
              src={`https://www.youtube.com/embed/${trailer.key}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${trailer.key}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Abrir no YouTube
          </a>
        </div>
      )
    }
    return (
      <p className="text-sm text-muted-foreground">{movieTrailerUnavailableMessage}</p>
    )
  })()

  const relatedContent = (() => {
    if (similarQuery.isPending) {
      return (
        <div className="flex gap-3 overflow-x-auto pb-1 pt-0.5">
          {['sk-rel-1', 'sk-rel-2', 'sk-rel-3', 'sk-rel-4', 'sk-rel-5'].map((key) => (
            <div key={key} className="w-[110px] shrink-0 space-y-2">
              <Skeleton className="aspect-2/3 w-full rounded-md" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      )
    }
    if (similarQuery.isError) {
      return (
        <QueryInlineError className="text-sm">
          {movieSimilarInlineErrorMessage(similarQuery.error)}
        </QueryInlineError>
      )
    }
    if (similarMovies.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">{movieSimilarEmptyMessage}</p>
      )
    }
    return (
      <div className="flex gap-3 overflow-x-auto pb-1 pt-0.5">
        {similarMovies.map((item: MovieListItem) => {
          const thumb = tmdbPosterUrl(item.poster_path, 'w185')
          return (
            <Link
              key={item.id}
              to="/movie/$id"
              params={{ id: String(item.id) }}
              className="w-[110px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="overflow-hidden rounded-md border bg-muted/20">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={`Pôster de ${item.title}`}
                    className="aspect-2/3 w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-2/3 place-items-center text-xs text-muted-foreground">
                    —
                  </div>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-center text-xs leading-tight text-foreground">
                {item.title}
              </p>
            </Link>
          )
        })}
      </div>
    )
  })()

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
      castContent={castContent}
      trailerBlock={trailerBlock}
      relatedContent={relatedContent}
    />
  )
}
