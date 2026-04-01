import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const STORAGE_KEY = 'cinedash-page-size'
const DEFAULT_PAGE_SIZE = 20
const MIN_PAGE_SIZE = 1
const MAX_PAGE_SIZE = 20

function clampPageSize(n: number): number {
  return Math.max(MIN_PAGE_SIZE, Math.min(MAX_PAGE_SIZE, Math.trunc(n)))
}

type PageSizeState = {
  pageSize: number
  setPageSize: (size: number) => void
}

export const usePageSizeStore = create<PageSizeState>()(
  persist(
    (set) => ({
      pageSize: DEFAULT_PAGE_SIZE,
      setPageSize: (size) => set({ pageSize: clampPageSize(size) }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ pageSize: state.pageSize }),
    },
  ),
)
