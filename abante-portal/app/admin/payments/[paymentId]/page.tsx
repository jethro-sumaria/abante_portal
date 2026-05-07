import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Payment } from '@/lib/types'
import PaymentForm from '@/components/admin/PaymentForm'
import DeletePaymentButton from '@/components/admin/DeletePaymentButton'

interface Props {
  params: Promise<{ playerId: string }>
}

export default async function PlayerPaymentsPage({ params }: Props) {
  const { playerId } = await params
  const supabase = await createClient()

  const [{ data: summary }, { data: payments }] = await Promise.all([
    supabase
      .from('player_payment_summary')
      .select('*')
      .eq('id', playerId)
      .single(),
    supabase
      .from('payments')
      .select('*')
      .eq('player_id', playerId)
      .order('installment_number'),
  ])

  if (!summary) notFound()

  const paymentList: Payment[] = payments ?? []

  const STATUS_COLOR: Record<string, string> = {
    Paid: '#22c55e',
    Partial: '#f59e0b',
    Unpaid: '#ef4444',
  }

  const pct = summary.jersey_price > 0
    ? Math.min((summary.total_paid / summary.jersey_price) * 100, 100)
    : 0

  return (
    <div className="animate-fade-up max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <a
          href="/admin/dashboard/players"
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-3 inline-block"
        >
          ← Back to Players
        </a>
        <h1 className="font-display text-4xl md:text-5xl tracking-wider text-white">{summary.full_name.toUpperCase()}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ backgroundColor: `${STATUS_COLOR[summary.payment_status]}20`, color: STATUS_COLOR[summary.payment_status] }}
          >
            {summary.payment_status}
          </span>
          <span className="text-xs text-[var(--color-muted)]">{summary.division} Division</span>
          {summary.jersey_number && (
            <span className="text-xs text-[var(--color-muted)]">Jersey #{summary.jersey_number}</span>
          )}
        </div>
      </div>

      {/* Payment summary card */}
      <div
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-6"
      >
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <p className="text-xs text-[var(--color-muted)] mb-1">Jersey Price</p>
            <p className="font-display text-2xl text-white">₱{Number(summary.jersey_price).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted)] mb-1">Total Paid</p>
            <p className="font-display text-2xl" style={{ color: '#22c55e' }}>₱{Number(summary.total_paid).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted)] mb-1">Balance</p>
            <p className="font-display text-2xl" style={{ color: summary.balance > 0 ? '#ef4444' : '#22c55e' }}>
              ₱{Number(summary.balance).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[var(--color-muted)]">Payment Progress</span>
            <span style={{ color: 'var(--color-accent)' }}>{Math.round(pct)}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #22c55e88, #22c55e)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Add payment */}
      <div
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-6"
      >
        <h2 className="font-display text-2xl tracking-wider text-white mb-5">ADD PAYMENT</h2>
        <PaymentForm
          playerId={playerId}
          nextInstallment={(paymentList.length + 1)}
          balance={Number(summary.balance)}
        />
      </div>

      {/* Payment history */}
      <div
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
      >
        <h2 className="font-display text-2xl tracking-wider text-white mb-5">
          PAYMENT HISTORY
          <span className="font-body text-sm font-normal text-[var(--color-muted)] ml-2 tracking-normal">
            {paymentList.length} installment{paymentList.length !== 1 ? 's' : ''}
          </span>
        </h2>

        {paymentList.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] text-center py-8">No payments recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {paymentList.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-base flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}
                >
                  {payment.installment_number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">₱{Number(payment.amount_paid).toLocaleString()}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {new Date(payment.payment_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {payment.notes && ` · ${payment.notes}`}
                  </p>
                </div>
                <DeletePaymentButton paymentId={payment.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}