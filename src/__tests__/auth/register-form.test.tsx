import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useAuthStore } from '@/features/auth/store'
import { renderWithApp, resetAuthStore } from '@/test/test-utils'

async function fillRegisterForm(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
) {
  await user.type(
    await screen.findByLabelText('Email', { selector: '#register-email' }),
    email,
  )
  await user.type(
    screen.getByLabelText(/^Senha$/, { selector: '#register-password' }),
    password,
  )
  await user.type(
    screen.getByLabelText('Confirmar senha', {
      selector: '#register-confirm-password',
    }),
    password,
  )
  await user.click(screen.getByRole('button', { name: /registar/i }))
}

describe('RegisterForm', () => {
  beforeEach(() => {
    resetAuthStore()
  })

  it('registo válido navega para /login', async () => {
    const user = userEvent.setup()
    const { router } = renderWithApp('/register')

    await fillRegisterForm(user, 'new@test.com', 'secret12')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
    })
  })

  it('email duplicado mostra erro', async () => {
    const user = userEvent.setup()
    await useAuthStore.getState().register('dup@test.com', 'secret12')
    renderWithApp('/register')

    await fillRegisterForm(user, 'dup@test.com', 'secret12')

    await waitFor(() => {
      expect(screen.getByText('Este email já está registado.')).toBeTruthy()
    })
  })
})
