'use client'

import React from 'react'

// ── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="inline-block w-5 h-5 border-2 border-black/10 border-t-amber-400 rounded-full animate-spin" />
  )
}

// ── Toast ───────────────────────────────────────────────────────────────────
export function Toast({
  message,
  type,
}: {
  message: string
  type: 'success' | 'error' | 'info'
}) {
  const border =
    type === 'success'
      ? 'border-emerald-500'
      : type === 'error'
      ? 'border-red-500'
      : 'border-amber-400'
  return (
    <div
      className={`fixed bottom-8 right-8 z-[999] bg-stone-800 text-white px-6 py-3.5 rounded-xl text-sm border-l-4 ${border} shadow-2xl animate-slide-up`}
    >
      {message}
    </div>
  )
}

// ── useToast ────────────────────────────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = React.useState<{
    msg: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  const show = React.useCallback(
    (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ msg, type })
      setTimeout(() => setToast(null), 3200)
    },
    []
  )

  const ToastEl = toast ? <Toast message={toast.msg} type={toast.type} /> : null
  return { show, ToastEl }
}

// ── Modal ───────────────────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up">
        <div className="flex justify-between items-start px-8 pt-7 pb-5 border-b border-black/6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-stone-800">{title}</h2>
            {subtitle && <p className="text-stone-400 text-sm mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-xl leading-none p-1 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  )
}

// ── FormInput ───────────────────────────────────────────────────────────────
export function FormInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-sm bg-stone-50 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
      />
    </div>
  )
}
