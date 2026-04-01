import { render } from '@testing-library/react'
import { createMemoryHistory } from '@tanstack/history'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from '@/routeTree.gen'
import { useAuthStore } from '@/features/auth/store'
import {
  clearAllWatchlistStorageKeys,
  useWatchlistStore,
} from '@/features/movies/model/watchlist-store'
import { usePageSizeStore } from '@/shared/model/page-size-store'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'

/** Limpa cookie persistido e repõe o estado in-memory da auth. */
export function resetAuthStore() {
  useAuthStore.persist.clearStorage()
  useAuthStore.setState({
    accounts: {},
    token: null,
    currentUserEmail: null,
  })
}

export function resetWatchlistStore() {
  clearAllWatchlistStorageKeys()
  useWatchlistStore.setState({ items: [] })
}

/** Garante tamanho de página padrão na tabela (evita vazamento de localStorage entre testes). */
export function resetPageSizeStore() {
  usePageSizeStore.persist.clearStorage()
  usePageSizeStore.setState({ pageSize: 20 })
}

export function createTestRouter(initialPath: string) {
  const history = createMemoryHistory({ initialEntries: [initialPath] })
  return createRouter({ routeTree, history })
}

export function renderWithApp(initialPath: string) {
  const router = createTestRouter(initialPath)
  const result = render(
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>,
  )
  return { ...result, router }
}
