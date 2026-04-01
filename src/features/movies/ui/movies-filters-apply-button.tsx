import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type MoviesFiltersApplyButtonProps = {
  readonly disabled?: boolean
  readonly onClick: () => void
  readonly className?: string
}

/** Botão primário único em Home, Discovery e Watchlist (mesmo tamanho e hierarquia). */
export function MoviesFiltersApplyButton(
  props: Readonly<MoviesFiltersApplyButtonProps>,
) {
  const { disabled, onClick, className } = props

  return (
    <Button
      type="button"
      variant="default"
      className={cn(
        'h-8 shrink-0 px-3 text-sm font-medium shadow-sm',
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      Aplicar filtros
    </Button>
  )
}
