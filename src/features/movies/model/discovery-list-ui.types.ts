import type { DiscoveryListMode } from './discovery-list-params'

/**
 * Forma de estado de UI partilhada entre toolbars de lista (ex.: filtros do Discovery)
 * e tipos estáveis de domínio em `DiscoveryListParams`.
 */
export type DiscoveryListUiState = {
  readonly searchRaw: string
  readonly mode: DiscoveryListMode
  readonly page: number
  readonly genreId: number | null
  readonly year: number | null
  readonly minVote: number | null
}
