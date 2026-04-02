import { Suspense, lazy } from 'react'

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({
    default: m.ReactQueryDevtools,
  })),
)

const TanStackRouterDevtools = lazy(() =>
  import('@tanstack/react-router-devtools').then((m) => ({
    default: m.TanStackRouterDevtools,
  })),
)

/** Monta Devtools do Query + Router (apenas importado em `import.meta.env.DEV`). */
export function AppDevtools() {
  return (
    <>
      <Suspense fallback={null}>
        <ReactQueryDevtools />
      </Suspense>
      <Suspense fallback={null}>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  )
}
