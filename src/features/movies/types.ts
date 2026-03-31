/** Item retornado em listagens (ex.: /movie/popular) — subset útil à UI */
export type MovieListItem = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date: string
  genre_ids: number[]
}

export type PaginatedMoviesResponse = {
  page: number
  results: MovieListItem[]
  total_pages: number
  total_results: number
}

export type MovieGenre = {
  id: number
  name: string
}

export type MovieGenresResponse = {
  genres: MovieGenre[]
}
