export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  popular: (page: number) =>
    [...movieKeys.lists(), 'popular', { page }] as const,
  trending: (page: number, timeWindow: 'day' | 'week') =>
    [...movieKeys.lists(), 'trending', { page, timeWindow }] as const,
  discover: (params: {
    page: number
    genreId: number | null
    year: number | null
    minVote: number | null
  }) => [...movieKeys.lists(), 'discover', params] as const,
  search: (params: {
    page: number
    query: string
    genreId: number | null
    year: number | null
    minVote: number | null
    pageSize: number
  }) => [...movieKeys.lists(), 'search', params] as const,
  /** `q` + filtros: cache da lista filtrada completa (sem `page` da UI). */
  searchAggregated: (params: {
    query: string
    genreId: number | null
    year: number | null
    minVote: number | null
    pageSize: number
  }) => [...movieKeys.lists(), 'search-aggregated', params] as const,
  genres: (language: string) =>
    [...movieKeys.all, 'genres', { language }] as const,
  detail: (movieId: number, language: string) =>
    [...movieKeys.all, 'detail', { movieId, language }] as const,
  credits: (movieId: number, language: string) =>
    [...movieKeys.all, 'credits', { movieId, language }] as const,
  videos: (movieId: number, language: string) =>
    [...movieKeys.all, 'videos', { movieId, language }] as const,
  similar: (movieId: number, language: string, page: number) =>
    [...movieKeys.all, 'similar', { movieId, language, page }] as const,
}
