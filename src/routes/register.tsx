import { createFileRoute, redirect } from '@tanstack/react-router'

import { useAuthStore } from '@/features/auth/store'
import { RegisterPage } from '@/pages/register/ui/RegisterPage'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    await useAuthStore.persist.rehydrate()
    if (useAuthStore.getState().token) {
      throw redirect({ to: '/' })
    }
  },
  component: RegisterPage,
})
