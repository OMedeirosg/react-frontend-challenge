export type DiscoveryListMode = 'popular' | 'trending' | 'discover'

export type DiscoveryListParams = {
  readonly mode: DiscoveryListMode
  readonly page: number
  /** Texto já debounced (valor “commitado” para a query). */
  readonly query: string
  readonly genreId: number | null
  readonly year: number | null
  /** 0..10 (TMDB vote_average) */
  readonly minVote: number | null
}

export const DEFAULT_DISCOVERY_LIST_PARAMS: DiscoveryListParams = {
  mode: 'discover',
  page: 1,
  query: '',
  genreId: null,
  year: null,
  minVote: null,
} as const

function clampInt(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(n)))
}

function clampNumber(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function normalizeDiscoveryListParams(
  raw: DiscoveryListParams,
): DiscoveryListParams {
  const q = raw.query.trim()
  return {
    mode: raw.mode,
    page: clampInt(raw.page, 1, 500), // TMDB costuma limitar pages; 500 é teto seguro
    query: q,
    genreId:
      raw.genreId == null ? null : clampInt(raw.genreId, 1, Number.MAX_SAFE_INTEGER),
    year: raw.year == null ? null : clampInt(raw.year, 1878, 2100),
    minVote:
      raw.minVote == null ? null : clampNumber(raw.minVote, 0, 10),
  }
}

