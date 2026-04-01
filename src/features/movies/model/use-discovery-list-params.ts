import { useEffect, useMemo, useState } from 'react'

import { useDebouncedValue } from '@/shared/lib/use-debounced-value'

import {
  DEFAULT_DISCOVERY_LIST_PARAMS,
  type DiscoveryListMode,
  type DiscoveryListParams,
  normalizeDiscoveryListParams,
} from './discovery-list-params'

export type UseDiscoveryListParamsOptions = {
  /** Debounce do texto de busca antes de virar `params.query`. */
  readonly searchDebounceMs?: number
  /** Estado inicial (geralmente vindo de URL params). */
  readonly initialState?: Partial<DiscoveryListUiState>
  /** Estado externo para reidratar em cenários como back/forward. */
  readonly controlledState?: Partial<DiscoveryListUiState>
}

export type DiscoveryListUiState = {
  readonly searchRaw: string
  readonly mode: DiscoveryListMode
  readonly page: number
  readonly genreId: number | null
  readonly year: number | null
  readonly minVote: number | null
}

export function useDiscoveryListParams(
  options: UseDiscoveryListParamsOptions = {},
): {
  readonly ui: DiscoveryListUiState
  readonly params: DiscoveryListParams
  readonly actions: {
    readonly setSearchRaw: (value: string) => void
    readonly setMode: (mode: DiscoveryListMode) => void
    readonly setGenreId: (value: number | null) => void
    readonly setYear: (value: number | null) => void
    readonly setMinVote: (value: number | null) => void
    readonly setPage: (page: number) => void
    readonly nextPage: () => void
    readonly prevPage: () => void
    readonly reset: () => void
  }
} {
  const { searchDebounceMs = 400, initialState, controlledState } = options

  const clampPage = (n: number) => Math.max(1, Math.trunc(n))

  const [searchRaw, setSearchRaw] = useState(initialState?.searchRaw ?? '')
  const [mode, setMode] = useState<DiscoveryListMode>(
    initialState?.mode ?? DEFAULT_DISCOVERY_LIST_PARAMS.mode,
  )
  const [page, setPage] = useState(
    initialState?.page ?? DEFAULT_DISCOVERY_LIST_PARAMS.page,
  )
  const [genreId, setGenreId] = useState<number | null>(initialState?.genreId ?? null)
  const [year, setYear] = useState<number | null>(initialState?.year ?? null)
  const [minVote, setMinVote] = useState<number | null>(initialState?.minVote ?? null)

  const queryDebounced = useDebouncedValue(searchRaw, searchDebounceMs)

  useEffect(() => {
    if (!controlledState) return
    if (controlledState.searchRaw !== undefined && controlledState.searchRaw !== searchRaw) {
      setSearchRaw(controlledState.searchRaw)
    }
    if (controlledState.mode !== undefined && controlledState.mode !== mode) {
      setMode(controlledState.mode)
    }
    if (controlledState.page !== undefined && controlledState.page !== page) {
      setPage(controlledState.page)
    }
    if (controlledState.genreId !== undefined && controlledState.genreId !== genreId) {
      setGenreId(controlledState.genreId)
    }
    if (controlledState.year !== undefined && controlledState.year !== year) {
      setYear(controlledState.year)
    }
    if (controlledState.minVote !== undefined && controlledState.minVote !== minVote) {
      setMinVote(controlledState.minVote)
    }
  }, [controlledState, genreId, minVote, mode, page, searchRaw, year])

  const params = useMemo(() => {
    return normalizeDiscoveryListParams({
      mode,
      page: clampPage(page),
      query: queryDebounced,
      genreId,
      year,
      minVote,
    })
  }, [mode, page, queryDebounced, genreId, year, minVote])

  const ui: DiscoveryListUiState = useMemo(
    () => ({ searchRaw, mode, page: params.page, genreId, year, minVote }),
    [searchRaw, mode, params.page, genreId, year, minVote],
  )

  return {
    ui,
    params,
    actions: {
      setSearchRaw: (v) => {
        const next = v
        setSearchRaw(v)
        // Busca textual e filtros avançados são fluxos distintos na UI.
        if (next.trim().length > 0) {
          setGenreId(null)
          setYear(null)
          setMinVote(null)
        }
        setPage(1)
      },
      setMode: (m) => {
        setMode(m)
        setPage(1)
      },
      setGenreId: (v) => {
        setGenreId(v)
        if (v != null) {
          setSearchRaw('')
        }
        setPage(1)
      },
      setYear: (v) => {
        setYear(v)
        if (v != null) {
          setSearchRaw('')
        }
        setPage(1)
      },
      setMinVote: (v) => {
        setMinVote(v)
        if (v != null) {
          setSearchRaw('')
        }
        setPage(1)
      },
      setPage: (p) => setPage(clampPage(p)),
      nextPage: () => setPage((p) => clampPage(p + 1)),
      prevPage: () => setPage((p) => clampPage(p - 1)),
      reset: () => {
        setSearchRaw('')
        setMode(DEFAULT_DISCOVERY_LIST_PARAMS.mode)
        setPage(DEFAULT_DISCOVERY_LIST_PARAMS.page)
        setGenreId(null)
        setYear(null)
        setMinVote(null)
      },
    },
  }
}

