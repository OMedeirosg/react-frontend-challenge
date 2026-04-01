import { z } from 'zod'

export const movieGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const movieListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  release_date: z.string(),
  genre_ids: z.array(z.number()).default([]),
})

export const paginatedMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieListItemSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

export const movieGenresResponseSchema = z.object({
  genres: z.array(movieGenreSchema),
})

export type MovieGenre = z.infer<typeof movieGenreSchema>
export type MovieListItem = z.infer<typeof movieListItemSchema>
export type PaginatedMoviesResponse = z.infer<typeof paginatedMoviesResponseSchema>
export type MovieGenresResponse = z.infer<typeof movieGenresResponseSchema>
