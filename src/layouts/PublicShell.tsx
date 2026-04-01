import { Outlet } from '@tanstack/react-router'

import { ThemeToggle } from '@/components/theme-toggle'

export function PublicShell() {
  return (
    <>
      <div className="pointer-events-none fixed right-3 top-3 z-50 md:right-4 md:top-4">
        <div className="pointer-events-auto">
          <ThemeToggle variant="outline" />
        </div>
      </div>
      <Outlet />
    </>
  )
}
