import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type EmptyStateProps = {
  readonly title?: string
  readonly description: ReactNode
  readonly icon?: ReactNode
  readonly action?: ReactNode
  readonly className?: string
  /** Contêiner com borda tracejada (ex.: watchlist vazia) */
  readonly variant?: 'plain' | 'bordered'
}

/**
 * Estado vazio genérico — título/descrição opcionais; mensagens de domínio vêm de fora.
 */
export function EmptyState(props: Readonly<EmptyStateProps>) {
  const { title, description, icon, action, className, variant = 'plain' } = props
  return (
    <div
      className={cn(
        'w-full',
        variant === 'bordered' && 'rounded-lg border border-dashed p-6',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {icon ? <div className="mb-3 text-muted-foreground">{icon}</div> : null}
      {title ? (
        <p className="mb-1 font-medium text-foreground">{title}</p>
      ) : null}
      <div
        className={cn(
          'text-sm text-muted-foreground',
          action ? 'mb-4' : undefined,
        )}
      >
        {description}
      </div>
      {action}
    </div>
  )
}
