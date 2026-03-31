import { render } from '@testing-library/react'
import { createMemoryHistory } from '@tanstack/history'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from '@/routeTree.gen'
import { useAuthStore } from '@/features/auth/store'
import { useWatchlistStore } from '@/features/movies/model/watchlist-store'
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
  useWatchlistStore.persist.clearStorage()
  useWatchlistStore.setState({ items: [] })
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
