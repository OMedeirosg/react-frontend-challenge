import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store'
import { tmdbPosterUrl } from '@/features/movies/lib/tmdb-poster-url'
import { useWatchlistActions } from '@/features/movies/model/use-watchlist-actions'
import {
  useMovieCredits,
  useMovieDetails,
  useMovieVideos,
} from '@/features/movies/queries'
import { useToastStore } from '@/shared/model/toast-store'

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
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o elenco.
        </p>
      )
    }
    if (topCast.length === 0) {
      return <p className="text-sm text-muted-foreground">Elenco indisponível.</p>
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

  if (!Number.isFinite(movieId) || movieId <= 0) {
    return <p className="p-4 text-destructive">ID de filme inválido.</p>
  }

  if (detailsQuery.isPending) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Carregando detalhes do filme...</p>
      </div>
    )
  }

  if (detailsQuery.isError || !movie) {
    return (
      <div className="p-4">
        <p className="text-sm text-destructive">
          Não foi possível carregar os detalhes deste filme.
        </p>
      </div>
    )
  }

  const posterUrl = tmdbPosterUrl(movie.poster_path, 'w342')
  const inWatchlist = watchlistActions.isInWatchlist(movie.id)

  return (
    <div className="space-y-6 p-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{movie.title}</h1>
        <p className="text-sm text-muted-foreground">
          Nota {movie.vote_average.toFixed(1)} • Lançamento {movie.release_date || '—'}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="overflow-hidden rounded-md border bg-muted/20">
          {posterUrl ? (
            <img src={posterUrl} alt={`Pôster de ${movie.title}`} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full min-h-[320px] place-items-center text-sm text-muted-foreground">
              Sem pôster
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm leading-6">{movie.overview || 'Sem sinopse disponível.'}</p>

          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <Button
            type="button"
            onClick={() => {
              watchlistActions.toggleFromMovie({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                genre_ids: movie.genres.map((genre) => genre.id),
              })
            }}
          >
            {inWatchlist ? 'Remover do dashboard' : 'Adicionar ao dashboard'}
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Elenco</h2>
        {castContent}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Trailer</h2>
        {trailer ? (
          <a
            href={`https://www.youtube.com/watch?v=${trailer.key}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Assistir trailer: {trailer.name}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">Trailer não disponível.</p>
        )}
      </section>

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          showToast({
            variant: 'info',
            message: 'Use o menu lateral para voltar para Discovery ou Dashboard.',
          })
        }
      >
        Dica de navegação
      </Button>
    </div>
  )
}
