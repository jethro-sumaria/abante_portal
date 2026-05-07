import { createClient } from '@/lib/supabase/server'
import { PlayerPaymentSummary, Division } from '@/lib/types'
import DivisionTabs from '@/components/public/DivisionTabs'
import Link from 'next/link'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('player_payment_summary')
    .select('*')
    .order('full_name', { ascending: true })

  const players: PlayerPaymentSummary[] = data ?? []

  const divisions: Division[] = ['Mosquito', 'Kids', 'Midget']
  const grouped = divisions.reduce((acc, div) => {
    acc[div] = players.filter((p) => p.division === div)
    return acc
  }, {} as Record<Division, PlayerPaymentSummary[]>)

  const totalCollected = players.reduce((sum, p) => sum + Number(p.total_paid), 0)
  const totalExpected = players.reduce((sum, p) => sum + Number(p.jersey_price), 0)
  const paid = players.filter((p) => p.payment_status === 'Paid').length
  const partial = players.filter((p) => p.payment_status === 'Partial').length
  const unpaid = players.filter((p) => p.payment_status === 'Unpaid').length
  const completion = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0

  return (
    <main className="min-h-screen text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── Hero header ── */}
        <header className="fade-up rounded-3xl border border-[var(--color-border)] bg-[var(--surface)] p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl glow-blue">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="label">Season 2025 · All divisions</p>
              <h1 className="font-display text-5xl md:text-6xl tracking-tight text-white mt-3">
                Jersey <span className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">Payments</span>
              </h1>
              <p className="mt-4 text-base text-[var(--color-muted)] max-w-xl leading-7">
                Full transparency on jersey payments across Mosquito, Kids, and Midget divisions.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/admin/login"
                className="rounded-xl border border-[var(--color-border)] bg-[var(--surface-2)] px-5 py-3 text-sm text-[var(--color-text)] transition-all duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
              >
                Admin portal →
              </Link>
            </div>
          </div>
        </header>

        {/* ── Stats grid ── */}
        <section className="grid gap-5 lg:grid-cols-[1.7fr_1fr] mt-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Total players', value: players.length, tone: 'text-white', icon: '👥' },
              { label: 'Fully paid', value: paid, tone: 'text-[var(--color-green)]', icon: '✓' },
              { label: 'Partial', value: partial, tone: 'text-[var(--color-yellow)]', icon: '◑' },
              { label: 'Unpaid', value: unpaid, tone: 'text-[var(--color-red)]', icon: '○' },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`fade-up d${i + 1} rounded-2xl border border-[var(--color-border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">{item.label}</p>
                  <span className="text-lg opacity-60">{item.icon}</span>
                </div>
                <p className={`mt-4 text-4xl font-display ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* ── Collection progress ── */}
          <div className="fade-up d3 rounded-2xl border border-[var(--color-border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Collection progress</p>
                <p className="mt-3 text-3xl font-display text-white">₱{totalCollected.toLocaleString()}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Target ₱{totalExpected.toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-[var(--color-accent-dim)] px-4 py-1.5 text-sm font-semibold text-[var(--color-accent)]">{completion}%</span>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--bg-2)]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completion}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
              />
            </div>
          </div>
        </section>

        {/* ── Division breakdown ── */}
        <section className="fade-up d4 mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--surface)] p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label">Division breakdown</p>
              <h2 className="text-3xl font-semibold text-white mt-2">Track payments by division</h2>
            </div>
            <p className="text-sm text-[var(--color-muted)] max-w-xl">
              View which divisions are fully paid, partially paid, or still pending so your staff can follow up quickly.
            </p>
          </div>
          <div className="mt-8">
            <DivisionTabs grouped={grouped} />
          </div>
        </section>

        <footer className="mt-16 text-center text-sm text-[var(--color-muted)]">
          Liga Tracker © {new Date().getFullYear()} · Built for transparency
        </footer>
      </div>
    </main>
  )
}