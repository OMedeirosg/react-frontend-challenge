import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { LogOut, Popcorn } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  authenticatedSidebarFutureItems,
  authenticatedSidebarRouteItems,
} from '@/features/navigation/model/sidebar-items'
import { useAuthStore } from '@/features/auth/store'
import { useToastStore } from '@/shared/model/toast-store'

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const showToast = useToastStore((state) => state.showToast)

  const handleLogout = async () => {
    logout()
    showToast({ variant: 'success', message: 'Sessão encerrada com sucesso.' })
    await navigate({ to: '/login' })
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-11" tooltip="CineDash">
              <Popcorn />
              <span className="text-base font-semibold tracking-tight">CineDash</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {authenticatedSidebarRouteItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to)

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link to={item.to}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              {authenticatedSidebarFutureItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      aria-disabled
                      disabled
                      tooltip={item.hint ?? item.label}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sair">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
