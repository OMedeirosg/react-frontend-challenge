import { describe, expect, it } from 'vitest'

import {
  TMDB_IMAGE_BASE,
  tmdbPosterUrl,
} from '@/features/movies/lib/tmdb-poster-url'

describe('tmdbPosterUrl', () => {
  it('retorna null para null, undefined ou string vazia', () => {
    expect(tmdbPosterUrl(null, 'w92')).toBeNull()
    expect(tmdbPosterUrl(undefined, 'w92')).toBeNull()
    expect(tmdbPosterUrl('', 'w92')).toBeNull()
    expect(tmdbPosterUrl('   ', 'w92')).toBeNull()
  })

  it('monta URL com path que começa com barra', () => {
    expect(tmdbPosterUrl('/abc.jpg', 'w92')).toBe(
      `${TMDB_IMAGE_BASE}/w92/abc.jpg`,
    )
  })

  it('monta URL com path sem barra inicial', () => {
    expect(tmdbPosterUrl('abc.jpg', 'w185')).toBe(
      `${TMDB_IMAGE_BASE}/w185/abc.jpg`,
    )
  })

  it('aceita outros tamanhos válidos', () => {
    expect(tmdbPosterUrl('/x.png', 'w342')).toBe(
      `${TMDB_IMAGE_BASE}/w342/x.png`,
    )
    expect(tmdbPosterUrl('/x.png', 'w500')).toBe(
      `${TMDB_IMAGE_BASE}/w500/x.png`,
    )
  })
})
