'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/admin/dashboard/players', label: 'Players', icon: '👥' },
  { href: '/admin/dashboard/players/add', label: 'Add Player', icon: '+' },
]

export default function AdminNav() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  if (pathname?.startsWith('/admin/login')) {
    return null
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 min-h-screen border-r border-[var(--color-border)] p-5"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <span className="font-display text-lg text-black leading-none">L</span>
          </div>
          <div>
            <p className="font-display text-lg tracking-wide text-white leading-none">LIGA</p>
            <p className="text-xs text-[var(--color-muted)]">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{
                  backgroundColor: isActive ? 'var(--color-accent-dim)' : 'transparent',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                  borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[#ef4444] transition-colors mt-4 px-3 py-2"
        >
          <span>⎋</span> Sign Out
        </button>

        {/* Public link */}
        <a
          href="/"
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mt-2 px-3"
        >
          ← Public View
        </a>
      </aside>

      {/* Mobile top nav */}
      <header
        className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] sticky top-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(17,24,39,0.9)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <span className="font-display text-sm text-black leading-none">L</span>
          </div>
          <span className="font-display text-lg tracking-wider text-white">LIGA ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          {NAV.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs px-2 py-1 rounded-lg transition-all"
              style={{
                backgroundColor: pathname === item.href ? 'var(--color-accent-dim)' : 'transparent',
                color: pathname === item.href ? 'var(--color-accent)' : 'var(--color-muted)',
              }}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-xs text-[var(--color-muted)] hover:text-[#ef4444] transition-colors"
          >
            Out
          </button>
        </div>
      </header>
    </>
  )
}