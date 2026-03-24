'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiCall } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Modal, FormInput, Spinner, useToast } from '@/components/ui'
import type { Reservation } from '@/types'

export default function ReservationsPage() {
  const { user, token } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [masseuseList, setMasseuseList] = useState<any[]>([])
const [loadingMasseuse, setLoadingMasseuse] = useState(false)
  const [editModal, setEditModal] = useState<{
    open: boolean
    id: string
    date: string
    masseuse: string
  }>({ open: false, id: '', date: '', masseuse: ''  })
  const { show, ToastEl } = useToast()

  

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    const { ok, data } = await apiCall<{ data: Reservation[] }>(
      'GET',
      '/api/v1/reservations',
      undefined,
      token
    )

    if (ok) setReservations(data.data ?? [])
    setLoading(false)
  }, [token, user])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('Do you want to cancel this reservation?')) return
    const { ok } = await apiCall('DELETE', `/api/v1/reservations/${id}`, undefined, token)
    if (ok) { show('Reservation cancelled'); load() }
    else show('cancelation failed', 'error')
  }

  const handleEdit = async () => {
    if (!editModal.date) { show('Please specify date and time', 'error'); return }
    if(loadingMasseuse){
      show('กรุณารอโหลดหมอนวด', 'error')
      return
    }
    if (!editModal.date) { show('กรุณาเลือกวันเวลา', 'error'); return }
    const { ok } = await apiCall(
      'PUT',
      `/api/v1/reservations/${editModal.id}`,
      { apptDate: editModal.date ,
         masseuse: editModal.masseuse || null
      },
      token
    )
    if (ok) {
      setEditModal({ open: false, id: '', date: '', masseuse:'' })
      show('Editing completed ✓', 'success')
      load()
    } else {
      show('Failed to edit your reservation', 'error')
    }
  }

  const toLocalDT = (date: Date) => {
    const copy = new Date(date)
    copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset())
    return copy.toISOString().slice(0, 16)
  }

  const now = new Date()

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-16">
      {ToastEl}

      <div className="text-center mb-12">
        <div className="text-amber-500 text-xs tracking-[0.15em] uppercase mb-3">
          ✦ Your Bookings
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-medium text-stone-800">
          All Reservations
        </h2>
      </div>

      {!user ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl opacity-30 mb-4">🔐</div>
          <p>Please log in to veiw your reservation</p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center gap-3 py-20 text-stone-400">
          <Spinner /><span>Loading...</span>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl opacity-30 mb-4">📅</div>
          <p>No reservation yet</p>
          <p className="text-xs mt-1 text-stone-300">(Can book up to 3 Reservation)</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="text-right text-xs text-stone-400 mb-2">
            {reservations.length}/3 Reservation{' '}
            {reservations.length >= 3 && (
              <span className="text-red-400 font-medium">(You cannot book more reservation)</span>
            )}
          </div>

          {reservations.map((r) => {
            const d = new Date(r.apptDate)
            const isUpcoming = d > now
            return (
              <div
                key={r._id}
                className="bg-white border border-black/7 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all"
              >
                
                <div className="flex-shrink-0 bg-stone-100 rounded-xl px-4 py-3 text-center min-w-[62px]">
                  <div className="text-2xl font-medium text-amber-700 leading-none">
                    {d.getDate()}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 mt-1">
                    {d.toLocaleString('th-TH', { month: 'short' })}
                  </div>
                </div>

               
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-stone-800 truncate">
                    {r.shop?.name ?? 'ร้านนวด'}
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    {d.toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    น.
                    {r.masseuse?.name && r.masseuse.name !== 'any' && (
                      <> • Masseuse: {r.masseuse.name}</>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-300 mt-0.5">
                    📍 {r.shop?.address ?? '—'}
                  </div>
                </div>

                
                <span
                  className={`text-xs px-3 py-1 rounded-full flex-shrink-0 ${
                    isUpcoming
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {isUpcoming ? 'Upcoming' : 'Finished'}
                </span>

              
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {isUpcoming && (
                    <button
                      onClick={async () => {
                            setLoadingMasseuse(true)

                            const { ok, data } = await apiCall<{ data: any[] }>(
                                'GET',
                                `/api/v1/shops/${r.shop._id}/masseuses`,
                                undefined,
                                token
                              )

                              console.log('API result:', data)

                            if (ok) {
                                setMasseuseList(data.data || [])
                              } else {
                                setMasseuseList([])
                              }

                            setLoadingMasseuse(false)

                            setEditModal({
                              open: true,
                              id: r._id,
                              date: toLocalDT(d),
                              masseuse: r.masseuse?._id || ''
                            })
                          }}
                      className="text-xs px-3 py-1.5 bg-stone-100 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all"
                    >
                      edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-xs px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-lg hover:bg-red-100 transition-all"
                  >
                    cancel
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      
      <Modal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, id: '', date: '',masseuse:'' })}
        title="Edit Reservation"
        subtitle="Change date and time"
      >
        <div className="space-y-5">
          <FormInput
            label="New date and time"
            type="datetime-local"
            value={editModal.date}
            onChange={(e) =>
              setEditModal((m) => ({ ...m, date: e.target.value }))
            }
          />

            <div>
              <label className="text-sm text-stone-600 mb-1 block">
                select masseuse
              </label>

              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={editModal.masseuse}
                disabled={loadingMasseuse}
                onChange={(e) =>
                  setEditModal((m) => ({ ...m, masseuse: e.target.value }))
                }
              >
                <option value="">any</option>

                {masseuseList.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>

              {loadingMasseuse && (
                <div className="text-xs text-stone-400 mt-1">
                  Loading....
                </div>
              )}
            </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setEditModal({ open: false, id: '', date: '',masseuse:'' })}
              className="border border-black/12 text-stone-400 rounded-lg px-5 py-2.5 text-sm hover:text-stone-700 transition-all"
            >
              cancel
            </button>
            <button
              onClick={handleEdit}
              className="bg-amber-400 text-stone-900 rounded-lg px-7 py-2.5 text-sm font-medium hover:bg-amber-600 hover:text-white transition-all"
            >
              confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
