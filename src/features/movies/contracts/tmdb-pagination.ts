import { z } from 'zod'

/** Página TMDB v3 (documentação: até ~500 em vários endpoints). */
export const tmdbPageSchema = z.number().int().min(1).max(500)
