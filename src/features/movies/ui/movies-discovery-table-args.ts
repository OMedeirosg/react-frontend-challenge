import type { ReactNode } from 'react'

import type { MovieGenre, MovieListItem } from '../types'
import type { MoviesTableActions } from './movies-discovery-table-columns'

export type UseMoviesDiscoveryTableArgs = {
  readonly movies: MovieListItem[]
  readonly genres?: MovieGenre[]
  readonly isLoading?: boolean
  readonly actions?: MoviesTableActions
  readonly viewMode?: 'catalog' | 'watchlist'
  readonly totalResults?: number
  readonly externalPagination?: {
    readonly page: number
    readonly totalPages?: number
    readonly onPrevPage: () => void
    readonly onNextPage: () => void
    readonly disablePrev?: boolean
    readonly disableNext?: boolean
  }
  readonly className?: string
  /** Filtros da página (esquerda); alterna apenas dados, não colunas da grade. */
  readonly filtersSlot?: ReactNode
  /** Conteúdo exibido no card quando não há filmes e não está carregando. */
  readonly emptyState?: ReactNode
  /**
   * Quando este valor muda, a paginação local da tabela volta à primeira página.
   * Deve refletir o “contexto” da lista (URL/query, página da API, filtros aplicados),
   * não a referência do array `movies` (refetch pode criar novo array com os mesmos dados).
   */
  readonly paginationResetKey?: string
  /** Prefetch do detalhe TMDB ao passar o rato na linha (ex.: antes de abrir `/movie/$id`). */
  readonly onPrefetchMovieDetail?: (movieId: number) => void
}
