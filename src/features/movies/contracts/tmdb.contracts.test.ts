import { describe, expect, it } from 'vitest'

import {
  discoverMoviesRequestSchema,
  movieDetailsResponseSchema,
  paginatedMoviesResponseSchema,
  parseTmdbRequest,
  parseTmdbResponse,
  searchMoviesRequestSchema,
  TmdbContractError,
} from './tmdb.contracts'

const validListItem = {
  id: 550,
  title: 'Fight Club',
  overview: 'A ticking-time-bomb insomniac...',
  poster_path: '/path.jpg',
  backdrop_path: null,
  vote_average: 8.4,
  release_date: '1999-10-15',
  genre_ids: [18, 53],
}

const validPaginated = {
  page: 1,
  results: [validListItem],
  total_pages: 10,
  total_results: 200,
}

describe('searchMoviesRequestSchema', () => {
  it('aceita query trim e defaults', () => {
    const out = searchMoviesRequestSchema.parse({
      query: '  matrix  ',
    })
    expect(out.query).toBe('matrix')
    expect(out.page).toBe(1)
    expect(out.language).toBe('pt-BR')
    expect(out.includeAdult).toBe(false)
  })

  it('rejeita query vazia', () => {
    const r = searchMoviesRequestSchema.safeParse({ query: '   ' })
    expect(r.success).toBe(false)
  })
})

describe('discoverMoviesRequestSchema', () => {
  it('rejeita page fora do intervalo TMDB', () => {
    const r = discoverMoviesRequestSchema.safeParse({ page: 501 })
    expect(r.success).toBe(false)
  })
})

describe('paginatedMoviesResponseSchema', () => {
  it('aceita payload válido', () => {
    const out = paginatedMoviesResponseSchema.parse(validPaginated)
    expect(out.results[0]?.title).toBe('Fight Club')
  })

  it('rejeita item sem campos obrigatórios', () => {
    const r = paginatedMoviesResponseSchema.safeParse({
      page: 1,
      results: [{ id: 1 }],
      total_pages: 1,
      total_results: 1,
    })
    expect(r.success).toBe(false)
  })
})

describe('movieDetailsResponseSchema', () => {
  it('aceita detalhes mínimos esperados pela UI', () => {
    const out = movieDetailsResponseSchema.parse({
      id: 550,
      title: 'Fight Club',
      overview: '…',
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.4,
      release_date: '1999-10-15',
      genres: [{ id: 18, name: 'Drama' }],
    })
    expect(out.genres[0]?.name).toBe('Drama')
  })
})

describe('parseTmdbRequest / parseTmdbResponse', () => {
  it('lança TmdbContractError em request inválido', () => {
    expect(() =>
      parseTmdbRequest(searchMoviesRequestSchema, { query: '' }, 'TEST'),
    ).toThrow(TmdbContractError)
  })

  it('lança TmdbContractError em response inválido', () => {
    expect(() =>
      parseTmdbResponse(paginatedMoviesResponseSchema, {}, 'TEST'),
    ).toThrow(TmdbContractError)
  })

  it('preserva fase request vs response no erro', () => {
    try {
      parseTmdbRequest(searchMoviesRequestSchema, { query: '' }, 'GET /x')
    } catch (e) {
      expect(e).toBeInstanceOf(TmdbContractError)
      expect((e as TmdbContractError).phase).toBe('request')
      expect((e as TmdbContractError).endpoint).toBe('GET /x')
    }
  })
})
