import type { ReactNode } from 'react'

type MoviesTableLayoutProps = {
  readonly filters: ReactNode
  readonly content: ReactNode
}

export function MoviesTableLayout(props: Readonly<MoviesTableLayoutProps>) {
  const { filters, content } = props

  return (
    <section className="w-full max-w-full overflow-x-hidden">
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="w-full rounded-lg border bg-background p-3 lg:self-start">
          {filters}
        </aside>
        <div className="min-w-0 flex-1 space-y-2">{content}</div>
      </div>
    </section>
  )
}
