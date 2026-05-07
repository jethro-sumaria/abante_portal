'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Payment, PlayerSummary, Division } from '@/lib/supabase'

const DIVISIONS: Division[] = ['Mosquito', 'Kids', 'Midget']
const ITEM_TYPES = ['Jersey', 'Warmer', 'Jersey + Warmer']

export default function AdminDashboard() {
  const router = useRouter()
  const [players, setPlayers] = useState<PlayerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDiv, setActiveDiv] = useState<Division>('Mosquito')

  // Modals
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSummary | null>(null)
  const [playerPayments, setPlayerPayments] = useState<Payment[]>([])

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'player'; id: string; name: string }
    | { type: 'payment'; id: string; label: string }
    | null
  >(null)
  const [deleting, setDeleting] = useState(false)

  // Forms
  const [playerForm, setPlayerForm] = useState({
    full_name: '',
    division: 'Mosquito' as Division,
    jersey_number: '',
    jersey_price: '',
    item_type: 'Jersey',
  })
  const [paymentForm, setPaymentForm] = useState({
    player_id: '',
    amount_paid: '',
    payment_date: new Date().toISOString().split('T')[0],
    installment_number: '1',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchPlayers = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('player_payment_summary')
      .select('*')
      .order('full_name')
    if (data) setPlayers(data as PlayerSummary[])
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin')
      else fetchPlayers()
    })
  }, [router, fetchPlayers])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const { error } = await supabase.from('players').insert({
      full_name: playerForm.full_name,
      division: playerForm.division,
      jersey_number: playerForm.jersey_number || null,
      jersey_price: parseFloat(playerForm.jersey_price) || 0,
    })
    if (error) { setFormError(error.message); setSaving(false); return }
    setShowAddPlayer(false)
    setPlayerForm({ full_name: '', division: 'Mosquito', jersey_number: '', jersey_price: '', item_type: 'Jersey' })
    fetchPlayers()
    setSaving(false)
  }

  async function addPayment(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const { error } = await supabase.from('payments').insert({
      player_id: paymentForm.player_id,
      amount_paid: parseFloat(paymentForm.amount_paid),
      payment_date: paymentForm.payment_date,
      installment_number: parseInt(paymentForm.installment_number),
      notes: paymentForm.notes || null,
    })
    if (error) { setFormError(error.message); setSaving(false); return }
    setShowAddPayment(false)
    setPaymentForm({ player_id: '', amount_paid: '', payment_date: new Date().toISOString().split('T')[0], installment_number: '1', notes: '' })
    fetchPlayers()
    setSaving(false)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    if (deleteTarget.type === 'player') {
      await supabase.from('players').delete().eq('id', deleteTarget.id)
      fetchPlayers()
    } else {
      await supabase.from('payments').delete().eq('id', deleteTarget.id)
      if (selectedPlayer) viewPayments(selectedPlayer)
      fetchPlayers()
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  async function viewPayments(player: PlayerSummary) {
    setSelectedPlayer(player)
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('player_id', player.id)
      .order('payment_date')
    setPlayerPayments(data as Payment[] ?? [])
  }

  const filtered = players.filter((p) => p.division === activeDiv)

  const selectClass =
    'w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-slate-500 text-white'
  const inputClass =
    'w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-slate-500 text-white placeholder:text-slate-500'
  const labelClass = 'block text-xs text-slate-400 mb-1'

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm">🏀</div>
            <div>
              <h1 className="text-sm font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Manage players & payments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
              Public view
            </a>
            <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex gap-2">
          <button onClick={() => setShowAddPlayer(true)}
            className="px-4 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-white rounded-xl transition-colors">
            + Add Player
          </button>
          <button onClick={() => setShowAddPayment(true)}
            className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors">
            + Record Payment
          </button>
        </div>

        {/* Division tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
          {DIVISIONS.map((div) => (
            <button key={div} onClick={() => setActiveDiv(div)}
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                activeDiv === div ? 'bg-white text-slate-900 font-medium' : 'text-slate-400 hover:text-white'
              }`}>
              {div}
              <span className="ml-1.5 text-xs opacity-60">{players.filter((p) => p.division === div).length}</span>
            </button>
          ))}
        </div>

        {/* Players list */}
        {loading ? (
          <p className="text-sm text-slate-500 py-10 text-center">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 py-10 text-center">No players in {activeDiv} yet.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                  {p.jersey_number ?? '—'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.full_name}</p>
                  <p className="text-xs text-slate-500">
                    ₱{Number(p.total_paid).toLocaleString()} / ₱{Number(p.jersey_price).toLocaleString()} · {p.installment_count} installment{p.installment_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  p.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' :
                  p.payment_status === 'Partial' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {p.payment_status}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => viewPayments(p)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    History
                  </button>
                  <button onClick={() => setDeleteTarget({ type: 'player', id: p.id, name: p.full_name })}
                    className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── ADD PLAYER MODAL ── */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="font-semibold mb-4">Add Player</h2>
            <form onSubmit={addPlayer} className="space-y-3">
              <div>
                <label className={labelClass}>Full Name</label>
                <input required className={inputClass} placeholder="Juan dela Cruz"
                  value={playerForm.full_name}
                  onChange={(e) => setPlayerForm((f) => ({ ...f, full_name: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Division</label>
                <select required className={selectClass}
                  value={playerForm.division}
                  onChange={(e) => setPlayerForm((f) => ({ ...f, division: e.target.value as Division }))}>
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d} style={{ background: '#1e293b', color: '#fff' }}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Item Type</label>
                <select required className={selectClass}
                  value={playerForm.item_type}
                  onChange={(e) => setPlayerForm((f) => ({ ...f, item_type: e.target.value }))}>
                  {ITEM_TYPES.map((t) => (
                    <option key={t} value={t} style={{ background: '#1e293b', color: '#fff' }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Jersey Number</label>
                <input className={inputClass} placeholder="e.g. 10"
                  value={playerForm.jersey_number}
                  onChange={(e) => setPlayerForm((f) => ({ ...f, jersey_number: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Price (₱)</label>
                <input required type="number" step="0.01" className={inputClass} placeholder="1500.00"
                  value={playerForm.jersey_price}
                  onChange={(e) => setPlayerForm((f) => ({ ...f, jersey_price: e.target.value }))} />
              </div>
              {formError && <p className="text-xs text-red-400">{formError}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAddPlayer(false)}
                  className="flex-1 py-2 text-sm rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 rounded-xl transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Add Player'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD PAYMENT MODAL ── */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="font-semibold mb-4">Record Payment</h2>
            <form onSubmit={addPayment} className="space-y-3">
              <div>
                <label className={labelClass}>Player</label>
                <select required className={selectClass}
                  value={paymentForm.player_id}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, player_id: e.target.value }))}>
                  <option value="" style={{ background: '#1e293b', color: '#94a3b8' }}>Select player…</option>
                  {DIVISIONS.map((div) => (
                    <optgroup key={div} label={div} style={{ background: '#1e293b', color: '#94a3b8' }}>
                      {players.filter((p) => p.division === div).map((p) => (
                        <option key={p.id} value={p.id} style={{ background: '#1e293b', color: '#fff' }}>{p.full_name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Amount Paid (₱)</label>
                <input required type="number" step="0.01" className={inputClass} placeholder="500.00"
                  value={paymentForm.amount_paid}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, amount_paid: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Payment Date</label>
                <input required type="date" className={inputClass}
                  value={paymentForm.payment_date}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, payment_date: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Installment #</label>
                <input type="number" min="1" className={inputClass}
                  value={paymentForm.installment_number}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, installment_number: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Notes (optional)</label>
                <input className={inputClass} placeholder="e.g. GCash payment"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              {formError && <p className="text-xs text-red-400">{formError}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAddPayment(false)}
                  className="flex-1 py-2 text-sm rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PAYMENT HISTORY MODAL ── */}
      {selectedPlayer && !deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold">{selectedPlayer.full_name}</h2>
                <p className="text-xs text-slate-400">{selectedPlayer.division} · Jersey #{selectedPlayer.jersey_number ?? '—'}</p>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>
            <div className="bg-white/5 rounded-xl p-3 mb-4 flex justify-between text-sm">
              <span className="text-slate-400">Total Price</span>
              <span>₱{Number(selectedPlayer.jersey_price).toLocaleString()}</span>
            </div>
            {playerPayments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No payments yet.</p>
            ) : (
              <div className="space-y-2">
                {playerPayments.map((pay) => (
                  <div key={pay.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">₱{Number(pay.amount_paid).toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{pay.payment_date} · Installment #{pay.installment_number}</p>
                      {pay.notes && <p className="text-xs text-slate-500 italic">{pay.notes}</p>}
                    </div>
                    <button
                      onClick={() => setDeleteTarget({ type: 'payment', id: pay.id, label: `₱${Number(pay.amount_paid).toLocaleString()} on ${pay.payment_date}` })}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
              <span className="text-slate-400">Balance</span>
              <span className={Number(selectedPlayer.balance) > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                ₱{Number(selectedPlayer.balance).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-xs text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            {deleteTarget.type === 'player' ? (
              <>
                <h3 className="font-semibold text-base mb-1">Delete Player?</h3>
                <p className="text-sm text-slate-400 mb-1">
                  <span className="text-white font-medium">{deleteTarget.name}</span> will be permanently removed.
                </p>
                <p className="text-xs text-red-400 mb-5">All payment records will also be deleted.</p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-base mb-1">Delete Payment?</h3>
                <p className="text-sm text-slate-400 mb-5">
                  <span className="text-white font-medium">{deleteTarget.label}</span> will be permanently removed.
                </p>
              </>
            )}
            <div className="flex gap-2">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="flex-1 py-2 text-sm rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}