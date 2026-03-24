'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiCall } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui'
import type { Shop, Reservation } from '@/types'
import { poppins } from '@/app/fonts'
function StatRow({
  label,
  value,
  valueClass = 'text-amber-400',
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex justify-between py-4">
      <span className="text-white/50 text-sm">{label}</span>
      <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  )
}

export default function HomePage() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({
    shops: '—',
    reservations: '—',
    apiStatus: 'Loading...',
  })
  const [apiOk, setApiOk] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const shopRes = await apiCall<{ count?: number; data?: Shop[] }>(
        'GET',
        '/api/v1/shops'
      )
      setApiOk(shopRes.ok)
      if (shopRes.ok) {
        setStats((s) => ({
          ...s,
          shops: String(shopRes.data.count ?? shopRes.data.data?.length ?? '—'),
          apiStatus: '✓ เชื่อมต่อแล้ว',
        }))
      } else {
        setStats((s) => ({ ...s, apiStatus: '✗ ไม่ได้เชื่อมต่อ' }))
      }

      if (token) {
        const resRes = await apiCall<{ count?: number; data?: Reservation[] }>(
          'GET',
          '/api/v1/reservations',
          undefined,
          token
        )
        if (resRes.ok) {
          setStats((s) => ({
            ...s,
            reservations: String(
              resRes.data.count ?? resRes.data.data?.length ?? '—'
            ),
          }))
        }
      } else {
        setStats((s) => ({ ...s, reservations: 'กรุณา Login' }))
      }
      setLoading(false)
    })()
  }, [token])

  return (
    <div
  className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row relative overflow-hidden"
  style={{
    backgroundImage: "url('/img/bg2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

      {/* Left content */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 border border-amber-400/25 text-amber-400 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-8 w-fit">
          <span className="text-[0.6rem]">✦</span> Online Booking
        </div>

       <h1 className="font-serif text-5xl md:text-6xl font-medium leading-[1.1] text-white mb-6">
  Relax
  <br />
  <em className="text-amber-400 italic">Every Moment</em>
  <br />
  With Us
</h1>

        <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md backdrop-blur-sm">
  Discover premium massage experiences, choose your preferred therapist,
  and book instantly with ease — all in one place.
</p>

        <div className="flex gap-4 flex-wrap">
          <Link
            href="/shops"
            className={`${poppins.className} bg-gradient-to-b from-amber-300 to-amber-500 
                      text-stone-900 px-8 py-3.5 rounded-md text-sm font-semibold tracking-wide uppercaseshadow-md hover:shadow-lg hover:from-amber-200 hover:to-amber-400 transition-all hover:-translate-y-0.5 hover:scale-105 active:scale-95`}
          >
            Massage Shop
          </Link>
          <Link
            href={user ? '/reservations' : '/auth'}
            className={`${poppins.className} bg-gradient-to-b from-gray-200 to-gray-400 text-gray-900 px-8 py-3.5 rounded-md text-sm font-medium tracking-wide uppercaseshadow-md hover:shadow-lg hover:from-gray-100 hover:to-gray-300 transition-all hover:-translate-y-0.5`}
          >
            {user ? 'My Booking' : 'Get Started'}
          </Link>
        </div>
      </div>

     
    </div>
  )
}
