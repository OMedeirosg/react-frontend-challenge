import { useEffect, useRef } from 'react'

import { useToastStore } from '@/shared/model/toast-store'

import {
  discoveryErrorToastMessage,
  movieQueryErrorToastKey,
} from './movie-query-errors'
import { useDiscoveryMovies } from '../queries'
import type { DiscoveryListParams } from './discovery-list-params'

type UseDiscoveryFeedbackParams = {
  params: DiscoveryListParams
  moviesQuery: ReturnType<typeof useDiscoveryMovies>
}

/** Toast + inline: dedupe por movieQueryErrorToastKey; inline mantém contexto na tabela. */
export function useDiscoveryFeedback(
  args: Readonly<UseDiscoveryFeedbackParams>,
) {
  const { params, moviesQuery } = args
  const showToast = useToastStore((s) => s.showToast)
  const lastErrorToastRef = useRef<string | null>(null)
  const lastEmptyToastRef = useRef<string | null>(null)
  const hasQuery = params.query.length > 0

  const emptyMessage = hasQuery
    ? `Ainda não achamos o que você procura para "${params.query}". Tente ajustar os filtros para ampliar os resultados.`
    : 'Ainda não achamos o que você procura. Tente ajustar os filtros para ampliar os resultados.'

  useEffect(() => {
    if (!moviesQuery.isError) {
      lastErrorToastRef.current = null
      return
    }
    const errorKey = movieQueryErrorToastKey(moviesQuery.error)

    if (lastErrorToastRef.current === errorKey) return
    lastErrorToastRef.current = errorKey

    showToast({
      variant: 'error',
      message: discoveryErrorToastMessage(moviesQuery.error),
    })
  }, [moviesQuery.error, moviesQuery.isError, showToast])

  useEffect(() => {
    if (moviesQuery.isPending || moviesQuery.isError) return
    if (moviesQuery.data?.results.length !== 0) {
      lastEmptyToastRef.current = null
      return
    }
    const emptyKey = hasQuery
      ? `search-${params.query}`
      : `filters-${params.genreId ?? 'all'}-${params.year ?? 'all'}-${params.minVote ?? 'all'}`

    if (lastEmptyToastRef.current === emptyKey) return
    lastEmptyToastRef.current = emptyKey
    showToast({
      variant: 'info',
      message: 'Sem resultados no momento. Tente ajustar os filtros para ampliar os resultados.',
    })
  }, [
    hasQuery,
    moviesQuery.data?.results.length,
    moviesQuery.isError,
    moviesQuery.isPending,
    params.genreId,
    params.minVote,
    params.query,
    params.year,
    showToast,
  ])

  return { emptyMessage }
}
