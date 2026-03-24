import type { User } from '@/types'

export function loadUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem('spa_user') ?? 'null')
  } catch {
    return null
  }
}

export function loadToken(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('spa_token') ?? ''
}

export function saveSession(user: User, token: string) {
  localStorage.setItem('spa_token', token)
  localStorage.setItem('spa_user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('spa_token')
  localStorage.removeItem('spa_user')
}
