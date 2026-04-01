import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useAuthStore } from '@/features/auth/store'
import { renderWithApp, resetAuthStore } from '@/test/test-utils'

async function setAuthenticatedUser() {
  await useAuthStore.getState().register('shell@test.com', 'secret12')
  await useAuthStore.getState().login('shell@test.com', 'secret12')
}

describe('shell layout and topbar', () => {
  beforeEach(() => {
    resetAuthStore()
  })

  it('deslogado em rota pública não exibe navegação autenticada', async () => {
    renderWithApp('/login')

    await waitFor(() => {
      expect(screen.getByText('Iniciar sessão')).toBeTruthy()
    })

    expect(screen.queryByRole('link', { name: 'Dashboard' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Logout' })).toBeNull()
  })

  it('logado exibe topbar com links e footer', async () => {
    await setAuthenticatedUser()
    renderWithApp('/')

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeTruthy()
    })

    expect(screen.getByRole('link', { name: 'Discovery' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Watchlist' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ir para discovery' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Logout' })).toBeTruthy()
    expect(screen.getAllByText('CineDash').length).toBeGreaterThanOrEqual(2)
  })

  it('navega para Discovery ao clicar no link da topbar', async () => {
    await setAuthenticatedUser()
    const { router } = renderWithApp('/')
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Discovery' })).toBeTruthy()
    })

    await user.click(screen.getByRole('link', { name: 'Discovery' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/discovery')
    })
    expect(screen.getByRole('heading', { name: 'Discovery' })).toBeTruthy()
  })

  it('submete busca global na topbar e redireciona com q na URL', async () => {
    await setAuthenticatedUser()
    const { router } = renderWithApp('/')
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByLabelText('Buscar filmes')).toBeTruthy()
    })

    await user.type(screen.getByLabelText('Buscar filmes'), 'batman')
    await user.click(screen.getByRole('button', { name: 'Ir para discovery' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/discovery')
    })
    expect((router.state.location.search as { q?: string }).q).toBe('batman')
  })

  it('faz logout pela topbar e redireciona para login', async () => {
    await setAuthenticatedUser()
    const { router } = renderWithApp('/')
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Logout' })).toBeTruthy()
    })

    await user.click(screen.getByRole('button', { name: 'Logout' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
    })
    expect(screen.getByText('Iniciar sessão')).toBeTruthy()
  })
})
