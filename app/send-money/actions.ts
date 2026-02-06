'use server'

import { createClient } from '@/lib/supabase/server'

export async function getBalance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  // Try to get existing balance
  const { data: balance } = await supabase
    .from('balances')
    .select('amount')
    .eq('user_id', user.id)
    .single()

  if (balance) return { balance: balance.amount }

  // Create default balance of $100 for new user
  const { data: newBalance, error } = await supabase
    .from('balances')
    .insert({ user_id: user.id, email: user.email, amount: 100 })
    .select('amount')
    .single()

  if (error) return { error: error.message }
  return { balance: newBalance.amount }
}

export async function checkRecipient(email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }
  if (email === user.email) return { error: 'Cannot send money to yourself' }

  const { data: recipient } = await supabase
    .from('balances')
    .select('email')
    .eq('email', email)
    .single()

  if (!recipient) return { error: 'Recipient not found. They must have an account first.' }
  return { exists: true }
}

export async function sendMoney(recipientEmail: string, amount: number, note?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }
  if (recipientEmail === user.email) return { error: 'Cannot send money to yourself' }
  if (amount <= 0) return { error: 'Amount must be positive' }

  // Get sender's balance (create if doesn't exist)
  let { data: senderBalance } = await supabase
    .from('balances')
    .select('amount')
    .eq('user_id', user.id)
    .single()

  if (!senderBalance) {
    const { data: newBalance, error } = await supabase
      .from('balances')
      .insert({ user_id: user.id, email: user.email, amount: 100 })
      .select('amount')
      .single()
    if (error) return { error: 'Failed to initialize balance' }
    senderBalance = newBalance
  }

  if (senderBalance.amount < amount) {
    return { error: 'Insufficient balance' }
  }

  // Check if recipient exists
  const { data: recipientBalance } = await supabase
    .from('balances')
    .select('amount, user_id')
    .eq('email', recipientEmail)
    .single()

  if (!recipientBalance) {
    return { error: 'Recipient not found. They must have an account first.' }
  }

  // Deduct from sender
  const { error: senderError } = await supabase
    .from('balances')
    .update({ amount: senderBalance.amount - amount, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  if (senderError) return { error: 'Failed to deduct balance' }

  // Add to recipient
  const { error: recipientError } = await supabase
    .from('balances')
    .update({ amount: recipientBalance.amount + amount, updated_at: new Date().toISOString() })
    .eq('email', recipientEmail)

  if (recipientError) {
    // Rollback sender's balance
    await supabase
      .from('balances')
      .update({ amount: senderBalance.amount })
      .eq('user_id', user.id)
    return { error: 'Failed to send to recipient' }
  }

  // Create transaction record
  await supabase.from('transactions').insert({
    sender_id: user.id,
    sender_email: user.email,
    recipient_id: recipientBalance.user_id,
    recipient_email: recipientEmail,
    amount,
    note: note || null,
  })

  return { success: true, newBalance: senderBalance.amount - amount }
}

export async function getTransactions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated', transactions: [] }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(10)

  return { 
    transactions: transactions || [],
    userId: user.id 
  }
}
