import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/features/auth/store'
import { useToastStore } from '@/shared/model/toast-store'

export function RootLayout() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const showToast = useToastStore((state) => state.showToast)
  const isAuthenticated = Boolean(token)

  const handleLogout = async () => {
    logout()
    showToast({ variant: 'success', message: 'Sessão encerrada com sucesso.' })
    await navigate({ to: '/login' })
  }

  return (
    <>
      <div className="flex items-center gap-2 p-2 text-lg">
        {isAuthenticated ? (
          <>
            <Link
              to="/"
              activeProps={{ className: 'font-bold' }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>{' '}
            <Link to="/discovery" activeProps={{ className: 'font-bold' }}>
              Discovery
            </Link>{' '}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/register" activeProps={{ className: 'font-bold' }}>
              Criar conta
            </Link>{' '}
            <Link to="/login" activeProps={{ className: 'font-bold' }}>
              Login
            </Link>
          </>
        )}
      </div>
      <hr />
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
