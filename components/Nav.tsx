'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from './ui'

const NAV_LINKS = [
  { label: 'Main page', href: '/' },
  { label: 'Shops', href: '/shops' },
  { label: 'Reservation', href: '/reservations' },
]

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  
  const { show, ToastEl } = useToast()

  const handleLogout = () => {
    logout()
    show('Log out complete')
    router.push('/')
  }

  return (
    <>
      {ToastEl}
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 md:px-10 bg-stone-900/95 backdrop-blur-md border-b border-amber-400/20">
        
        <Link
          href="/"
          className="font-serif text-2xl font-semibold text-amber-400 tracking-wide select-none"
        >
          Serenity<span className="text-white font-normal">Spa</span>
        </Link>

        
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm tracking-wide transition-colors ${
                pathname === l.href
                  ? 'text-amber-400'
                  : 'text-white/60 hover:text-amber-400'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span className="text-white/60 text-sm hidden md:block mx-10">
                Hello, {user.name}
                
              </span>
              <button
                onClick={handleLogout}
                className="border border-amber-400/25 text-white/80 hover:border-amber-400 hover:text-amber-400 px-4 py-1.5 rounded-full text-xs tracking-wide transition-all"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="border border-amber-400/25 text-white/80 hover:border-amber-400 hover:text-amber-400 px-4 py-1.5 rounded-full text-xs tracking-wide transition-all"
              >
                Log in
              </Link>
              <Link
                href="/auth"
                className="bg-amber-400 text-stone-900 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-amber-200 transition-all"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
