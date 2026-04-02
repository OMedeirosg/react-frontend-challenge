import { Suspense, lazy } from 'react'

import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuthStore } from '@/features/auth/store'
import { AuthenticatedShell } from '@/layouts/AuthenticatedShell'
import { PublicShell } from '@/layouts/PublicShell'

const LazyAppDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@/dev/app-devtools').then((m) => ({ default: m.AppDevtools })),
    )
  : () => null

export function RootLayout() {
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = Boolean(token)

  return (
    <TooltipProvider>
      {isAuthenticated ? <AuthenticatedShell /> : <PublicShell />}
      <Toaster />
      {import.meta.env.DEV ? (
        <Suspense fallback={null}>
          <LazyAppDevtools />
        </Suspense>
      ) : null}
    </TooltipProvider>
  )
}
