import { z } from 'zod'

import { tmdbLanguageSchema } from './tmdb-language'
import { tmdbPageSchema } from './tmdb-pagination'

export const popularMoviesRequestSchema = z.object({
  page: tmdbPageSchema.default(1),
  language: tmdbLanguageSchema,
})

export const trendingMoviesRequestSchema = z.object({
  page: tmdbPageSchema.default(1),
  timeWindow: z.enum(['day', 'week']).default('day'),
  language: tmdbLanguageSchema,
})

export const searchMoviesRequestSchema = z.object({
  query: z.string().trim().min(1),
  page: tmdbPageSchema.default(1),
  language: tmdbLanguageSchema,
  includeAdult: z.boolean().default(false),
})

export const discoverMoviesRequestSchema = z.object({
  page: tmdbPageSchema.default(1),
  language: tmdbLanguageSchema,
  genreId: z.number().int().positive().nullable().default(null),
  year: z.number().int().min(1878).max(2100).nullable().default(null),
  minVote: z.number().min(0).max(10).nullable().default(null),
  sortBy: z.string().min(1).default('popularity.desc'),
  includeAdult: z.boolean().default(false),
})

export const movieGenresRequestSchema = z.object({
  language: tmdbLanguageSchema,
})

export type PopularMoviesParams = z.input<typeof popularMoviesRequestSchema>
export type TrendingMoviesParams = z.input<typeof trendingMoviesRequestSchema>
export type SearchMoviesParamsBase = z.input<typeof searchMoviesRequestSchema>
export type DiscoverMoviesParams = z.input<typeof discoverMoviesRequestSchema>
export type MovieGenresParams = z.input<typeof movieGenresRequestSchema>
