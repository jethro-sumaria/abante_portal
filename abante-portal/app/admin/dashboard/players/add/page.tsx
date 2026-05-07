import Link from 'next/link'
import PlayerForm from '@/components/admin/PlayerForm'

export default function AddPlayerPage() {
  return (
    <main className="animate-fade-up min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <p className="label">Admin / Players</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-wider text-white">Add New Player</h1>
            <p className="text-[var(--color-muted)] max-w-2xl mt-3">
              Register a new player and set the jersey price to keep payment records accurate.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row items-start sm:items-center">
            <Link
              href="/admin/dashboard"
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
            >
              ← Back to dashboard
            </Link>
            <Link
              href="/admin/dashboard/players"
              className="rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              View all players
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[var(--color-surface-2)] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Player details</span>
              <h2 className="text-2xl font-semibold text-white">Fast onboarding for new players</h2>
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                Give each player a name, division, jersey number, and price. Keep your roster and payment data clean with a single tap.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[var(--surface-3)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Why this matters</p>
                <p className="mt-3 text-sm text-[var(--color-text)] leading-6">
                  Structured player records make payment tracking easier and improve transparency for families, coaches, and admin staff.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-3)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Pro tip</p>
                <p className="mt-3 text-sm text-[var(--color-text)] leading-6">
                  Use the division buttons to quickly segment players by Mosquito, Kids, and Midget divisions.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <PlayerForm />
          </section>
        </div>
      </div>
    </main>
  )
}
