import type { StateStorage } from 'zustand/middleware'

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const parts = document.cookie.split(';')
  for (const part of parts) {
    const trimmed = part.trim()
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    if (key === name) {
      return decodeURIComponent(trimmed.slice(eq + 1))
    }
  }
  return null
}

function setCookie(name: string, value: string): void {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

function removeCookie(name: string): void {
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0`
}

/** Persistência Zustand em cookie (sem backend; HttpOnly só com servidor). */
export const cookieStorage: StateStorage = {
  getItem: (name) => getCookie(name),
  setItem: (name, value) => setCookie(name, value),
  removeItem: (name) => removeCookie(name),
}
