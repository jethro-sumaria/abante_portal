'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  playerId: string
  nextInstallment: number
  balance: number
}

const inputStyle = {
  backgroundColor: 'var(--color-surface-2)',
  border: '1.5px solid var(--color-border)',
  color: 'var(--color-text)',
  borderRadius: '12px',
  padding: '10px 14px',
  width: '100%',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'var(--font-body)',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--color-muted)',
  marginBottom: '6px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}

export default function PaymentForm({ playerId, nextInstallment, balance }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [amount, setAmount] = useState(balance > 0 ? String(balance) : '')
  const [date, setDate] = useState(today)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit() {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.from('payments').insert({
      player_id: playerId,
      amount_paid: parseFloat(amount),
      payment_date: date,
      installment_number: nextInstallment,
      notes: notes.trim() || null,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setAmount('')
        setNotes('')
        router.refresh()
      }, 800)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}>Amount (₱) *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Balance: ₱${balance.toLocaleString()}`}
            min="0"
            style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
        </div>
        <div>
          <label style={labelStyle}>Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...inputStyle, colorScheme: 'dark' }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Notes (optional)</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Cash payment, GCash"
          style={inputStyle}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
        />
      </div>

      <div
        className="text-xs text-[var(--color-muted)] px-1"
        style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '8px' }}
      >
        Installment #{nextInstallment}
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          ✓ Payment recorded!
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || success}
        className="w-full py-3 rounded-xl font-display text-xl tracking-widest text-black disabled:opacity-50 transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        {loading ? 'SAVING...' : 'RECORD PAYMENT'}
      </button>
    </div>
  )
}