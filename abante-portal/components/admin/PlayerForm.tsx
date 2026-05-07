'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Division } from '@/lib/types'

const DIVISIONS: Division[] = ['Mosquito', 'Kids', 'Midget']

const inputStyle = {
  backgroundColor: 'var(--bg-2)',
  border: '1.5px solid var(--color-border)',
  color: 'var(--color-text)',
  borderRadius: '12px',
  padding: '12px 16px',
  width: '100%',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  transition: 'border-color 0.2s, box-shadow 0.2s',
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
    color: 'var(--color-accent-bright)',
    marginBottom: '6px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  }

  return (
    <div
      className="rounded-xl border border-[var(--color-border)] p-6"
      style={{ backgroundColor: 'var(--bg-1)' }}
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
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
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
                className="py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: division === div ? 'var(--color-accent)' : 'var(--bg-2)',
                  color: division === div ? '#fff' : 'var(--color-muted)',
                  border: `1.5px solid ${division === div ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  boxShadow: division === div ? '0 4px 12px rgba(59,130,246,0.25)' : 'none',
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
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
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
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            ✓ Player added! Redirecting...
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className="flex-1 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-50 transition-all duration-200 hover:shadow-[0_6px_20px_rgba(59,130,246,0.35)]"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 14px rgba(59,130,246,0.25)' }}
          >
            {loading ? 'Saving...' : 'Save Player'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-3 rounded-xl text-sm text-[var(--color-muted)] transition-all duration-200 hover:text-white hover:border-[var(--border-hover)]"
            style={{ backgroundColor: 'var(--bg-2)', border: '1.5px solid var(--color-border)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}