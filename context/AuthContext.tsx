'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/types'
import { loadUser, loadToken, saveSession, clearSession } from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  token: string
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: '',
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    setUser(loadUser())
    setToken(loadToken())
  }, [])

  const login = (u: User, t: string) => {
    setUser(u)
    setToken(t)
    saveSession(u, t)
  }

  const logout = () => {
    setUser(null)
    setToken('')
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
