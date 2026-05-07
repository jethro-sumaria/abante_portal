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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,200,66,0.12),_transparent_28%),_var(--bg)] text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="rounded-[32px] border border-[var(--color-border)] bg-[var(--surface)] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="label">Season 2025 · All divisions</p>
              <h1 className="font-display text-5xl md:text-6xl tracking-tight text-white">
                Jersey <span className="text-[var(--color-accent)]">Payments</span>
              </h1>
              <p className="mt-4 text-base text-[var(--color-muted)] max-w-xl leading-7">
                Full transparency on jersey payments across Mosquito, Kids, and Midget divisions.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/admin/login"
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--surface-2)] px-5 py-3 text-sm text-[var(--color-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Admin portal
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.7fr_1fr] mt-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Total players', value: players.length, tone: 'text-[var(--text)]' },
              { label: 'Fully paid', value: paid, tone: 'text-[var(--color-green)]' },
              { label: 'Partial', value: partial, tone: 'text-[var(--color-yellow)]' },
              { label: 'Unpaid', value: unpaid, tone: 'text-[var(--color-red)]' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[28px] border border-[var(--color-border)] bg-[var(--surface)] p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">{item.label}</p>
                <p className={`mt-4 text-4xl font-display ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">Collection progress</p>
                <p className="mt-3 text-3xl font-display text-white">₱{totalCollected.toLocaleString()}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Target ₱{totalExpected.toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-[var(--color-accent-dim)] px-3 py-1 text-sm font-semibold text-black">{completion}%</span>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--bg-2)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-green)] to-[var(--color-accent)] transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-[var(--color-border)] bg-[var(--surface)] p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label">Division breakdown</p>
              <h2 className="text-3xl font-semibold text-white">Track payments by division</h2>
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