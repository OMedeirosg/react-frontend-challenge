import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToastStore, type ToastItem } from '@/shared/model/toast-store'

function toastVariantClass(variant: ToastItem['variant']): string {
  switch (variant) {
    case 'success':
      return 'border-emerald-500/45 bg-emerald-500/12 text-foreground'
    case 'error':
      return 'border-destructive/55 bg-destructive/12 text-foreground'
    case 'info':
      return 'border-border bg-card text-card-foreground'
  }
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismissToast = useToastStore((state) => state.dismissToast)

  if (!toasts.length) return null

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2"
      aria-live="polite"
      aria-label="Notificações"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto rounded-lg border p-3 shadow-lg backdrop-blur',
            toastVariantClass(toast.variant),
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm leading-relaxed">{toast.message}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 shrink-0 text-current hover:bg-black/10 dark:hover:bg-white/10"
              onClick={() => dismissToast(toast.id)}
              aria-label="Fechar notificação"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

