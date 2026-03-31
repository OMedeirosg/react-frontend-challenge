import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/shared/model/theme-store'

type ThemeToggleProps = Readonly<{
  variant?: 'default' | 'ghost' | 'outline'
  className?: string
}>

export function ThemeToggle({
  variant = 'ghost',
  className,
}: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      className={className}
      onClick={() => toggleTheme()}
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
