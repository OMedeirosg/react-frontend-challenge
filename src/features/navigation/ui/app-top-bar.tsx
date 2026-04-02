import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import type { DiscoverySearch } from '@/features/movies/model/discovery-search-schema'
import { LogOut, Menu, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useIsMobile } from '@/hooks/use-mobile'

import { Logo } from '@/components/logo'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authenticatedSidebarRouteItems } from '@/features/navigation/model/sidebar-items'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/features/auth/store'
import { useToastStore } from '@/shared/model/toast-store'

/** Navegação principal em drawer abaixo deste breakpoint; `md` = 768px. */
const MOBILE_NAV_TAILWIND_BREAKPOINT = 'md'

function routeActive(pathname: string, to: string) {
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

export function AppTopBar() {
  const isMobile = useIsMobile()
  const [searchDraft, setSearchDraft] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileNavTriggerRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const showToast = useToastStore((state) => state.showToast)

  const handleLogout = async () => {
    logout()
    showToast({ variant: 'success', message: 'Sessão encerrada com sucesso.' })
    await navigate({ to: '/login' })
  }

  const closeMobileNav = () => {
    setMobileNavOpen(false)
  }

  const handleMobileNavOpenChange = (open: boolean) => {
    setMobileNavOpen(open)
    if (!open) {
      queueMicrotask(() => mobileNavTriggerRef.current?.focus())
    }
  }

  useEffect(() => {
    if (!isMobile) setMobileNavOpen(false)
  }, [isMobile])

  const navLinkClass = (active: boolean) =>
    cn(
      'h-8 px-2 text-sm font-medium text-muted-foreground',
      active && 'bg-muted text-foreground',
    )

  const sheetNavLinkClass = (active: boolean) =>
    cn(
      'h-10 w-full justify-start px-3 text-sm font-medium text-muted-foreground',
      active && 'bg-muted text-foreground',
    )

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div
        className={cn(
          'mx-auto flex min-w-0 w-full max-w-screen-2xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4',
        )}
      >
        {isMobile ? (
          <Sheet open={mobileNavOpen} onOpenChange={handleMobileNavOpenChange}>
            <SheetTrigger asChild>
              <Button
                ref={mobileNavTriggerRef}
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label="Abrir menu de navegação"
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-primary-nav"
              >
                <Menu className="size-4" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-[min(100vw,20rem)] flex-col gap-0 p-0"
            >
              <SheetHeader className="border-b border-border px-4 py-4">
                <SheetTitle className="sr-only">Navegação principal</SheetTitle>
                <Link to="/" onClick={closeMobileNav}>
                  <Logo className="h-8" />
                </Link>
              </SheetHeader>
              <nav
                id="mobile-primary-nav"
                className="flex flex-col gap-1 px-3 py-4"
                aria-label="Navegação principal"
              >
                <ul className="flex flex-col gap-1">
                  {authenticatedSidebarRouteItems.map((item) => {
                    const isActive = routeActive(location.pathname, item.to)
                    const Icon = item.icon
                    return (
                      <li key={item.id}>
                        <Button
                          asChild
                          variant="ghost"
                          className={sheetNavLinkClass(isActive)}
                        >
                          <Link to={item.to} onClick={closeMobileNav}>
                            <Icon className="size-4 shrink-0" aria-hidden />
                            {item.label}
                          </Link>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        ) : null}

        <Link
          to="/"
          className={`hidden shrink-0 ${MOBILE_NAV_TAILWIND_BREAKPOINT}:block`}
          onClick={closeMobileNav}
        >
          <Logo className="h-7 sm:h-8" />
        </Link>

        <nav
          aria-label="Navegação principal"
          className={`hidden min-w-0 md:block md:flex-1 md:overflow-x-auto`}
        >
          <ul className="flex min-w-max items-center gap-1">
            {authenticatedSidebarRouteItems.map((item) => {
              const isActive = routeActive(location.pathname, item.to)
              return (
                <li key={item.id}>
                  <Button
                    asChild
                    variant="ghost"
                    className={navLinkClass(isActive)}
                  >
                    <Link to={item.to}>{item.label}</Link>
                  </Button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 md:ml-0">
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
            className="flex min-w-0 items-center gap-1.5"
          >
            <Input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Buscar filmes"
              className="h-8 min-w-0 w-36 sm:w-44 md:w-52"
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
