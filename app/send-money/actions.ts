'use server'

import { createClient } from '@/lib/supabase/server'

export async function getBalance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated', balance: null }

  const { data: balance } = await supabase
    .from('balances')
    .select('amount')
    .eq('user_id', user.id)
    .single()

  if (balance) return { balance: balance.amount, error: null }

  const { data: newBalance, error } = await supabase
    .from('balances')
    .insert({ user_id: user.id, email: user.email, amount: 100 })
    .select('amount')
    .single()

  if (error) return { error: error.message, balance: null }
  
  return { balance: newBalance?.amount ?? 100, error: null }
}

export async function checkRecipient(email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated', exists: false }
  if (email === user.email) return { error: 'Cannot send money to yourself', exists: false }

  const { data: existingUser } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single()

  if (!existingUser) {
    return { error: 'Recipient not found. They must have an account first.', exists: false }
  }

  return { exists: true, error: null }
}

export async function sendMoney(
  recipientEmail: string, 
  amountInUSD: number,
  note?: string,
  transferReason?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated', success: false }
  if (recipientEmail === user.email) return { error: 'Cannot send money to yourself', success: false }
  if (amountInUSD <= 0) return { error: 'Amount must be positive', success: false }

  const { data: senderBalance } = await supabase
    .from('balances')
    .select('amount')
    .eq('user_id', user.id)
    .single()

  if (!senderBalance || senderBalance.amount < amountInUSD) {
    return { error: 'Insufficient balance', success: false }
  }

  const { error: senderError } = await supabase
    .from('balances')
    .update({ amount: senderBalance.amount - amountInUSD })
    .eq('user_id', user.id)

  if (senderError) return { error: 'Failed to deduct balance', success: false }

  const { data: recipientUser } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', recipientEmail)
    .single()

  if (recipientUser) {
    const { data: recipientBalance } = await supabase
      .from('balances')
      .select('amount')
      .eq('user_id', recipientUser.id)
      .single()

    if (recipientBalance) {
      await supabase
        .from('balances')
        .update({ amount: recipientBalance.amount + amountInUSD })
        .eq('user_id', recipientUser.id)
    } else {
      await supabase
        .from('balances')
        .insert({ user_id: recipientUser.id, email: recipientEmail, amount: amountInUSD })
    }
  }

  await supabase.from('transactions').insert({
    sender_id: user.id,
    sender_email: user.email,
    recipient_email: recipientEmail,
    amount: amountInUSD,
    note: note || null,
    transfer_reason: transferReason || null,
  })

  console.log(`✅ Confirmation sent to sender: ${user.email} - Sent ${amountInUSD} USD to ${recipientEmail}`)
  console.log(`✅ Confirmation sent to recipient: ${recipientEmail} - Received ${amountInUSD} USD from ${user.email}`)

  return { success: true, error: null, newBalance: senderBalance.amount - amountInUSD }
}

export async function getTransactions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { transactions: [] }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${user.id},recipient_email.eq.${user.email}`)
    .order('created_at', { ascending: false })
    .limit(10)

  return { transactions: transactions || [] }
}
