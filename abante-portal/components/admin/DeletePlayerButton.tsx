'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  playerId: string
  playerName: string
}

export default function DeletePlayerButton({ playerId, playerName }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    setLoading(true)
    await supabase.from('players').delete().eq('id', playerId)
    setLoading(false)
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2.5 py-1.5 rounded-lg font-semibold"
          style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
        >
          {loading ? '...' : 'Delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2.5 py-1.5 rounded-lg"
          style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs px-3 py-1.5 rounded-lg transition-colors"
      style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
    >
      Delete
    </button>
  )
}