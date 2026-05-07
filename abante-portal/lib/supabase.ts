import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Division = 'Mosquito' | 'Kids' | 'Midget'
export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid'

export interface PlayerSummary {
  id: string
  full_name: string
  division: Division
  jersey_number: string | null
  jersey_price: number
  total_paid: number
  balance: number
  payment_status: PaymentStatus
  installment_count: number
  item_type: string
}

export interface Player {
  id: string
  full_name: string
  division: Division
  jersey_number: string | null
  jersey_price: number
  created_at: string
}

export interface Payment {
  id: string
  player_id: string
  amount_paid: number
  payment_date: string
  installment_number: number
  notes: string | null
  created_at: string
}