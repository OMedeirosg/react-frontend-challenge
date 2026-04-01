import { flexRender, type Table } from '@tanstack/react-table'

import { cn } from '@/lib/utils'
import type { MovieListItem } from '@/features/movies/types'

import type { MoviesTableActions } from './movies-discovery-table-columns'
import {
  renderTableHeaderContent,
  sortAriaSort,
} from './movies-discovery-table-header-content'
import { MoviesDiscoveryTableFooter } from './movies-discovery-table-footer'
import { MoviesDiscoveryTableLoadingOverlay } from './movies-discovery-table-loading-overlay'

type MoviesDiscoveryTableViewProps = {
  readonly table: Table<MovieListItem>
  readonly actions?: MoviesTableActions
  readonly viewMode: 'catalog' | 'watchlist'
  readonly isLoading: boolean
  readonly className?: string
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

export function MoviesDiscoveryTableView(
  props: Readonly<MoviesDiscoveryTableViewProps>,
) {
  const {
    table,
    actions,
    viewMode,
    isLoading,
    className,
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
    <div className={cn('relative w-full min-w-0 rounded-lg ring-1 ring-border', className)}>
      <div className="w-full overflow-x-auto">
        <table
          className="w-full min-w-[720px] table-fixed border-collapse text-sm md:min-w-[840px] lg:min-w-[920px]"
          aria-busy={isLoading}
        >
          <colgroup>
            <col className="w-[76px]" />
            <col className="w-[280px]" />
            <col className="w-[220px]" />
            <col className="w-[80px]" />
            <col className="w-[64px]" />
            <col className="w-[52px]" />
          </colgroup>
          <caption className="sr-only">
            {viewMode === 'watchlist'
              ? 'Tabela da watchlist: colunas pôster, título, gênero, data de lançamento, nota e ações.'
              : 'Tabela de filmes em descoberta: colunas pôster, título, gênero, ano, nota e ações. Use os cabeçalhos para ordenar quando disponível.'}
          </caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={sortAriaSort(header)}
                    className="border-b border-border px-3 py-2 text-left font-medium whitespace-nowrap"
                  >
                    {renderTableHeaderContent(header)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-border last:border-b-0 hover:bg-muted/30',
                  actions?.isInWatchlist(row.original.id)
                    ? 'bg-amber-500/5 hover:bg-amber-500/10'
                    : undefined,
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 align-middle whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MoviesDiscoveryTableFooter
        currentPageLabel={currentPageLabel}
        totalPageLabel={totalPageLabel}
        totalResults={totalResults}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        disablePrevButton={disablePrevButton}
        disableNextButton={disableNextButton}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
      {isLoading ? <MoviesDiscoveryTableLoadingOverlay /> : null}
    </div>
  )
}
