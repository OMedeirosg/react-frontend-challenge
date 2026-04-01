import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ApiError, RateLimitError } from '@/lib/api'

import { TmdbContractError } from '../contracts/tmdb.contracts'
import {
  curatedErrorToastMessage,
  curatedListInlineErrorMessage,
  discoveryErrorToastMessage,
  discoveryListInlineErrorMessage,
  movieCreditsInlineErrorMessage,
  movieDetailErrorMessage,
  movieDetailErrorToastMessage,
  movieQueryErrorToastKey,
  tmdbRateLimitUserMessage,
} from './movie-query-errors'

function contractErr(): TmdbContractError {
  const r = z.string().safeParse(123)
  if (r.success) throw new Error('expected zod fail')
  return new TmdbContractError('GET /test', 'response', r.error)
}

describe('movie-query-errors', () => {
  it('movieQueryErrorToastKey distingue Api, contrato e desconhecido', () => {
    expect(movieQueryErrorToastKey(new ApiError(404, null))).toBe('api-404')
    expect(movieQueryErrorToastKey(new RateLimitError(null))).toBe('api-429')
    expect(movieQueryErrorToastKey(new ApiError(429, null))).toBe('api-429')
    expect(movieQueryErrorToastKey(contractErr())).toBe('contract-response')
    expect(movieQueryErrorToastKey(new Error('x'))).toBe('unknown')
  })

  it('429 usa mensagem de limite sem código HTTP genérico', () => {
    expect(discoveryListInlineErrorMessage(new RateLimitError(null))).toBe(
      tmdbRateLimitUserMessage,
    )
    expect(discoveryErrorToastMessage(new ApiError(429, null))).toBe(
      tmdbRateLimitUserMessage,
    )
    expect(discoveryListInlineErrorMessage(new ApiError(429, null))).not.toContain(
      '429',
    )
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

  it('toast de detalhe do filme cobre API e contrato', () => {
    expect(movieDetailErrorToastMessage(new ApiError(502, null))).toContain('502')
    expect(movieDetailErrorToastMessage(contractErr())).toContain('validar')
  })
})
