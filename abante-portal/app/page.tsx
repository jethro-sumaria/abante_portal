'use client'

import { useEffect, useState } from 'react'
import { supabase, PlayerSummary, Division, Payment } from '@/lib/supabase'

const DIVISIONS: Division[] = ['Mosquito', 'Kids', 'Midget']

const STATUS_STYLES: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Partial: 'bg-amber-50 text-amber-700 border border-amber-200',
  Unpaid: 'bg-red-50 text-red-700 border border-red-200',
}

const STATUS_STYLES_DARK: Record<string, string> = {
  Paid: 'bg-emerald-500/20 text-emerald-400',
  Partial: 'bg-amber-500/20 text-amber-400',
  Unpaid: 'bg-red-500/20 text-red-400',
}

const DIVISION_COLORS: Record<Division, string> = {
  Mosquito: 'from-sky-500 to-blue-600',
  Kids: 'from-violet-500 to-purple-600',
  Midget: 'from-rose-500 to-pink-600',
}

const ITEM_ICONS: Record<string, string> = {
  Jersey: '👕',
  Warmer: '🧣',
  'Jersey + Warmer': '👕🧣',
}

export default function PublicPage() {
  const [players, setPlayers] = useState<PlayerSummary[]>([])
  const [activeDiv, setActiveDiv] = useState<Division>('Mosquito')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Detail modal
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSummary | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)

  useEffect(() => {
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('player_payment_summary')
      .select('*')
      .order('full_name')
    if (!error && data) setPlayers(data as PlayerSummary[])
    setLoading(false)
  }

  async function openDetail(player: PlayerSummary) {
    setSelectedPlayer(player)
    setLoadingPayments(true)
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('player_id', player.id)
      .order('payment_date')
    setPayments(data as Payment[] ?? [])
    setLoadingPayments(false)
  }

  function closeDetail() {
    setSelectedPlayer(null)
    setPayments([])
  }

  const byDivision = players.filter(
    (p) =>
      p.division === activeDiv &&
      p.full_name.toLowerCase().includes(search.toLowerCase())
  )

  const divStats = (div: Division) => {
    const group = players.filter((p) => p.division === div)
    const paid = group.filter((p) => p.payment_status === 'Paid').length
    const total = group.length
    const collected = group.reduce((s, p) => s + Number(p.total_paid), 0)
    return { paid, total, collected }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm font-bold">
              🏀
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none">Jersey Payments</h1>
              <p className="text-xs text-slate-400 mt-0.5">Public transparency board</p>
            </div>
          </div>
          <a
            href="/admin"
            className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
          >
            Admin →
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Division summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {DIVISIONS.map((div) => {
            const { paid, total, collected } = divStats(div)
            const isActive = activeDiv === div
            return (
              <button
                key={div}
                onClick={() => setActiveDiv(div)}
                className={`rounded-2xl p-4 text-left transition-all border ${
                  isActive
                    ? 'border-white/20 bg-white/10 shadow-lg scale-[1.02]'
                    : 'border-white/5 bg-white/5 hover:bg-white/8'
                }`}
              >
                <div className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${DIVISION_COLORS[div]} mb-3`}>
                  {div}
                </div>
                <p className="text-2xl font-bold">
                  {total > 0 ? Math.round((paid / total) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-400 mt-1">{paid}/{total} fully paid</p>
                <p className="text-xs text-slate-500 mt-0.5">₱{collected.toLocaleString()} collected</p>
              </button>
            )
          })}
        </div>

        {/* Search + division tabs */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search player…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 placeholder:text-slate-600"
            />
          </div>
          <div className="flex gap-1">
            {DIVISIONS.map((div) => (
              <button
                key={div}
                onClick={() => setActiveDiv(div)}
                className={`px-3 py-2 text-sm rounded-xl transition-colors ${
                  activeDiv === div ? 'bg-white text-slate-900 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        {/* Players list */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading players…</div>
        ) : byDivision.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">No players found.</div>
        ) : (
          <div className="space-y-2">
            {byDivision.map((player) => (
              <button
                key={player.id}
                onClick={() => openDetail(player)}
                className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl px-5 py-4 transition-all text-left cursor-pointer"
              >
                {/* Jersey number badge */}
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 shrink-0">
                  {player.jersey_number ?? '—'}
                </div>

                {/* Name + item type */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{player.full_name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs">{ITEM_ICONS[(player as any).item_type] ?? '👕'}</span>
                    <span className="text-xs text-slate-400">{(player as any).item_type ?? 'Jersey'}</span>
                    <span className="text-slate-700 text-xs">·</span>
                    <span className="text-xs text-slate-500">
                      {player.installment_count} payment{player.installment_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="hidden sm:flex flex-col gap-1 w-32">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          player.jersey_price > 0
                            ? (Number(player.total_paid) / Number(player.jersey_price)) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    ₱{Number(player.total_paid).toLocaleString()} / ₱{Number(player.jersey_price).toLocaleString()}
                  </p>
                </div>

                {/* Balance */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">
                    {Number(player.balance) > 0
                      ? `₱${Number(player.balance).toLocaleString()} left`
                      : '✓ Settled'}
                  </p>
                </div>

                {/* Status badge */}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[player.payment_status]}`}>
                  {player.payment_status}
                </span>

                {/* Tap hint */}
                <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}

        <footer className="text-center text-xs text-slate-600 pb-4">
          Tap any player to see payment details · Open to public for transparency
        </footer>
      </main>

      {/* ── PLAYER DETAIL MODAL ── */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={closeDetail}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-lg font-bold text-white">
                  {selectedPlayer.jersey_number ?? '—'}
                </div>
                <div>
                  <h2 className="font-semibold text-base">{selectedPlayer.full_name}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-slate-400">{selectedPlayer.division}</span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-xs">
                      {ITEM_ICONS[(selectedPlayer as any).item_type] ?? '👕'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {(selectedPlayer as any).item_type ?? 'Jersey'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={closeDetail} className="text-slate-500 hover:text-white transition-colors mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Summary strip */}
            <div className="mx-6 mb-4 grid grid-cols-3 gap-2">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">Price</p>
                <p className="text-sm font-semibold">₱{Number(selectedPlayer.jersey_price).toLocaleString()}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">Paid</p>
                <p className="text-sm font-semibold text-emerald-400">₱{Number(selectedPlayer.total_paid).toLocaleString()}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">Balance</p>
                <p className={`text-sm font-semibold ${Number(selectedPlayer.balance) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  ₱{Number(selectedPlayer.balance).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mx-6 mb-5">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Payment progress</span>
                <span>
                  {selectedPlayer.jersey_price > 0
                    ? Math.round((Number(selectedPlayer.total_paid) / Number(selectedPlayer.jersey_price)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all"
                  style={{
                    width: `${Math.min(100, selectedPlayer.jersey_price > 0
                      ? (Number(selectedPlayer.total_paid) / Number(selectedPlayer.jersey_price)) * 100
                      : 0)}%`,
                  }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="mx-6 mb-5 flex items-center justify-between">
              <span className="text-xs text-slate-400">Status</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES_DARK[selectedPlayer.payment_status]}`}>
                {selectedPlayer.payment_status}
              </span>
            </div>

            {/* Payment history */}
            <div className="border-t border-white/10 px-6 pt-4 pb-6">
              <p className="text-xs text-slate-400 font-medium mb-3">
                Payment History ({selectedPlayer.installment_count})
              </p>
              {loadingPayments ? (
                <p className="text-sm text-slate-500 text-center py-4">Loading…</p>
              ) : payments.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No payments recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {payments.map((pay, i) => (
                    <div key={pay.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-medium">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">₱{Number(pay.amount_paid).toLocaleString()}</p>
                          <p className="text-xs text-slate-500">{pay.payment_date}</p>
                          {pay.notes && <p className="text-xs text-slate-500 italic">{pay.notes}</p>}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">Installment #{pay.installment_number}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}