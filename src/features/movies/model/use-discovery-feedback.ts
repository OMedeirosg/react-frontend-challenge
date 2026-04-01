import { useEffect, useRef } from 'react'

import { ApiError } from '@/lib/api'
import { useToastStore } from '@/shared/model/toast-store'

import { useDiscoveryMovies } from '../queries'
import type { DiscoveryListParams } from './discovery-list-params'

type UseDiscoveryFeedbackParams = {
  params: DiscoveryListParams
  moviesQuery: ReturnType<typeof useDiscoveryMovies>
}

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
    const errorKey =
      moviesQuery.error instanceof ApiError
        ? `api-${moviesQuery.error.status}`
        : 'generic'

    if (lastErrorToastRef.current === errorKey) return
    lastErrorToastRef.current = errorKey

    const message =
      moviesQuery.error instanceof ApiError
        ? `Falha ao buscar filmes (erro ${moviesQuery.error.status}).`
        : 'Falha ao buscar filmes. Verifique a conexão e tente novamente.'
    showToast({ variant: 'error', message })
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
