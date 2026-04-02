import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export type MovieDetailsPageSkeletonProps = {
  readonly className?: string
}

export function MovieDetailsPageSkeleton(
  props: Readonly<MovieDetailsPageSkeletonProps>,
) {
  const { className } = props
  return (
    <div
      className={cn('space-y-6 p-4', className)}
      aria-busy="true"
      aria-live="polite"
      aria-label="Carregando detalhes do filme"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <Skeleton className="aspect-2/3 w-full max-w-[220px] rounded-md" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-2 h-9 w-40" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <div className="grid gap-2 sm:grid-cols-2">
          {['sk-cast-1', 'sk-cast-2', 'sk-cast-3', 'sk-cast-4'].map((id) => (
            <div key={id} className="flex gap-3 rounded-md border p-2">
              <Skeleton className="h-[72px] w-12 shrink-0 rounded-sm" />
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="aspect-video w-full max-w-3xl rounded-md" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-3 overflow-x-hidden pb-1">
          {['sk-rel-1', 'sk-rel-2', 'sk-rel-3', 'sk-rel-4'].map((id) => (
            <div key={id} className="w-[110px] shrink-0 space-y-2">
              <Skeleton className="aspect-2/3 w-full rounded-md" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
