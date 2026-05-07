'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Division } from '@/lib/types'

const DIVISIONS: Division[] = ['Mosquito', 'Kids', 'Midget']

const inputStyle = {
  backgroundColor: 'var(--color-surface-2)',
  border: '1.5px solid var(--color-border)',
  color: 'var(--color-text)',
  borderRadius: '12px',
  padding: '12px 16px',
  width: '100%',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  transition: 'border-color 0.15s',
}

export default function PlayerForm() {
  const [fullName, setFullName] = useState('')
  const [division, setDivision] = useState<Division>('Mosquito')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [jerseyPrice, setJerseyPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit() {
    if (!fullName.trim() || !jerseyPrice) {
      setError('Full name and jersey price are required.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.from('players').insert({
      full_name: fullName.trim(),
      division,
      jersey_number: jerseyNumber.trim() || null,
      jersey_price: parseFloat(jerseyPrice),
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/admin/dashboard/players'), 800)
    }
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: 'var(--color-muted)',
    marginBottom: '6px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  }

  return (
    <div
      className="rounded-2xl border border-[var(--color-border)] p-6"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Juan dela Cruz"
            style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
        </div>

        {/* Division */}
        <div>
          <label style={labelStyle}>Division *</label>
          <div className="grid grid-cols-3 gap-2">
            {DIVISIONS.map((div) => (
              <button
                key={div}
                type="button"
                onClick={() => setDivision(div)}
                className="py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: division === div ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  color: division === div ? '#000' : 'var(--color-muted)',
                  border: `1.5px solid ${division === div ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        {/* Jersey Number */}
        <div>
          <label style={labelStyle}>Jersey Number (optional)</label>
          <input
            type="text"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            placeholder="e.g. 10"
            style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
        </div>

        {/* Jersey Price */}
        <div>
          <label style={labelStyle}>Jersey Price (₱) *</label>
          <input
            type="number"
            value={jerseyPrice}
            onChange={(e) => setJerseyPrice(e.target.value)}
            placeholder="e.g. 850"
            min="0"
            style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
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
            ✓ Player added! Redirecting...
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="flex-1 py-3 rounded-xl font-display text-xl tracking-widest text-black disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {loading ? 'SAVING...' : 'SAVE PLAYER'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-3 rounded-xl text-sm text-[var(--color-muted)] transition-colors hover:text-white"
            style={{ backgroundColor: 'var(--color-surface-2)', border: '1.5px solid var(--color-border)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}