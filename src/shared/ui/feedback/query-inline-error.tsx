import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type QueryInlineErrorProps = {
  readonly className?: string
  readonly children: ReactNode
}

/**
 * Erro de query em linha — use com mensagem já resolvida no domínio (ex.: movie-query-errors).
 */
export function QueryInlineError(props: Readonly<QueryInlineErrorProps>) {
  const { className, children } = props
  return (
    <p className={cn('w-full text-destructive', className)} role="alert">
      {children}
    </p>
  )
}
