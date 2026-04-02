import { type LucideIcon, Compass, Film, ListChecks } from 'lucide-react'

export type SidebarRouteItem = {
  id: string
  label: string
  to: '/' | '/discovery' | '/watchlist'
  icon: LucideIcon
  enabled: boolean
}

export type SidebarFutureItem = {
  id: string
  label: string
  icon: LucideIcon
  enabled: false
  hint?: string
}

export const authenticatedSidebarRouteItems: SidebarRouteItem[] = [
  {
    id: 'top-movies',
    label: 'Top Movies',
    to: '/',
    icon: Film,
    enabled: true,
  },
  {
    id: 'discovery',
    label: 'Discovery',
    to: '/discovery',
    icon: Compass,
    enabled: true,
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    to: '/watchlist',
    icon: ListChecks,
    enabled: true,
  },
]

export const authenticatedSidebarFutureItems: SidebarFutureItem[] = []
