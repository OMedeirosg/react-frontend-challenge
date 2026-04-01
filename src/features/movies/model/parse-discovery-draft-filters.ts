import {
  discoveryDraftSchema,
  type DiscoveryDraftInput,
} from '@/features/movies/model/discovery-search-schema'

export type DiscoveryDraftToast = (args: {
  readonly variant: 'error'
  readonly message: string
}) => void

/**
 * Valida um rascunho de filtros com `discoveryDraftSchema` e mostra o primeiro erro num toast.
 * Usado em Home, Watchlist e Discovery; efeitos (navigate / setState) ficam no chamador.
 */
export function tryParseDiscoveryDraftFilters(
  draft: unknown,
  showToast: DiscoveryDraftToast,
): DiscoveryDraftInput | null {
  const parsed = discoveryDraftSchema.safeParse(draft)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message
    showToast({
      variant: 'error',
      message: first ?? 'Verifique os filtros antes de aplicar.',
    })
    return null
  }
  return parsed.data
}

export function discoveryDraftFiltersEqual(
  a: DiscoveryDraftInput,
  b: DiscoveryDraftInput,
): boolean {
  return (
    a.genreId === b.genreId && a.year === b.year && a.minVote === b.minVote
  )
}
