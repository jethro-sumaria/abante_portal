import { createClient } from '@/lib/supabase/server'
import { PlayerPaymentSummary } from '@/lib/types'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('player_payment_summary')
    .select('*')
    .order('full_name')

  const players: PlayerPaymentSummary[] = data ?? []

  const stats = {
    total: players.length,
    paid: players.filter((p) => p.payment_status === 'Paid').length,
    partial: players.filter((p) => p.payment_status === 'Partial').length,
    unpaid: players.filter((p) => p.payment_status === 'Unpaid').length,
    totalCollected: players.reduce((sum, p) => sum + Number(p.total_paid), 0),
    totalExpected: players.reduce((sum, p) => sum + Number(p.jersey_price), 0),
  }

  const divisionStats = ['Mosquito', 'Kids', 'Midget'].map((div) => {
    const dp = players.filter((p) => p.division === div)
    return {
      div,
      count: dp.length,
      collected: dp.reduce((s, p) => s + Number(p.total_paid), 0),
      expected: dp.reduce((s, p) => s + Number(p.jersey_price), 0),
    }
  })

  const completion = stats.totalExpected > 0 ? Math.round((stats.totalCollected / stats.totalExpected) * 100) : 0

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[var(--color-border)] bg-[var(--surface)] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label">Admin dashboard</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight text-white">Overview</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)] max-w-xl">
              A clean summary of jersey payments, player counts, and collection performance.
            </p>
          </div>
          <Link
            href="/admin/dashboard/players/add"
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            + Add Player
          </Link>
        </div>

        <div className="grid gap-4 mt-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total players', value: stats.total, color: 'var(--text)' },
            { label: 'Fully paid', value: stats.paid, color: 'var(--color-green)' },
            { label: 'Partial', value: stats.partial, color: 'var(--color-yellow)' },
            { label: 'Unpaid', value: stats.unpaid, color: 'var(--color-red)' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] border border-[var(--color-border)] bg-[var(--surface-2)] p-6"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{item.label}</p>
              <p className="mt-4 text-4xl font-display" style={{ color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--surface)] p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label">Collection summary</p>
              <h2 className="text-3xl font-semibold text-white">Current progress</h2>
            </div>
            <span className="rounded-full bg-[var(--color-accent-dim)] px-3 py-1 text-sm font-semibold text-black">
              {completion}% collected
            </span>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
              <span>Total collected</span>
              <span className="text-[var(--color-green)] font-semibold">₱{stats.totalCollected.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
              <span>Target expected</span>
              <span>₱{stats.totalExpected.toLocaleString()}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--bg-2)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-green)] to-[var(--color-accent)] transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {divisionStats.map((division) => (
            <div
              key={division.div}
              className="rounded-[28px] border border-[var(--color-border)] bg-[var(--surface-2)] p-6"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{division.div}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{division.count} players</p>
              <p className="mt-2 text-sm text-[var(--color-green)]">₱{division.collected.toLocaleString()} collected</p>
              <p className="text-sm text-[var(--color-muted)]">Target ₱{division.expected.toLocaleString()}</p>
            </div>
          ))}
          <Link
            href="/admin/dashboard/players"
            className="rounded-[28px] border border-[var(--color-accent)] bg-[var(--color-accent-dim)] px-6 py-5 text-center text-sm font-semibold text-black transition hover:opacity-90"
          >
            Manage players
          </Link>
        </div>
      </section>
    </div>
  )
}