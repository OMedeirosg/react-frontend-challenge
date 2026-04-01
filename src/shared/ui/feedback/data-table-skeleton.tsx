import { cn } from '@/lib/utils'

export type DataTableSkeletonProps = {
  readonly className?: string
  readonly rows?: number
  readonly ariaLabel: string
  /** Cabeçalhos visíveis; layout fixo de 5 colunas (catálogo CineDash). */
  readonly headers: readonly [string, string, string, string, string]
}

export function DataTableSkeleton(props: Readonly<DataTableSkeletonProps>) {
  const { className, rows = 8, ariaLabel, headers } = props
  const rowIds = Array.from({ length: rows }, (_, row) => `skeleton-row-${row + 1}`)
  const [h0, h1, h2, h3, h4] = headers

  return (
    <div
      className={cn('overflow-x-auto rounded-lg ring-1 ring-border', className)}
      aria-busy="true"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <table className="w-full min-w-[720px] table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-[76px]" />
          <col className="w-[280px]" />
          <col className="w-[220px]" />
          <col className="w-[80px]" />
          <col className="w-[64px]" />
        </colgroup>
        <thead>
          <tr className="bg-muted/40">
            <th className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap">
              {h0}
            </th>
            <th className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap">
              {h1}
            </th>
            <th className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap">
              {h2}
            </th>
            <th className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap">
              {h3}
            </th>
            <th className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap">
              {h4}
            </th>
          </tr>
        </thead>
        <tbody>
          {rowIds.map((rowId) => (
            <tr key={rowId} className="border-b border-border">
              <td className="px-3 py-2 align-middle whitespace-nowrap">
                <div className="h-14 w-10 animate-pulse rounded-md bg-muted" />
              </td>
              <td className="px-3 py-2 align-middle whitespace-nowrap">
                <div className="h-4 w-44 animate-pulse rounded bg-muted" />
              </td>
              <td className="px-3 py-2 align-middle whitespace-nowrap">
                <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              </td>
              <td className="px-3 py-2 align-middle whitespace-nowrap">
                <div className="h-4 w-12 animate-pulse rounded bg-muted" />
              </td>
              <td className="px-3 py-2 align-middle whitespace-nowrap">
                <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
