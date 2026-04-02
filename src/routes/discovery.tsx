import {
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'

import { useAuthStore } from '@/features/auth/store'
import {
  discoveryUrlSearchSchema,
  type DiscoverySearch,
} from '@/features/movies/model/discovery-search-schema'
import { useDiscoveryRouteState } from '@/features/movies/model/use-discovery-route-state'
import { DiscoveryPageView } from '@/features/movies/ui/discovery-page-view'
import { RoutePendingTablePage } from '@/shared/ui/route-pending-fallback'

export const Route = createFileRoute('/discovery')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  validateSearch: (search): DiscoverySearch => {
    return discoveryUrlSearchSchema.parse(search)
  },
  pendingComponent: RoutePendingTablePage,
  component: DiscoveryComponent,
})

function DiscoveryComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const ctx = useDiscoveryRouteState(search, navigate)

  return <DiscoveryPageView ctx={ctx} />
}
