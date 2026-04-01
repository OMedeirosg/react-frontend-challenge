import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError, api } from '@/lib/api'

import { getPopularMovies } from './tmdbMovies'
import { TmdbContractError } from './types'

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>()
  return {
    ...actual,
    api: {
      ...actual.api,
      get: vi.fn(),
    },
  }
})

const validPaginatedBody = {
  page: 1,
  results: [
    {
      id: 1,
      title: 'Test',
      overview: '',
      poster_path: null,
      backdrop_path: null,
      vote_average: 7,
      release_date: '2020-01-01',
      genre_ids: [28],
    },
  ],
  total_pages: 1,
  total_results: 1,
}

describe('tmdbMovies adapter', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
  })

  it('faz parse de resposta válida e retorna objeto tipado', async () => {
    vi.mocked(api.get).mockResolvedValue(validPaginatedBody)

    const out = await getPopularMovies({ page: 1, language: 'pt-BR' })

    expect(out.page).toBe(1)
    expect(out.results[0]?.title).toBe('Test')
    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/^\/movie\/popular\?/),
      undefined,
    )
  })

  it('propaga ApiError HTTP (comportamento de api.get)', async () => {
    vi.mocked(api.get).mockRejectedValue(new ApiError(404, null))

    await expect(getPopularMovies()).rejects.toThrow(ApiError)
  })

  it('lança TmdbContractError quando o JSON não bate com o contrato', async () => {
    vi.mocked(api.get).mockResolvedValue({ unexpected: true })

    await expect(getPopularMovies()).rejects.toThrow(TmdbContractError)
  })
})
