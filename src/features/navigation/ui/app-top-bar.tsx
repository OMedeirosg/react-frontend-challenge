import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import type { DiscoverySearch } from '@/features/movies/model/discovery-search-schema'
import { LogOut, Search } from 'lucide-react'
import { useState } from 'react'

import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authenticatedSidebarRouteItems } from '@/features/navigation/model/sidebar-items'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/features/auth/store'
import { useToastStore } from '@/shared/model/toast-store'

export function AppTopBar() {
  const [searchDraft, setSearchDraft] = useState('')
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
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-4 px-3 py-2 sm:px-4">
        <Link to="/" className="shrink-0">
          <Logo className="h-7 sm:h-8" />
        </Link>

        <nav aria-label="Navegação principal" className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex min-w-max items-center gap-1">
            {authenticatedSidebarRouteItems.map((item) => {
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to)

              return (
                <li key={item.id}>
                  <Button
                    asChild
                    variant="ghost"
                    className={cn(
                      'h-8 px-2 text-sm font-medium text-muted-foreground',
                      isActive && 'bg-muted text-foreground',
                    )}
                  >
                    <Link to={item.to}>{item.label}</Link>
                  </Button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <form
            onSubmit={async (event) => {
              event.preventDefault()
              await navigate({
                to: '/discovery',
                search: (prev: DiscoverySearch) => {
                  const q = searchDraft.trim()
                  return { ...prev, q: q || undefined, page: undefined }
                },
              })
              setSearchDraft('')
            }}
            className="flex items-center gap-1.5"
          >
            <Input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Buscar filmes"
              className="h-8 w-32 sm:w-44 md:w-52"
              aria-label="Buscar filmes"
            />
            <Button type="submit" variant="outline" size="icon" aria-label="Ir para discovery">
              <Search />
            </Button>
          </form>

          <ThemeToggle variant="outline" />

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  )
}
