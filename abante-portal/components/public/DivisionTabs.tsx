'use client'

import { useState } from 'react'
import { Division, PlayerPaymentSummary } from '@/lib/types'
import PlayerCard from './PlayerCard'

interface Props {
  grouped: Record<Division, PlayerPaymentSummary[]>
}

const DIVISIONS: { key: Division; label: string; color: string; bg: string }[] = [
  { key: 'Mosquito', label: 'Mosquito', color: '#f5c842', bg: 'rgba(245,200,66,0.08)' },
  { key: 'Kids',     label: 'Kids',     color: '#4d9ef7', bg: 'rgba(77,158,247,0.08)' },
  { key: 'Midget',   label: 'Midget',   color: '#ff5e57', bg: 'rgba(255,94,87,0.08)'  },
]

export default function DivisionTabs({ grouped }: Props) {
  const [active, setActive] = useState<Division>('Mosquito')
  const activeMeta = DIVISIONS.find((d) => d.key === active)!
  const players = grouped[active] ?? []

  return (
    <div>
      {/* Section label */}
      <p className="label" style={{ marginBottom: 16 }}>Browse by division</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {DIVISIONS.map((div) => {
          const isActive = active === div.key
          const count = grouped[div.key]?.length ?? 0
          return (
            <button
              key={div.key}
              onClick={() => setActive(div.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isActive ? div.color : 'var(--border)'}`,
                background: isActive ? div.bg : 'transparent',
                color: isActive ? div.color : 'var(--text-2)',
                fontFamily: isActive ? 'Syne, sans-serif' : 'Inter, sans-serif',
                fontWeight: isActive ? 700 : 400,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.18s',
                letterSpacing: isActive ? '-0.01em' : 0,
              }}
            >
              {div.label}
              <span style={{
                fontSize: 11,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                background: isActive ? `${div.color}22` : 'var(--bg-2)',
                color: isActive ? div.color : 'var(--text-3)',
                borderRadius: 99,
                padding: '1px 7px',
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Players */}
      {players.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 28,
          }}>
            👥
          </div>
          <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 8 }}>
            No players yet
          </p>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Players will appear here once the admin adds them.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {players.map((player, i) => (
            <div
              key={player.id}
              className="fade-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <PlayerCard player={player} accentColor={activeMeta.color} accentBg={activeMeta.bg} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}