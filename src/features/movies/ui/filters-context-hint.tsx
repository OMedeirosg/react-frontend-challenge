type FiltersContextHintProps = {
  readonly contextMode: 'search' | 'filters'
}

export function FiltersContextHint(props: Readonly<FiltersContextHintProps>) {
  const { contextMode } = props

  return (
    <p className="text-xs text-muted-foreground" role="status" aria-live="polite">
      {contextMode === 'search'
        ? 'Use texto para encontrar um filme específico.'
        : 'Use filtros para descoberta avançada de catálogo.'}
    </p>
  )
}
