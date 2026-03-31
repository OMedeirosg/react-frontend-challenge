import { useLayoutEffect } from 'react'

import { useThemeStore } from '@/shared/model/theme-store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return children
}
