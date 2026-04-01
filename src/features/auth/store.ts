import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { cookieStorage } from '@/features/auth/cookieStorage'
import {
  comparePassword,
  hashPassword,
} from '@/features/auth/model/hashPassword'
import { normalizeAuthEmail } from '@/features/auth/model/normalize-email'

export type Account = {
  passwordHash: string
}

export type RegisterResult =
  | { success: true }
  | { success: false; error: 'duplicate_email' }

export type LoginResult =
  | { success: true }
  | { success: false; error: 'invalid_credentials' }

type AuthState = {
  accounts: Record<string, Account>
  token: string | null
  currentUserEmail: string | null
  register: (email: string, password: string) => Promise<RegisterResult>
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const establishSession = (email: string) => {
        const key = normalizeAuthEmail(email)
        set({ token: 'fake-token', currentUserEmail: key })
      }

      return {
        accounts: {},
        token: null,
        currentUserEmail: null,

        register: async (email, password) => {
          const key = normalizeAuthEmail(email)
          if (get().accounts[key]) {
            return { success: false, error: 'duplicate_email' }
          }
          const passwordHash = await hashPassword(password)
          set((s) => ({
            accounts: { ...s.accounts, [key]: { passwordHash } },
          }))
          establishSession(email)
          return { success: true }
        },

        login: async (email, password) => {
          const key = normalizeAuthEmail(email)
          const account = get().accounts[key]
          if (!account) {
            return { success: false, error: 'invalid_credentials' }
          }
          const match = await comparePassword(password, account.passwordHash)
          if (!match) {
            return { success: false, error: 'invalid_credentials' }
          }
          establishSession(email)
          return { success: true }
        },

        logout: () => {
          set({ token: null, currentUserEmail: null })
        },
      }
    },
    {
      name: 'cinedash-auth',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        accounts: state.accounts,
        token: state.token,
        currentUserEmail: state.currentUserEmail,
      }),
    },
  ),
)
