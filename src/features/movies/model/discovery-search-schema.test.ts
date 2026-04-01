import { describe, expect, it } from 'vitest'

import {
  discoveryDraftSchema,
  discoveryUrlSearchSchema,
} from './discovery-search-schema'

describe('discoveryUrlSearchSchema', () => {
  it('normaliza minVote com vírgula (PT-BR) na URL', () => {
    const out = discoveryUrlSearchSchema.parse({
      minVote: '8,4',
    })
    expect(out.minVote).toBeCloseTo(8.4)
  })

  it('aceita objeto vazio', () => {
    const out = discoveryUrlSearchSchema.parse({})
    expect(out.q).toBeUndefined()
  })
})

describe('discoveryDraftSchema', () => {
  it('aceita filtros nulos e ano 2017', () => {
    const out = discoveryDraftSchema.parse({
      genreId: null,
      year: 2017,
      minVote: null,
    })
    expect(out.year).toBe(2017)
  })

  it('rejeita ano fora do intervalo', () => {
    const r = discoveryDraftSchema.safeParse({
      genreId: null,
      year: 1700,
      minVote: null,
    })
    expect(r.success).toBe(false)
  })

  it('rejeita nota mínima acima de 10', () => {
    const r = discoveryDraftSchema.safeParse({
      genreId: null,
      year: null,
      minVote: 11,
    })
    expect(r.success).toBe(false)
  })
})
