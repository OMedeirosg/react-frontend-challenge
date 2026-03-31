import { create } from 'zustand'

export type ToastVariant = 'info' | 'success' | 'error'

export type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
  durationMs: number
}

type ShowToastInput = {
  message: string
  variant?: ToastVariant
  durationMs?: number
}

type ToastStore = {
  toasts: ToastItem[]
  showToast: (input: ShowToastInput) => string
  dismissToast: (id: string) => void
}

const DEFAULT_TOAST_DURATION_MS = 3500

function nextToastId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  showToast: ({ message, variant = 'info', durationMs = DEFAULT_TOAST_DURATION_MS }) => {
    const id = nextToastId()
    const toast: ToastItem = {
      id,
      message,
      variant,
      durationMs,
    }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))

    globalThis.setTimeout(() => {
      const stillExists = get().toasts.some((item) => item.id === id)
      if (stillExists) {
        get().dismissToast(id)
      }
    }, durationMs)

    return id
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    })),
}))

