import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { isRateLimitError } from '@/lib/api'

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minuto — evita refetch imediato
      // 429 já foi retentado no cliente HTTP com Retry-After / backoff; não duplicar tempestade de retries
      retry: (failureCount: number, error: unknown) => {
        if (isRateLimitError(error)) return false
        return failureCount < 2
      },
    },
  },
}

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
