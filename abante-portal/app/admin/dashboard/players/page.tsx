import { createClient } from '@/lib/supabase/server'
import { PlayerPaymentSummary } from '@/lib/types'
import Link from 'next/link'
import DeletePlayerButton from '@/components/admin/DeletePlayerButton'

export default async function PlayersPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('player_payment_summary')
    .select('*')
    .order('division')
    .order('full_name')

  const players: PlayerPaymentSummary[] = data ?? []

  const STATUS_COLOR: Record<string, string> = {
    Paid: '#22c55e',
    Partial: '#f59e0b',
    Unpaid: '#ef4444',
  }

  const DIV_COLOR: Record<string, string> = {
    Mosquito: '#f0a500',
    Kids: '#3b82f6',
    Midget: '#ef4444',
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wider text-white">PLAYERS</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">{players.length} registered players</p>
        </div>
        <Link
          href="/admin/dashboard/players/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          + Add Player
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-24 text-[var(--color-muted)]">
          <p className="font-display text-3xl tracking-wider mb-2">NO PLAYERS YET</p>
          <Link href="/admin/dashboard/players/add" className="text-[var(--color-accent)] text-sm underline">
            Add your first player →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((player, i) => (
            <div
              key={player.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex items-center gap-4 card-hover animate-fade-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* Jersey # */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-display text-lg"
                style={{ backgroundColor: `${DIV_COLOR[player.division]}22`, color: DIV_COLOR[player.division] }}
              >
                {player.jersey_number ?? '—'}
              </div>

              {/* Name + division */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{player.full_name}</p>
                <p className="text-xs" style={{ color: DIV_COLOR[player.division] }}>{player.division}</p>
              </div>

              {/* Payment info */}
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-semibold text-white">
                  ₱{Number(player.total_paid).toLocaleString()} / ₱{Number(player.jersey_price).toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: STATUS_COLOR[player.payment_status] }}>
                  {player.payment_status}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/dashboard/payments/${player.id}`}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-accent)' }}
                >
                  Payments
                </Link>
                <DeletePlayerButton playerId={player.id} playerName={player.full_name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}