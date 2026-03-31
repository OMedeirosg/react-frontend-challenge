import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useAuthStore } from '@/features/auth/store'
import { renderWithApp, resetAuthStore } from '@/test/test-utils'

async function fillLoginForm(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
) {
  await user.type(
    await screen.findByLabelText('Email', { selector: '#login-email' }),
    email,
  )
  await user.type(
    screen.getByLabelText(/^Senha$/, { selector: '#login-password' }),
    password,
  )
  await user.click(screen.getByRole('button', { name: /entrar/i }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    resetAuthStore()
  })

  it('navega para / e define token após credenciais válidas', async () => {
    const user = userEvent.setup()
    await useAuthStore.getState().register('user@test.com', 'secret12')
    const { router } = renderWithApp('/login')

    await fillLoginForm(user, 'user@test.com', 'secret12')

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('fake-token')
    })
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
    })
  })

  it('mostra erro com credenciais inválidas', async () => {
    const user = userEvent.setup()
    await useAuthStore.getState().register('user@test.com', 'secret12')
    renderWithApp('/login')

    await fillLoginForm(user, 'user@test.com', 'wrong-password-123')

    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos.')).toBeTruthy()
    })
  })
})
