import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/** Hash no cliente só para demo; em produção o backend deve validar e armazenar. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function comparePassword(
  plain: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, passwordHash)
}
