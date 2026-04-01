import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import type { MovieDetails } from '@/features/movies/types'
import { useToastStore } from '@/shared/model/toast-store'

type WatchlistActionsApi = ReturnType<
  typeof import('../model/use-watchlist-actions').useWatchlistActions
>

type ShowToast = ReturnType<typeof useToastStore.getState>['showToast']

export type MovieDetailsLoadedProps = {
  readonly movie: MovieDetails
  readonly posterUrl: string | null
  readonly inWatchlist: boolean
  readonly watchlistActions: WatchlistActionsApi
  readonly showToast: ShowToast
  readonly castContent: ReactNode
  readonly trailerBlock: ReactNode
}

export function MovieDetailsLoaded(props: Readonly<MovieDetailsLoadedProps>) {
  const {
    movie,
    posterUrl,
    inWatchlist,
    watchlistActions,
    showToast,
    castContent,
    trailerBlock,
  } = props

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
            <img
              src={posterUrl}
              alt={`Pôster de ${movie.title}`}
              className="h-full w-full object-cover"
            />
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
        {trailerBlock}
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
