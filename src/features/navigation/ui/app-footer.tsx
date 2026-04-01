import { Link } from '@tanstack/react-router'

import { Logo } from '@/components/logo'

export function AppFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-center px-4 py-4">
        <Link to="/" aria-label="CineDash home">
          <Logo className="h-7 opacity-90" />
        </Link>
      </div>
    </footer>
  )
}
