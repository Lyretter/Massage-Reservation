import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'SerenitySpa — ระบบจองนวดออนไลน์',
  description: 'ค้นหาร้านนวดชั้นนำ เลือกนักนวดที่ชอบ และจองได้ทันที',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="font-sans">
        <AuthProvider>
          <Nav />
          <main className="pt-16 min-h-screen bg-stone-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
