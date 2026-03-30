/**
 * Flags de ambiente usadas na configuração do Vite (Node).
 * O Vitest define `process.env.VITEST` ao correr testes.
 */
export const isVitest = process.env.VITEST === 'true'
