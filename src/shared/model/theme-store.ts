import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'cinedash-theme'

function readStoredTheme(): ThemeMode {
  if (globalThis.window === undefined) return 'dark'
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY)
    if (!raw) return 'dark'
    const parsed = JSON.parse(raw) as { state?: { theme?: ThemeMode } }
    return parsed.state?.theme === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

type ThemeState = {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: readStoredTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
