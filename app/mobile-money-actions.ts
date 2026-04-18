'use server'

import { createClient } from '@/lib/supabase/server'

export interface SavedRecipient {
  id: string;
  name: string;
  phoneNumber: string;
  providerCode: string;
  countryCode: string;
}

export async function getMobileMoneyBalance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', balance: null }

  const { data: balance } = await supabase
    .from('balances')
    .select('amount')
    .eq('user_id', user.id)
    .single()

  if (balance) return { balance: balance.amount, error: null }
  return { balance: 100, error: null }
}

export async function getSavedRecipients() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { recipients: [] }

  const { data: recipients } = await supabase
    .from('mobile_money_recipients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const formatted: SavedRecipient[] = (recipients || []).map(r => ({
    id: r.id,
    name: r.recipient_name || r.phone_number,
    phoneNumber: r.phone_number,
    providerCode: r.provider,
    countryCode: r.country,
  }))

  return { recipients: formatted }
}

export async function saveRecipient(data: { name: string; phoneNumber: string; providerCode: string; countryCode: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: recipient, error } = await supabase
    .from('mobile_money_recipients')
    .insert({
      user_id: user.id,
      phone_number: data.phoneNumber,
      provider: data.providerCode,
      country: data.countryCode,
      recipient_name: data.name,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  return { 
    success: true, 
    recipient: {
      id: recipient.id,
      name: recipient.recipient_name,
      phoneNumber: recipient.phone_number,
      providerCode: recipient.provider,
      countryCode: recipient.country,
    }
  }
}

export async function sendMobileMoney(
  recipientId: string | null, 
  recipientData: any, 
  amountUSD: number, 
  sourceCurrency: string, 
  note: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const { data: senderBalance } = await supabase
    .from('balances')
    .select('amount')
    .eq('user_id', user.id)
    .single()

  if (!senderBalance || senderBalance.amount < amountUSD) {
    return { error: 'Insufficient balance', success: false }
  }

  const { error: senderError } = await supabase
    .from('balances')
    .update({ amount: senderBalance.amount - amountUSD })
    .eq('user_id', user.id)

  if (senderError) return { error: 'Failed to deduct balance', success: false }

  await supabase.from('transactions').insert({
    sender_id: user.id,
    sender_email: user.email,
    recipient_email: recipientData?.phoneNumber,
    amount: amountUSD,
    note: `Mobile Money to ${recipientData?.providerCode}: ${note}`,
  })

  return { success: true, error: null }
}
