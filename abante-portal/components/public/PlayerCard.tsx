'use client'

import { PlayerPaymentSummary, PaymentStatus } from '@/lib/types'

interface Props {
  player: PlayerPaymentSummary
  accentColor: string
  accentBg: string
}

const STATUS: Record<PaymentStatus, { label: string; cls: string; barColor: string }> = {
  Paid:    { label: 'Paid',    cls: 'badge badge-green',  barColor: 'var(--green)'  },
  Partial: { label: 'Partial', cls: 'badge badge-yellow', barColor: 'var(--yellow)' },
  Unpaid:  { label: 'Unpaid',  cls: 'badge badge-red',    barColor: 'var(--red)'    },
}

export default function PlayerCard({ player, accentColor, accentBg }: Props) {
  const s = STATUS[player.payment_status]
  const pct = player.jersey_price > 0
    ? Math.min(Math.round((player.total_paid / player.jersey_price) * 100), 100)
    : 0

  return (
    <div
      className="card card-hover"
      style={{ padding: 0, overflow: 'hidden', cursor: 'default', position: 'relative' }}
    >
      {/* Top color bar */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, opacity: 0.6 }} />

      <div style={{ padding: '20px 22px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {/* Jersey number */}
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: accentBg,
              border: `1px solid ${accentColor}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: player.jersey_number ? 18 : 14,
                color: accentColor,
              }}>
                {player.jersey_number ?? '—'}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 15, letterSpacing: '-0.01em',
                color: 'var(--text)', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {player.full_name}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                {player.installment_count > 0
                  ? `${player.installment_count} payment${player.installment_count !== 1 ? 's' : ''}`
                  : 'No payments yet'}
              </p>
            </div>
          </div>

          {/* Badge */}
          <span className={s.cls} style={{ flexShrink: 0 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'currentColor', display: 'inline-block',
            }} />
            {s.label}
          </span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: accentColor }}>{pct}%</span>
          </div>
          <div style={{ height: 5, background: 'var(--bg-3)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: s.barColor,
              borderRadius: 99,
              transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        </div>

        {/* Amounts */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Amount Paid</p>
            <p style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 22, letterSpacing: '-0.02em',
              color: player.payment_status === 'Unpaid' ? 'var(--text-3)' : 'var(--color-green)',
            }}>
              ₱{Number(player.total_paid).toLocaleString()}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Jersey Price</p>
            <p style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 22, letterSpacing: '-0.02em', color: 'var(--text)',
            }}>
              ₱{Number(player.jersey_price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Balance row */}
        {Number(player.balance) > 0 && (
          <div style={{
            marginTop: 14,
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--red-dim)',
            border: '1px solid rgba(248,113,113,0.15)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Remaining balance</span>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--red)' }}>
              ₱{Number(player.balance).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}