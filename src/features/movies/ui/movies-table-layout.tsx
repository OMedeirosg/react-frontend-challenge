import type { ReactNode } from 'react'

type MoviesTableLayoutProps = {
  /** Modo sidebar: painel de filtros à esquerda. No modo `top`, use `filtersSlot` em `MoviesDiscoveryTable`. */
  readonly filters?: ReactNode
  readonly content: ReactNode
  readonly orientation?: 'sidebar' | 'top'
}

export function MoviesTableLayout(props: Readonly<MoviesTableLayoutProps>) {
  const { filters, content, orientation = 'sidebar' } = props

  return (
    <section className="w-full max-w-full overflow-x-hidden">
      {orientation === 'top' ? (
        <div className="min-w-0 space-y-2">{content}</div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="w-full rounded-lg border bg-background p-3 lg:self-start">
            {filters}
          </aside>
          <div className="min-w-0 flex-1 space-y-2">{content}</div>
        </div>
      )}
    </section>
  )
}
