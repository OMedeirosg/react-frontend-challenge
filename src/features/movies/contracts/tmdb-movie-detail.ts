import { z } from 'zod'

import { tmdbLanguageSchema } from './tmdb-language'
import { movieGenreSchema } from './tmdb-movie-list'

export { paginatedMoviesResponseSchema as movieSimilarResponseSchema } from './tmdb-movie-list'

const movieByIdRequestSchema = z.object({
  movieId: z.number().int().positive(),
  language: tmdbLanguageSchema,
})

export const movieDetailsRequestSchema = movieByIdRequestSchema
export const movieCreditsRequestSchema = movieByIdRequestSchema
export const movieVideosRequestSchema = movieByIdRequestSchema

export const movieSimilarRequestSchema = z.object({
  movieId: z.number().int().positive(),
  language: tmdbLanguageSchema,
  page: z.number().int().positive().default(1),
})

export const movieDetailsResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  release_date: z.string(),
  genres: z.array(movieGenreSchema),
})

export const movieCastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
})

export const movieCreditsResponseSchema = z.object({
  cast: z.array(movieCastMemberSchema),
})

export const movieVideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
})

export const movieVideosResponseSchema = z.object({
  results: z.array(movieVideoSchema),
})

export type MovieDetailsParams = z.input<typeof movieDetailsRequestSchema>
export type MovieCreditsParams = z.input<typeof movieCreditsRequestSchema>
export type MovieVideosParams = z.input<typeof movieVideosRequestSchema>
export type MovieSimilarParams = z.input<typeof movieSimilarRequestSchema>

export type MovieDetails = z.infer<typeof movieDetailsResponseSchema>
export type MovieCastMember = z.infer<typeof movieCastMemberSchema>
export type MovieCreditsResponse = z.infer<typeof movieCreditsResponseSchema>
export type MovieVideo = z.infer<typeof movieVideoSchema>
export type MovieVideosResponse = z.infer<typeof movieVideosResponseSchema>
