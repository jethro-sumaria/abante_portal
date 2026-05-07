'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/admin/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,200,66,0.05) 0%, transparent 60%), var(--bg)',
    }}>

      {/* Card */}
      <div className="fade-up card" style={{ width: '100%', maxWidth: 400, padding: '36px 32px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: '#0d0a00', lineHeight: 1 }}>L</span>
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Liga Jersey Tracker</p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p className="label" style={{ marginBottom: 8 }}>Email address</p>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="admin@liga.com"
            />
          </div>

          <div>
            <p className="label" style={{ marginBottom: 8 }}>Password</p>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              background: 'var(--red-dim)', border: '1px solid rgba(255,94,87,0.2)',
              color: 'var(--red)', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button
            className="btn-gold"
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '13px 20px', fontSize: 14 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>

        {/* Divider */}
        <div style={{ margin: '24px 0', borderTop: '1px solid var(--border)' }} />

        <Link
          href="/"
          style={{ display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}
        >
          ← Back to public view
        </Link>
      </div>
    </div>
  )
}