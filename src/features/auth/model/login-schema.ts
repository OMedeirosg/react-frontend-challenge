import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(7, 'A senha deve ter mais de 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
