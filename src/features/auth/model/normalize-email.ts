/** Mesma normalização usada em contas e sessão (`register` / `login`). */
export function normalizeAuthEmail(email: string): string {
  return email.toLowerCase().trim()
}
