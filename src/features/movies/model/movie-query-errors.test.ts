import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ApiError } from '@/lib/api'

import { TmdbContractError } from '../contracts/tmdb.contracts'
import {
  curatedErrorToastMessage,
  curatedListInlineErrorMessage,
  discoveryErrorToastMessage,
  discoveryListInlineErrorMessage,
  movieCreditsInlineErrorMessage,
  movieDetailErrorMessage,
  movieQueryErrorToastKey,
} from './movie-query-errors'

function contractErr(): TmdbContractError {
  const r = z.string().safeParse(123)
  if (r.success) throw new Error('expected zod fail')
  return new TmdbContractError('GET /test', 'response', r.error)
}

describe('movie-query-errors', () => {
  it('movieQueryErrorToastKey distingue Api, contrato e desconhecido', () => {
    expect(movieQueryErrorToastKey(new ApiError(404, null))).toBe('api-404')
    expect(movieQueryErrorToastKey(contractErr())).toBe('contract-response')
    expect(movieQueryErrorToastKey(new Error('x'))).toBe('unknown')
  })

  it('mensagens inline discovery diferenciam HTTP e contrato', () => {
    expect(discoveryListInlineErrorMessage(new ApiError(503, null))).toContain(
      '503',
    )
    expect(discoveryListInlineErrorMessage(contractErr())).toContain(
      'formato inesperado',
    )
  })

  it('toast discovery cobre contrato', () => {
    expect(discoveryErrorToastMessage(contractErr())).toContain('validar')
  })

  it('curated inline e toast cobrem Popular/Trending', () => {
    expect(curatedListInlineErrorMessage(new ApiError(500, null), 'popular')).toContain(
      '500',
    )
    expect(curatedListInlineErrorMessage(contractErr(), 'trending')).toContain(
      'Trending',
    )
    expect(curatedErrorToastMessage(contractErr(), 'popular')).toContain(
      'Popular',
    )
  })

  it('detalhe e elenco não expõem detalhes internos', () => {
    expect(movieDetailErrorMessage(contractErr())).not.toContain('Zod')
    expect(movieCreditsInlineErrorMessage(new ApiError(403, null))).toContain(
      '403',
    )
    expect(movieCreditsInlineErrorMessage(contractErr())).toContain('elenco')
  })
})
