import type { Column, Table } from '@tanstack/react-table'
import { Columns3Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { MovieListItem } from '@/features/movies/types'

function columnMenuLabel(column: Column<MovieListItem, unknown>): string {
  const header = column.columnDef.header
  if (typeof header === 'string') return header
  return column.id
}

export type MoviesDiscoveryTableColumnsMenuProps = {
  readonly table: Table<MovieListItem>
}

export function MoviesDiscoveryTableColumnsMenu(
  props: Readonly<MoviesDiscoveryTableColumnsMenuProps>,
) {
  const { table } = props
  const hideable = table.getAllLeafColumns().filter((column) => column.getCanHide())

  if (hideable.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-2.5"
          aria-label="Colunas da tabela"
        >
          <Columns3Icon className="size-4" aria-hidden />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideable.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
          >
            {columnMenuLabel(column)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
