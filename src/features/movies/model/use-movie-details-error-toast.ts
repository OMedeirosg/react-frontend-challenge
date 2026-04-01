import { useEffect, useRef } from 'react'

import { useToastStore } from '@/shared/model/toast-store'

import { useMovieDetails } from '../queries'
import {
  movieDetailErrorToastMessage,
  movieQueryErrorToastKey,
} from './movie-query-errors'

/**
 * Toast + inline na falha da query principal de detalhes (mesmo padrão de Discovery/Curated):
 * o usuário pode não notar só o bloco inline; o toast deduplica por movieQueryErrorToastKey.
 *
 * Elenco/vídeos: apenas inline na seção — evita vários toasts na mesma página.
 */
export function useMovieDetailsErrorToast(
  detailsQuery: ReturnType<typeof useMovieDetails>,
) {
  const showToast = useToastStore((s) => s.showToast)
  const lastErrorToastRef = useRef<string | null>(null)

  useEffect(() => {
    if (!detailsQuery.isError) {
      lastErrorToastRef.current = null
      return
    }
    const errorKey = movieQueryErrorToastKey(detailsQuery.error)
    if (lastErrorToastRef.current === errorKey) return
    lastErrorToastRef.current = errorKey
    showToast({
      variant: 'error',
      message: movieDetailErrorToastMessage(detailsQuery.error),
    })
  }, [detailsQuery.error, detailsQuery.isError, showToast])
}
