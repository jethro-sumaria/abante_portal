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

  const recent = players
    .filter((p) => p.payment_status !== 'Unpaid')
    .slice(0, 5)

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wider text-white">DASHBOARD</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">Overview of all jersey payments</p>
        </div>
        <Link
          href="/admin/dashboard/players/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          + Add Player
        </Link>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Players', value: stats.total, color: 'var(--color-text)', icon: '👥' },
          { label: 'Fully Paid',    value: stats.paid,    color: 'var(--color-green)', icon: '✅' },
          { label: 'Partial',       value: stats.partial, color: 'var(--color-yellow)', icon: '⏳' },
          { label: 'Unpaid',        value: stats.unpaid,  color: 'var(--color-red)', icon: '❌' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="font-display text-4xl" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Collection summary */}
      <div
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-6"
      >
        <h2 className="font-display text-2xl tracking-wider text-white mb-4">COLLECTION SUMMARY</h2>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--color-muted)]">Total Collected</span>
          <span className="text-[var(--color-green)] font-semibold">₱{stats.totalCollected.toLocaleString()}</span>
        </div>
        <div className="h-3 rounded-full bg-[var(--color-surface-2)] overflow-hidden mb-2">
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.totalExpected > 0 ? (stats.totalCollected / stats.totalExpected) * 100 : 0}%`,
              background: 'linear-gradient(90deg, #22c55e88, #22c55e)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--color-muted)]">
          <span>₱0</span>
          <span>Target: ₱{stats.totalExpected.toLocaleString()}</span>
        </div>
      </div>

      {/* Division breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {divisionStats.map((d) => (
          <div
            key={d.div}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <h3 className="font-display text-xl tracking-wider text-[var(--color-accent)] mb-3">{d.div.toUpperCase()}</h3>
            <p className="text-2xl font-bold text-white">{d.count} <span className="text-sm font-normal text-[var(--color-muted)]">players</span></p>
            <p className="text-sm text-[var(--color-green)] mt-1">₱{d.collected.toLocaleString()} / ₱{d.expected.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/admin/dashboard/players"
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 card-hover block"
        >
          <p className="font-display text-2xl tracking-wider text-white">MANAGE PLAYERS</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">Edit, delete, or view all players →</p>
        </Link>
        <Link
          href="/admin/dashboard/players/add"
          className="rounded-2xl border border-[var(--color-accent)] bg-[var(--color-accent-dim)] p-5 card-hover block"
        >
          <p className="font-display text-2xl tracking-wider text-[var(--color-accent)]">ADD NEW PLAYER</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">Register a new player + jersey price →</p>
        </Link>
      </div>
    </div>
  )
}