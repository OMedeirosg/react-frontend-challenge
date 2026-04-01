import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type QueryFetchingHintProps = {
  readonly children: ReactNode
  readonly className?: string
}

/** Indicador não intrusivo de refetch (ex.: filtros aplicados). */
export function QueryFetchingHint(props: Readonly<QueryFetchingHintProps>) {
  const { children, className } = props
  return (
    <p
      className={cn('mb-2 w-full text-sm text-muted-foreground', className)}
      role="status"
      aria-live="polite"
    >
      {children}
    </p>
  )
}
