import { DataTableSkeleton } from '@/shared/ui/feedback'

export type MoviesDiscoveryTableSkeletonProps = {
  readonly className?: string
  readonly rows?: number
}

const HEADERS = ['Pôster', 'Título', 'Gênero', 'Ano', 'Nota'] as const

export function MoviesDiscoveryTableSkeleton(
  props: Readonly<MoviesDiscoveryTableSkeletonProps>,
) {
  const { className, rows = 8 } = props
  return (
    <DataTableSkeleton
      className={className}
      rows={rows}
      ariaLabel="Carregando lista de filmes"
      headers={HEADERS}
    />
  )
}
