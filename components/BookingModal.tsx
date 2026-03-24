'use client'

import { useEffect, useState } from 'react'
import { apiCall } from '@/lib/api'
import type { Masseuse } from '@/types'
import { Modal, FormInput, useToast } from './ui'

export default function BookingModal({
  open,
  shopId,
  shopName,
  token,
  onClose,
  onSuccess,
}: {
  open: boolean
  shopId: string
  shopName: string
  token: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [date, setDate] = useState('')
  const [masseuses, setMasseuses] = useState<Masseuse[]>([])
  const [masseuseId, setMasseuseId] = useState('')
  const [loading, setLoading] = useState(false)
  const { show, ToastEl } = useToast()

  useEffect(() => {
  if (!open || !shopId) return
  
  setDate('')
  setMasseuseId('')
  setMasseuses([]) 
  apiCall<{ data: Masseuse[] }>(
    'GET',
    '/api/v1/masseuses/all', 
    undefined,
    token
  ).then(({ ok, data }) => {
    if (ok) {
      const allMasseuses = data.data ?? []
      
      
      const filtered = allMasseuses.filter((m: any) => {
       
        const mShopId = (typeof m.shop === 'object' && m.shop !== null) 
                        ? m.shop._id 
                        : m.shop
        
        return mShopId === shopId
      })

      setMasseuses(filtered)
    }
  })
}, [open, shopId, token])

  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  const minDate = now.toISOString().slice(0, 16)

  const confirm = async () => {
    if (!date) { show('Please select date and time', 'error'); return }
    setLoading(true)
    const body: Record<string, string | null> = {
      apptDate: date,
      shop: shopId,
      masseuse: masseuseId || null,
    }
    const { ok, data } = await apiCall<{ msg?: string; message?: string }>(
      'POST',
      `/api/v1/shops/${shopId}/reservations`,
      body,
      token
    )
    setLoading(false)
    if (ok) {
      onSuccess()
      onClose()
    } else {
      const errMsg =
        (data as { msg?: string }).msg ??
        (data as { message?: string }).message ??
        'Booking failed'
      show(errMsg, 'error')
    }
  }

  return (
    <>
      {ToastEl}
      <Modal open={open} onClose={onClose} title="Booking" subtitle={shopName}>
        <div className="space-y-5">
          <FormInput
            label="Date and time"
            type="datetime-local"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div>
            <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">
              Masseuse (optional)
            </label>
            <select
              value={masseuseId}
              onChange={(e) => setMasseuseId(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-sm bg-stone-50 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
            >
              <option value="">—any—</option>
              {masseuses.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                  {m.telephone ? ` (${m.telephone})` : ''}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-stone-400 bg-stone-50 rounded-lg px-4 py-2.5 border border-stone-100">
            ℹ️ You can only book up to <strong>3 Reservations</strong>
          </p>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="border border-black/12 text-stone-400 rounded-lg px-5 py-2.5 text-sm hover:text-stone-700 transition-all"
            >
              cancel
            </button>
            <button
              onClick={confirm}
              disabled={loading}
              className="bg-amber-400 text-stone-900 rounded-lg px-7 py-2.5 text-sm font-medium hover:bg-amber-600 hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Reservation confirmed'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
