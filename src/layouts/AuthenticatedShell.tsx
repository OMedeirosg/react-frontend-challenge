import { Outlet } from '@tanstack/react-router'

import { AppFooter } from '@/features/navigation/ui/app-footer'
import { AppTopBar } from '@/features/navigation/ui/app-top-bar'

export function AuthenticatedShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppTopBar />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
