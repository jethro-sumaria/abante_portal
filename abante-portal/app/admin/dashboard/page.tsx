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

  const divColors: Record<string, string> = {
    Mosquito: '#fbbf24',
    Kids: '#60a5fa',
    Midget: '#f87171',
  }

  return (
    <div className="space-y-8 animate-fade-up">

      {/* ── Hero section ── */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--surface)] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.18)] glow-blue relative overflow-hidden">
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)' }} />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label">Admin dashboard</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight text-white mt-2">Overview</h1>
            <p className="mt-3 text-sm text-[var(--color-muted)] max-w-xl leading-relaxed">
              A clean summary of jersey payments, player counts, and collection performance.
            </p>
          </div>
          <Link
            href="/admin/dashboard/players/add"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_6px_20px_rgba(59,130,246,0.35)]"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 14px rgba(59,130,246,0.25)' }}
          >
            + Add Player
          </Link>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid gap-4 mt-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total players', value: stats.total, color: 'var(--text)', icon: '👥' },
            { label: 'Fully paid', value: stats.paid, color: 'var(--color-green)', icon: '✓' },
            { label: 'Partial', value: stats.partial, color: 'var(--color-yellow)', icon: '◑' },
            { label: 'Unpaid', value: stats.unpaid, color: 'var(--color-red)', icon: '○' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--surface-2)] p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{item.label}</p>
                <span className="text-sm opacity-50">{item.icon}</span>
              </div>
              <p className="mt-4 text-4xl font-display" style={{ color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Collection + Division grid ── */}
      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">

        {/* ── Collection summary ── */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--surface)] p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)' }} />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label">Collection summary</p>
              <h2 className="text-3xl font-semibold text-white mt-2">Current progress</h2>
            </div>
            <span className="rounded-full bg-[var(--color-accent-dim)] px-4 py-1.5 text-sm font-semibold text-[var(--color-accent)]">
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
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completion}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
              />
            </div>
          </div>
        </div>

        {/* ── Division cards ── */}
        <div className="grid gap-4">
          {divisionStats.map((division) => (
            <div
              key={division.div}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--surface-2)] p-6 transition-all duration-300 hover:border-[var(--border-hover)]"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: divColors[division.div] }} />
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{division.div}</p>
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{division.count} players</p>
              <p className="mt-2 text-sm text-[var(--color-green)]">₱{division.collected.toLocaleString()} collected</p>
              <p className="text-sm text-[var(--color-muted)]">Target ₱{division.expected.toLocaleString()}</p>
            </div>
          ))}
          <Link
            href="/admin/dashboard/players"
            className="rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent-dim)] px-6 py-5 text-center text-sm font-semibold text-[var(--color-accent)] transition-all duration-200 hover:bg-[rgba(59,130,246,0.18)] hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          >
            Manage players →
          </Link>
        </div>
      </section>
    </div>
  )
}