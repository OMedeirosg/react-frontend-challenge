import { describe, expect, it, vi } from 'vitest'

import {
  discoveryDraftFiltersEqual,
  tryParseDiscoveryDraftFilters,
} from '@/features/movies/model/parse-discovery-draft-filters'

describe('tryParseDiscoveryDraftFilters', () => {
  it('returns parsed data when draft is valid', () => {
    const showToast = vi.fn()
    const result = tryParseDiscoveryDraftFilters(
      { genreId: 28, year: 2020, minVote: 7 },
      showToast,
    )
    expect(result).toEqual({ genreId: 28, year: 2020, minVote: 7 })
    expect(showToast).not.toHaveBeenCalled()
  })

  it('returns null and toasts on invalid draft', () => {
    const showToast = vi.fn()
    const result = tryParseDiscoveryDraftFilters(
      { genreId: -1, year: null, minVote: null },
      showToast,
    )
    expect(result).toBeNull()
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    )
  })
})

describe('discoveryDraftFiltersEqual', () => {
  it('compares genre, year and min vote', () => {
    const a = { genreId: 1 as number | null, year: 2020 as number | null, minVote: null as number | null }
    const b = { genreId: 1 as number | null, year: 2020 as number | null, minVote: null as number | null }
    expect(discoveryDraftFiltersEqual(a, b)).toBe(true)
    expect(
      discoveryDraftFiltersEqual(a, { ...b, year: 2021 }),
    ).toBe(false)
  })
})
