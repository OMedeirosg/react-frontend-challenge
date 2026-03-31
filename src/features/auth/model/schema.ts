/** Re-exporta schemas de auth (registo e login em ficheiros separados para commits/imports claros). */
export {
  registerSchema,
  type RegisterFormData,
} from '@/features/auth/model/register-schema'
export { loginSchema, type LoginFormData } from '@/features/auth/model/login-schema'
