import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const

export type MoviesDiscoveryTableFooterProps = {
  readonly currentPageLabel: number
  readonly totalPageLabel?: number
  readonly totalResults: number
  readonly pageSize: number
  readonly onPageSizeChange: (size: number) => void
  readonly disablePrevButton: boolean
  readonly disableNextButton: boolean
  readonly onPrevPage: () => void
  readonly onNextPage: () => void
}

export function MoviesDiscoveryTableFooter(
  props: Readonly<MoviesDiscoveryTableFooterProps>,
) {
  const {
    currentPageLabel,
    totalPageLabel,
    totalResults,
    pageSize,
    onPageSizeChange,
    disablePrevButton,
    disableNextButton,
    onPrevPage,
    onNextPage,
  } = props

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2">
      <p className="text-xs text-muted-foreground">
        Página {currentPageLabel}
        {totalPageLabel ? ` de ${totalPageLabel}` : ''}
        {' · '}
        {pageSize} {pageSize === 1 ? 'item' : 'itens'} por página de{' '}
        {totalResults.toLocaleString('pt-BR')} total
      </p>

      <div className="flex items-center gap-1.5">
        <label
          htmlFor="page-size-select"
          className="text-xs text-muted-foreground"
        >
          Itens por página
        </label>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger id="page-size-select" size="sm" className="w-[70px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onPrevPage}
          disabled={disablePrevButton}
        >
          Anterior
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onNextPage}
          disabled={disableNextButton}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
