import { screen, waitFor } from '@testing-library/react'

import { useAuthStore } from '@/features/auth/store'
import { renderWithApp, resetAuthStore } from '@/test/test-utils'

describe('auth guard (discovery)', () => {
  beforeEach(() => {
    resetAuthStore()
  })

  it('sem token, /discovery redireciona para /login', async () => {
    const { router } = renderWithApp('/discovery')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
    })
    expect(screen.getByText('Iniciar sessão')).toBeTruthy()
  })

  it('com token, /discovery mostra conteúdo da tela', async () => {
    await useAuthStore.getState().register('discovery@test.com', 'secret12')
    await useAuthStore.getState().login('discovery@test.com', 'secret12')

    renderWithApp('/discovery')

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Discovery' })).toBeTruthy()
    })
  })
})
