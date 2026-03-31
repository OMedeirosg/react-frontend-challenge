import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

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
            <div className="flex-1">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <Outlet />
      )}
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </TooltipProvider>
  )
}
