import type { MovieListItem } from '../types'
import {
  useMoviesDiscoveryTable,
  type UseMoviesDiscoveryTableArgs,
} from './use-movies-discovery-table'

export type MoviesDiscoveryTableProps = UseMoviesDiscoveryTableArgs & {
  readonly movies: MovieListItem[]
}

export function MoviesDiscoveryTable(props: Readonly<MoviesDiscoveryTableProps>) {
  const { view } = useMoviesDiscoveryTable(props)
  return view
}
