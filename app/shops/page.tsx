'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiCall } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/ui'
import BookingModal from '@/components/BookingModal'
import type { Shop } from '@/types'

function ShopCard({
  shop,
  index,
  onBook,
  onDetail,
}: {
  shop: Shop
  index: number
  onBook: () => void
  onDetail: () => void
}) {
  return (
    <div
      onClick={onDetail}
      className="bg-white border border-black/7 rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:border-amber-200 transition-all duration-300"
    >
      <div className="h-44 relative overflow-hidden">
  <Image
    src={`/img/s${(index % 10) + 1}.jpg`}
    alt={shop.name}
    fill
    className="object-cover"
  />
</div>

      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-stone-800 mb-1.5">
          {shop.name}
        </h3>
        <p className="text-xs text-stone-400 mb-4 flex items-start gap-1">
          <span>📍</span>
          <span>{shop.address}</span>
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {shop.tel && (
            <span className="bg-stone-100 text-amber-700 text-xs px-3 py-1 rounded-full">
              📞 {shop.tel}
            </span>
          )}
          {shop.openTime && (
            <span className="bg-stone-100 text-amber-700 text-xs px-3 py-1 rounded-full">
              🕐 {shop.openTime}–{shop.closeTime ?? '?'}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t border-black/5">
          <button
            onClick={(e) => { e.stopPropagation(); onBook() }}
            className="flex-1 bg-amber-400 text-stone-900 text-xs font-medium py-2 rounded-lg hover:bg-amber-600 hover:text-white transition-all"
          >
            Booking
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDetail() }}
            className="flex-1 border border-black/12 text-stone-400 text-xs py-2 rounded-lg hover:border-amber-400 hover:text-amber-700 transition-all"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShopsPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState<{ shopId: string; shopName: string } | null>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      const { ok, data } = await apiCall<{ data: Shop[]; count: number }>(
        'GET',
        '/api/v1/shops'
      )
      if (ok) setShops(data.data ?? [])
      else setError('Failed to load shops')
      setLoading(false)
    })()
  }, [])

  const openBooking = (shopId: string, shopName: string) => {
    if (!user) { router.push('/auth'); return }
    setBooking({ shopId, shopName })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div className="text-center mb-12">
        <div className="text-amber-500 text-xs tracking-[0.15em] uppercase mb-3">
          ✦ service location
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-medium text-stone-800">
          Our Massage Shop
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20 text-stone-400">
          <Spinner />
          <span>  Loading Database...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-5xl opacity-30 mb-4">⚠️</div>
          <div className="text-red-500 text-sm">{error}</div>
          <div className="text-stone-400 text-xs mt-2">
            {' '}
            <code className="bg-stone-100 px-1 rounded"></code>{' '}
            
          </div>
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl opacity-30 mb-4">🏪</div>
          <div></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop, i) => (
            <ShopCard
              key={shop._id}
              shop={shop}
              index={i}
              onBook={() => openBooking(shop._id, shop.name)}
              onDetail={() => router.push(`/shops/${shop._id}`)}
            />
          ))}
        </div>
      )}

      {booking && (
        <BookingModal
          open={!!booking}
          shopId={booking.shopId}
          shopName={booking.shopName}
          token={token}
          onClose={() => setBooking(null)}
          onSuccess={() => {
            setBooking(null)
            router.push('/reservations')
          }}
        />
      )}
    </div>
  )
}
