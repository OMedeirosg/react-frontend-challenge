import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { ThemeToggle } from '@/components/theme-toggle'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuthStore } from '@/features/auth/store'
import { AppSidebar } from '@/features/navigation/ui/app-sidebar'

export function RootLayout() {
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = Boolean(token)

  return (
    <TooltipProvider>
      {isAuthenticated ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-12 items-center border-b bg-background px-2 md:hidden">
              <SidebarTrigger />
            </header>
            <div className="min-w-0 flex-1 overflow-x-hidden">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <>
          <div className="pointer-events-none fixed right-3 top-3 z-50 md:right-4 md:top-4">
            <div className="pointer-events-auto">
              <ThemeToggle variant="outline" />
            </div>
          </div>
          <Outlet />
        </>
      )}
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </TooltipProvider>
  )
}
