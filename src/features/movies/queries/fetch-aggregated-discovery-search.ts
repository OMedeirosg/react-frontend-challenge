import type { DiscoveryListParams } from '../model/discovery-list-params'
import type { MovieListItem } from '../types'
import {
  appendUniqueMatch,
  MAX_AGGREGATED_API_PAGES,
  movieMatchesDiscoveryFilters,
  type AggregatedSearchListPayload,
} from '../model/aggregated-discovery-search'
import { searchMovies } from '../tmdbMovies'

export async function fetchAggregatedSearchMatches(
  params: DiscoveryListParams,
  signal: AbortSignal | undefined,
): Promise<AggregatedSearchListPayload> {
  const language = 'pt-BR'
  const matches: MovieListItem[] = []
  const seen = new Set<number>()

  for (let apiPage = 1; apiPage <= MAX_AGGREGATED_API_PAGES; apiPage++) {
    signal?.throwIfAborted()
    const response = await searchMovies({
      query: params.query,
      page: apiPage,
      language,
      includeAdult: false,
      signal,
    })

    for (const movie of response.results) {
      if (!movieMatchesDiscoveryFilters(movie, params)) continue
      appendUniqueMatch(seen, matches, movie)
    }

    if (apiPage >= response.total_pages) break
  }

  return { matches }
}
