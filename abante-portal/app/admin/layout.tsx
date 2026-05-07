import type { Metadata } from 'next'
import AdminNav from '@/components/admin/AdminNav'

export const metadata: Metadata = {
  title: 'Admin | Liga Tracker',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--color-text)]">
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="flex-1 p-4 md:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
