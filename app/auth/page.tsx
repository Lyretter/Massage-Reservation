'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiCall } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { FormInput, useToast } from '@/components/ui'
import type { User } from '@/types'

export default function AuthPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    telephone: '',
  })
  const { show, ToastEl } = useToast()

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const doLogin = async () => {
    if (!form.email || !form.password) {
      show('Missing some of the information', 'error')
      return
    }
    const { ok, data } = await apiCall<{ token: string; data: User }>(
  'POST',
  'https://backendnuad.vercel.app/api/v1/auth/login',
  { email: form.email, password: form.password }
)
   if (ok && data.token) {
  show('Login complete ✓', 'success')
  login(data.data, data.token) 
  setTimeout(() => router.push('/'), 500)
} else {
      show(
        (data as { msg?: string }).msg ?? 'Invalid Email or password',
        'error'
      )
    }
  }

  const doRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      show('Missing some of the information', 'error')
      return
    }
    const { ok, data } = await apiCall<{ token: string; data: User }>(
      'POST',
      'https://backendnuad.vercel.app/api/v1/auth/register',
      {
        name: form.name,
        telephone: form.telephone,
        email: form.email,
        password: form.password,
        role: 'user',
      }
    )
    if (ok && (data as { token: string }).token) {
      show('Registration complete ✓', 'success')
      login(
        (data as { data: User }).data ?? ({ name: form.name } as User),
        (data as { token: string }).token
      )
      setTimeout(() => router.push('/'), 500)
    } else {
      show((data as { msg?: string }).msg ?? 'Registration Failed :(', 'error')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-100 px-4 py-12">
      {ToastEl}
      <div className="bg-white rounded-2xl border border-black/7 p-10 w-full max-w-md shadow-[0_4px_40px_rgba(0,0,0,0.06)]">
        <div className="font-serif text-3xl text-amber-700 text-center mb-1">
          ✦ SerenitySpa
        </div>
        <div className="text-center text-stone-400 text-sm mb-8">
          Online massage reservation
        </div>

        
        <div className="flex border-b border-black/8 mb-7">
          {(['login', 'register'] as const).map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-center py-2.5 text-sm border-b-2 transition-all ${
                tab === t
                  ? 'text-amber-700 border-amber-400'
                  : 'text-stone-400 border-transparent hover:text-stone-600'
              }`}
            >
              {i === 0 ? 'Log in' : 'registration'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <div className="space-y-5">
            <FormInput
              label="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set('email')}
              onKeyDown={(e) => e.key === 'Enter' && doLogin()}
            />
            <FormInput
              label="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              onKeyDown={(e) => e.key === 'Enter' && doLogin()}
            />
            <button
              onClick={doLogin}
              className="w-full bg-amber-400 text-stone-900 py-3 rounded-lg text-sm font-medium tracking-wide hover:bg-amber-600 hover:text-white transition-all mt-2"
            >
              Log in
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="name"
                type="text"
                placeholder="ชื่อของคุณ"
                value={form.name}
                onChange={set('name')}
              />
              <FormInput
                label="tel."
                type="tel"
                placeholder="0xxxxxxxxx"
                value={form.telephone}
                onChange={set('telephone')}
              />
            </div>
            <FormInput
              label="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set('email')}
            />
            <FormInput
              label="password"
              type="password"
              placeholder="อย่างน้อย 6 ตัวอักษร"
              value={form.password}
              onChange={set('password')}
              onKeyDown={(e) => e.key === 'Enter' && doRegister()}
            />
            <button
              onClick={doRegister}
              className="w-full bg-amber-400 text-stone-900 py-3 rounded-lg text-sm font-medium tracking-wide hover:bg-amber-600 hover:text-white transition-all mt-2"
            >
              sign up
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
