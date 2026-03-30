import { beforeEach, describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

import { useAuthStore } from '@/features/auth/store'
import { renderWithApp, resetAuthStore } from '@/test/test-utils'

describe('auth guard (about)', () => {
  beforeEach(() => {
    resetAuthStore()
  })

  it('sem token, /about redireciona para /login', async () => {
    const { router } = renderWithApp('/about')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
    })
    expect(screen.getByText('Iniciar sessão')).toBeInTheDocument()
  })

  it('com token, /about mostra conteúdo About', async () => {
    await useAuthStore.getState().register('about@test.com', 'secret12')
    await useAuthStore.getState().login('about@test.com', 'secret12')

    renderWithApp('/about')

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'About' }),
      ).toBeInTheDocument()
    })
  })
})
