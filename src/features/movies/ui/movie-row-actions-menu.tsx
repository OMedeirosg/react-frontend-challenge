import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { MovieListItem } from '../types'

const menuItemClass =
  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50'

export type MovieRowActionsMenuProps = {
  readonly movie: MovieListItem
  readonly onToggleWatchlist: (movie: MovieListItem) => void
  readonly onOpenDetails: (movie: MovieListItem) => void
  readonly isInWatchlist: (movieId: number) => boolean
}

export function MovieRowActionsMenu(props: Readonly<MovieRowActionsMenuProps>) {
  const { movie, onToggleWatchlist, onOpenDetails, isInWatchlist } = props
  const inList = isInWatchlist(movie.id)

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Abrir ações de ${movie.title}`}
          aria-haspopup="menu"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={cn(
            'z-50 max-w-[min(100vw-2rem,16rem)] min-w-44 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
          )}
        >
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => onToggleWatchlist(movie)}
          >
            {inList ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => onOpenDetails(movie)}
          >
            Ver detalhes
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
