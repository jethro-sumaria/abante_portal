'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeletePaymentButton({ paymentId }: { paymentId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    setLoading(true)
    await supabase.from('payments').delete().eq('id', paymentId)
    setLoading(false)
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2 py-1 rounded-lg"
          style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
        >
          {loading ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-1 rounded-lg"
          style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-muted)' }}
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs px-2.5 py-1 rounded-lg transition-colors"
      style={{ color: 'var(--color-muted)' }}
      title="Delete payment"
    >
      ✕
    </button>
  )
}