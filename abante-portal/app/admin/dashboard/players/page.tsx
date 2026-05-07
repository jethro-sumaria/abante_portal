import { createClient } from '@/lib/supabase/server'
import { PlayerPaymentSummary } from '@/lib/types'
import Link from 'next/link'
import DeletePlayerButton from '@/components/admin/DeletePlayerButton'

const STATUS_COLOR: Record<string, string> = {
  Paid: '#34d399',
  Partial: '#fbbf24',
  Unpaid: '#f87171',
}

const DIV_COLOR: Record<string, string> = {
  Mosquito: '#fbbf24',
  Kids: '#60a5fa',
  Midget: '#f87171',
}

export default async function PlayersPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('player_payment_summary')
    .select('*')
    .order('division')
    .order('full_name')

  const players: PlayerPaymentSummary[] = data ?? []

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label">Players</p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-white mt-2">Registered players</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{players.length} players currently on the roster.</p>
        </div>
        <Link
          href="/admin/dashboard/players/add"
          className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_6px_20px_rgba(59,130,246,0.35)]"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 14px rgba(59,130,246,0.25)' }}
        >
          + Add player
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--surface)] p-12 text-center">
          <p className="font-display text-3xl tracking-tight text-white">No players yet</p>
          <p className="mt-3 text-sm text-[var(--color-muted)]">Start by adding a new player to begin tracking jersey payments.</p>
          <Link
            href="/admin/dashboard/players/add"
            className="mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 14px rgba(59,130,246,0.25)' }}
          >
            Add first player
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--surface)] overflow-hidden relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)' }} />

          <div className="grid grid-cols-3 gap-4 p-5 bg-[var(--surface-2)] text-sm text-[var(--color-muted)]">
            <span>Name</span>
            <span className="hidden sm:inline">Division</span>
            <span className="text-right">Status</span>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex flex-col gap-4 p-5 transition-all duration-200 hover:bg-[rgba(59,130,246,0.03)]"
                style={{ background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-white truncate">{player.full_name}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[var(--color-muted)] border border-[var(--color-border)]">
                        {player.jersey_number ?? 'No #'} • {player.division}
                      </span>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: `${STATUS_COLOR[player.payment_status]}15`, color: STATUS_COLOR[player.payment_status] }}
                      >
                        {player.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end sm:text-right">
                    <p className="text-sm text-[var(--color-muted)]">₱{Number(player.total_paid).toLocaleString()} / ₱{Number(player.jersey_price).toLocaleString()}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/dashboard/payments/${player.id}`}
                        className="rounded-xl bg-[var(--color-accent-dim)] px-4 py-2 text-xs text-[var(--color-accent)] font-medium transition-all duration-200 hover:bg-[rgba(59,130,246,0.18)]"
                      >
                        Payments
                      </Link>
                      <DeletePlayerButton playerId={player.id} playerName={player.full_name} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}