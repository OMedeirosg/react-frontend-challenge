import { createRootRoute, type ErrorComponentProps } from '@tanstack/react-router'

import { RootLayout } from '../layouts/RootLayout'

function RootError(props: Readonly<ErrorComponentProps>) {
  const { error, reset } = props
  const message = error instanceof Error ? error.message : String(error)
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center"
      role="alert"
    >
      <h1 className="text-lg font-semibold">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-md text-sm">{message}</p>
      <button
        type="button"
        className="text-primary underline underline-offset-4"
        onClick={() => {
          reset()
        }}
      >
        Tentar novamente
      </button>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: RootError,
})
