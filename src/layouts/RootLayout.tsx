import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuthStore } from '@/features/auth/store'
import { AuthenticatedShell } from '@/layouts/AuthenticatedShell'
import { PublicShell } from '@/layouts/PublicShell'

export function RootLayout() {
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = Boolean(token)

  return (
    <TooltipProvider>
      {isAuthenticated ? <AuthenticatedShell /> : <PublicShell />}
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </TooltipProvider>
  )
}
