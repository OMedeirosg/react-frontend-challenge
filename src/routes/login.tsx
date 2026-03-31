import { createFileRoute, redirect } from '@tanstack/react-router'

import { useAuthStore } from '@/features/auth/store'
import { LoginPage } from '@/pages/login/ui/LoginPage'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (useAuthStore.getState().token) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})
