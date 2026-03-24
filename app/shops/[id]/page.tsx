'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { apiCall } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui'
import BookingModal from '@/components/BookingModal'
import type { Shop, Masseuse } from '@/types'

export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: shopId } = use(params)
  const router = useRouter()
  const { user, token } = useAuth()
  const [shop, setShop] = useState<Shop | null>(null)
  const [masseuses, setMasseuses] = useState<Masseuse[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
  if (!shopId) return
  ;(async () => {
    setLoading(true)
    const [shopRes, massRes] = await Promise.all([
      apiCall<{ data: Shop }>('GET', `/api/v1/shops/${shopId}`),
      apiCall<{ data: Masseuse[] }>('GET', `/api/v1/masseuses/all`, undefined, token),
    ])

    if (shopRes.ok) setShop(shopRes.data.data)

    if (massRes.ok) {
    
      const allData = massRes.data.data ?? []
      const shopMasseuses = allData.filter((m: any) => {
        const mShopId = typeof m.shop === 'object' ? m.shop._id : m.shop
        return mShopId === shopId
      })
      
      setMasseuses(shopMasseuses)
    }
    
    setLoading(false)
  })()
}, [shopId, token])

  const handleBook = () => {
    if (!user) { router.push('/auth'); return }
    setBookingOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner />
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="text-center py-20 text-stone-400">
        ⚠️ Shop not found
      </div>
    )
  }

  return (
    <>
      
      <div className="bg-stone-900 px-8 md:px-16 py-14 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-medium text-white mb-3">
            {shop.name}
          </h1>
          <div className="text-white/50 text-sm leading-relaxed space-y-1">
            <p>📍 {shop.address}</p>
            {shop.tel && <p>📞 {shop.tel}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          {shop.openTime && (
            <div className="border border-amber-400/25 bg-amber-400/10 rounded-xl px-6 py-4 text-center">
              <div className="text-amber-400 text-xs uppercase tracking-widest mb-1">
                Opened time
              </div>
              <div className="text-white font-medium">
                {shop.openTime} – {shop.closeTime ?? '?'}
              </div>
            </div>
          )}
          <button
            onClick={handleBook}
            className="w-full bg-amber-400 text-stone-900 px-6 py-3 rounded-xl text-sm font-medium hover:bg-amber-200 transition-all"
          >
            Book now
          </button>
          <button
            onClick={() => router.back()}
            className="w-full text-white/40 text-xs hover:text-white transition-colors text-center"
          >
            ← Return
          </button>
        </div>
      </div>

      {/* Masseuses */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="text-amber-500 text-xs tracking-[0.15em] uppercase mb-1">
          ✦ Our teams
        </div>
        <h2 className="font-serif text-3xl font-medium mb-6">Our masseuses</h2>

        {masseuses.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm border border-dashed border-stone-200 rounded-2xl">
            👤 no information yet
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {masseuses.map((m) => (
              <div
                key={m._id}
                className="bg-white border border-black/7 rounded-xl p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-stone-100 flex items-center justify-center mx-auto mb-3 font-serif text-xl text-amber-700 font-semibold">
                  {m.name.charAt(0)}
                </div>
                <div className="font-medium text-sm text-stone-800">{m.name}</div>
                {m.telephone && (
                  <div className="text-xs text-stone-400 mt-0.5">{m.telephone}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingOpen && (
        <BookingModal
          open={bookingOpen}
          shopId={shop._id}
          shopName={shop.name}
          token={token}
          onClose={() => setBookingOpen(false)}
          onSuccess={() => {
            setBookingOpen(false)
            router.push('/reservations')
          }}
        />
      )}
    </>
  )
}
