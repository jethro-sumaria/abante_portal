import Link from 'next/link'
import PlayerForm from '@/components/admin/PlayerForm'

export default function AddPlayerPage() {
  return (
    <main className="animate-fade-up min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <p className="label">Admin / Players</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight text-white mt-2">Add New Player</h1>
            <p className="text-[var(--color-muted)] max-w-2xl mt-3 text-sm leading-relaxed">
              Register a new player and set the jersey price to keep payment records accurate.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row items-start sm:items-center">
            <Link
              href="/admin/dashboard"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)] transition-all duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
            >
              ← Back to dashboard
            </Link>
            <Link
              href="/admin/dashboard/players"
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_6px_20px_rgba(59,130,246,0.35)]"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 14px rgba(59,130,246,0.25)' }}
            >
              View all players
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)' }} />
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[var(--color-accent-dim)] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">Player details</span>
              <h2 className="text-2xl font-semibold text-white">Fast onboarding for new players</h2>
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                Give each player a name, division, jersey number, and price. Keep your roster and payment data clean with a single tap.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-[var(--surface-3)] p-4 border border-[var(--color-border)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">Why this matters</p>
                <p className="mt-3 text-sm text-[var(--color-text)] leading-6">
                  Structured player records make payment tracking easier and improve transparency for families, coaches, and admin staff.
                </p>
              </div>
              <div className="rounded-xl bg-[var(--surface-3)] p-4 border border-[var(--color-border)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">Pro tip</p>
                <p className="mt-3 text-sm text-[var(--color-text)] leading-6">
                  Use the division buttons to quickly segment players by Mosquito, Kids, and Midget divisions.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <PlayerForm />
          </section>
        </div>
      </div>
    </main>
  )
}
