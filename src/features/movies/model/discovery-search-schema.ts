import { z } from 'zod'

import {
  DEFAULT_DISCOVERY_LIST_PARAMS,
  normalizeDiscoveryListParams,
  type DiscoveryListMode,
  type DiscoveryListParams,
} from './discovery-list-params'

export type DiscoverySearch = {
  q?: string
  mode?: DiscoveryListMode
  page?: number
  genre?: number
  year?: number
  minVote?: number
}

function parseMode(value: unknown): DiscoveryListMode | undefined {
  return value === 'popular' || value === 'trending' || value === 'discover'
    ? value
    : undefined
}

function parseOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const normalized = value.trim().replace(',', '.')
    const parsed = Number(normalized)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function toSparseSearch(normalized: DiscoveryListParams): DiscoverySearch {
  return {
    q: normalized.query || undefined,
    mode:
      normalized.mode === DEFAULT_DISCOVERY_LIST_PARAMS.mode
        ? undefined
        : normalized.mode,
    page:
      normalized.page === DEFAULT_DISCOVERY_LIST_PARAMS.page
        ? undefined
        : normalized.page,
    genre: normalized.genreId ?? undefined,
    year: normalized.year ?? undefined,
    minVote: normalized.minVote ?? undefined,
  }
}

/**
 * Entrada bruta da query string da rota `/discovery`.
 * Usa Zod + `normalizeDiscoveryListParams` para manter o mesmo comportamento de clamp/normalização.
 */
export const discoveryUrlSearchSchema = z
  .object({
    q: z.unknown().optional(),
    mode: z.unknown().optional(),
    page: z.unknown().optional(),
    genre: z.unknown().optional(),
    year: z.unknown().optional(),
    minVote: z.unknown().optional(),
  })
  .transform((raw): DiscoverySearch => {
    const normalized = normalizeDiscoveryListParams({
      query: typeof raw.q === 'string' ? raw.q : '',
      mode: parseMode(raw.mode) ?? DEFAULT_DISCOVERY_LIST_PARAMS.mode,
      page: parseOptionalNumber(raw.page) ?? DEFAULT_DISCOVERY_LIST_PARAMS.page,
      genreId: parseOptionalNumber(raw.genre) ?? null,
      year: parseOptionalNumber(raw.year) ?? null,
      minVote: parseOptionalNumber(raw.minVote) ?? null,
    })
    return toSparseSearch(normalized)
  })

/** Filtros locais antes de aplicar na URL (botão "Aplicar filtros"). */
export const discoveryDraftSchema = z.object({
  genreId: z.union([z.number().int().positive(), z.null()]),
  year: z.union([
    z.null(),
    z.number().int().min(1878).max(2100),
  ]),
  minVote: z.union([z.null(), z.number().min(0).max(10)]),
})

export type DiscoveryDraftInput = z.infer<typeof discoveryDraftSchema>
