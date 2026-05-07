import { createClient } from '@/lib/supabase/server'
import { PlayerPaymentSummary, Division } from '@/lib/types'
import DivisionTabs from '@/components/public/DivisionTabs'
import Link from 'next/link'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('player_payment_summary')
    .select('*')
    .order('full_name', { ascending: true })

  const players: PlayerPaymentSummary[] = data ?? []
  const divisions: Division[] = ['Mosquito', 'Kids', 'Midget']
  const grouped = divisions.reduce((acc, div) => {
    acc[div] = players.filter((p) => p.division === div)
    return acc
  }, {} as Record<Division, PlayerPaymentSummary[]>)

  const paid    = players.filter((p) => p.payment_status === 'Paid').length
  const partial = players.filter((p) => p.payment_status === 'Partial').length
  const unpaid  = players.filter((p) => p.payment_status === 'Unpaid').length
  const totalCollected = players.reduce((s, p) => s + Number(p.total_paid), 0)
  const totalExpected  = players.reduce((s, p) => s + Number(p.jersey_price), 0)
  const collectPct = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,9,16,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#0d0a00', lineHeight: 1 }}>L</span>
            </div>
            <div>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1 }}>Liga Tracker</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Jersey Payments</p>
            </div>
          </div>
          <Link
            href="/admin/login"
            style={{
              fontSize: 12, fontWeight: 500,
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
          >
            Admin →
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px 80px', flex: 1, width: '100%' }}>

        {/* ── Hero ── */}
        <div className="fade-up" style={{ marginBottom: 48 }}>
          <p className="label" style={{ marginBottom: 12 }}>Season 2025 · All Divisions</p>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(40px, 8vw, 72px)',
            letterSpacing: '-0.03em', lineHeight: 1,
            color: 'var(--text)',
          }}>
            Jersey<br />
            <span style={{ color: 'var(--gold)' }}>Payments</span>
          </h1>
          <p style={{ color: 'var(--text-2)', marginTop: 16, maxWidth: 440, fontSize: 15 }}>
            Full transparency on jersey payments across Mosquito, Kids, and Midget divisions.
          </p>
        </div>

        {/* ── Stats grid ── */}
        <div className="fade-up d1" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 48,
        }}>
          {/* Collection card — wider */}
          <div className="card" style={{ padding: '20px 24px', gridColumn: 'span 2' }}>
            <p className="label" style={{ marginBottom: 10 }}>Total collected</p>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--green)' }}>
              ₱{totalCollected.toLocaleString()}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>of ₱{totalExpected.toLocaleString()} target</p>
            <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${collectPct}%`, background: 'var(--green)', borderRadius: 99, transition: 'width 0.7s ease' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>{collectPct}% complete</p>
          </div>

          {[
            { label: 'Total Players', value: players.length,  color: 'var(--text)',   icon: '👥' },
            { label: 'Fully Paid',    value: paid,            color: 'var(--green)',  icon: '✓'  },
            { label: 'Partial',       value: partial,         color: 'var(--yellow)', icon: '◑'  },
            { label: 'Unpaid',        value: unpaid,          color: 'var(--red)',    icon: '○'  },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</p>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36, letterSpacing: '-0.03em', color: s.color, lineHeight: 1 }}>
                {s.value}
              </p>
              <p className="label" style={{ marginTop: 6 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Division tabs ── */}
        <div className="fade-up d2">
          <DivisionTabs grouped={grouped} />
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Liga Tracker © {new Date().getFullYear()} · Built for transparency</p>
      </footer>
    </div>
  )
}