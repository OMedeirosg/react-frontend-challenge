import { Skeleton } from '@/components/ui/skeleton'
import { DataTableSkeleton } from '@/shared/ui/feedback'

/** Mesmas colunas do catálogo (alinhado a `MoviesDiscoveryTableSkeleton`). */
const ROUTE_TABLE_HEADERS = [
  'Pôster',
  'Título',
  'Gênero',
  'Ano',
  'Nota',
] as const

export function RoutePendingTablePage() {
  return (
    <div className="px-4 pt-4 pb-3">
      <Skeleton className="mb-1 h-8 w-48" />
      <Skeleton className="mb-4 h-4 w-full max-w-lg" />
      <DataTableSkeleton
        rows={6}
        ariaLabel="Carregando página"
        headers={ROUTE_TABLE_HEADERS}
      />
    </div>
  )
}

export function RoutePendingAuthPage() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6">
      <Skeleton className="h-10 w-full max-w-sm" />
      <Skeleton className="h-10 w-full max-w-sm" />
      <Skeleton className="h-9 w-32" />
    </div>
  )
}
