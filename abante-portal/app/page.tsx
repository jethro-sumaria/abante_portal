import { createClient } from '@/lib/supabase/server'
import { PlayerPaymentSummary, Division } from '@/lib/types'
import DivisionTabs from '@/components/public/DivisionTabs'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('player_payment_summary')
    .select('*')
    .order('full_name', { ascending: true })

  const players: PlayerPaymentSummary[] = data ?? []

  const divisions: Division[] = ['Mosquito', 'Kids', 'Midget']
  const grouped = divisions.reduce((acc, div) => {
    acc[div] = players.filter((p) => p.division === div)
    return acc
  }, {} as Record<Division, PlayerPaymentSummary[]>)

  const stats = {
    total: players.length,
    paid: players.filter((p) => p.payment_status === 'Paid').length,
    partial: players.filter((p) => p.payment_status === 'Partial').length,
    unpaid: players.filter((p) => p.payment_status === 'Unpaid').length,
  }

  return (
    <main className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b border-panel sticky top-0 z-50 backdrop-blur-md bg-[rgba(10,15,30,0.85)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <span className="font-display text-black text-lg leading-none">L</span>
            </div>
            <div>
              <h1 className="font-display text-2xl tracking-wide leading-none text-white">LIGA TRACKER</h1>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">Jersey Payment Transparency</p>
            </div>
          </div>
          <a
            href="/admin/login"
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors px-3 py-1.5 rounded border border-[var(--color-border)] hover:border-[var(--color-accent)]"
          >
            Admin →
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-10 animate-fade-up">
          <h2 className="font-display text-5xl md:text-7xl tracking-wider text-white leading-none">
            PLAYER <span style={{ color: 'var(--color-accent)' }}>JERSEYS</span>
          </h2>
          <p className="text-[var(--color-muted)] mt-3 text-sm md:text-base max-w-xl">
            Full transparency on jersey payments across all divisions. Updated in real-time.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Total Players', value: stats.total, color: 'var(--color-text)' },
            { label: 'Fully Paid', value: stats.paid, color: 'var(--color-green)' },
            { label: 'Partial', value: stats.partial, color: 'var(--color-yellow)' },
            { label: 'Unpaid', value: stats.unpaid, color: 'var(--color-red)' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="font-display text-3xl md:text-4xl" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[var(--color-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Division Tabs */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <DivisionTabs grouped={grouped} />
        </div>
      </div>

      <footer className="border-t border-[var(--color-border)] mt-16 py-6 text-center text-xs text-[var(--color-muted)]">
        Liga Tracker © {new Date().getFullYear()} — Built for transparency
      </footer>
    </main>
  )
}