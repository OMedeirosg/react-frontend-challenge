import { z } from 'zod'

/** Idioma padrão para pedidos TMDB (UI em pt-BR). */
export const tmdbLanguageSchema = z.string().min(1).default('pt-BR')
