import { createFileRoute, redirect } from '@tanstack/react-router'

import { useAuthStore } from '@/features/auth/store'
import { RegisterPage } from '@/pages/register/ui/RegisterPage'
import { RoutePendingAuthPage } from '@/shared/ui/route-pending-fallback'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (useAuthStore.getState().token) {
      throw redirect({ to: '/' })
    }
  },
  pendingComponent: RoutePendingAuthPage,
  component: RegisterPage,
})
