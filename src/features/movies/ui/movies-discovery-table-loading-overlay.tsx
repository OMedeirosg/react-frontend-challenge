export function MoviesDiscoveryTableLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/65">
      <div
        className="size-7 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-foreground"
        aria-label="Atualizando lista de filmes"
      />
    </div>
  )
}
