'use server'

import { createClient } from '@/lib/supabase/server'

export async function getBalance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated', balance: null }

  const { data: wallets } = await supabase
    .from('wallets')
    .select('balance, currency')
    .eq('user_id', user.id)

  if (!wallets || wallets.length === 0) {
    return { balance: 0, error: null }
  }

  // Convert all balances to USD using fixed rates
  const rates: Record<string, number> = {
    'USD': 1,
    'EUR': 1.1,
    'GBP': 1.27,
    'BTC': 95000,
    'ETH': 3500,
    'CAD': 0.72,
  };

  const totalBalance = wallets.reduce((sum, wallet) => {
    const rate = rates[wallet.currency] || 1
    return sum + (Number(wallet.balance) * rate)
  }, 0)
  
  return { balance: totalBalance, error: null }
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

  // Get sender's wallets
  const { data: senderWallets } = await supabase
    .from('wallets')
    .select('id, balance, currency')
    .eq('user_id', user.id)

  if (!senderWallets || senderWallets.length === 0) {
    return { error: 'No wallets found', success: false }
  }

  // Find USD wallet or use first wallet
  let usdWallet = senderWallets.find(w => w.currency === 'USD')
  
  if (!usdWallet) {
    // If no USD wallet, deduct from first wallet (simplified logic)
    usdWallet = senderWallets[0]
  }

  if (Number(usdWallet.balance) < amountInUSD) {
    return { error: 'Insufficient balance', success: false }
  }

  // Deduct from sender's wallet
  const { error: senderError } = await supabase
    .from('wallets')
    .update({ balance: Number(usdWallet.balance) - amountInUSD })
    .eq('id', usdWallet.id)
    .eq('user_id', user.id)

  if (senderError) return { error: 'Failed to deduct balance', success: false }

  const { data: recipientUser } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', recipientEmail)
    .single()

  if (recipientUser) {
    // Find or create USD wallet for recipient
    const { data: recipientUsdWallet } = await supabase
      .from('wallets')
      .select('id, balance')
      .eq('user_id', recipientUser.id)
      .eq('currency', 'USD')
      .single()

    if (recipientUsdWallet) {
      await supabase
        .from('wallets')
        .update({ balance: Number(recipientUsdWallet.balance) + amountInUSD })
        .eq('id', recipientUsdWallet.id)
        .eq('user_id', recipientUser.id)
    } else {
      // Create USD wallet for recipient
      await supabase
        .from('wallets')
        .insert({
          user_id: recipientUser.id,
          currency: 'USD',
          balance: amountInUSD,
          type: 'fiat'
        })
    }
  }

  const { error: txError } = await supabase.from('transactions').insert({
    sender_id: user.id,
    sender_email: user.email,
    recipient_id: recipientUser?.id || null,
    recipient_email: recipientEmail,
    amount: amountInUSD,
    note: note || null,
    created_at: new Date().toISOString(),
  })

  if (txError) {
    console.error('Failed to record transaction:', txError)
    return { error: 'Transaction recorded but failed to save history: ' + txError.message, success: false }
  }

  return { success: true, error: null, newBalance: Number(usdWallet.balance) - amountInUSD }
}

export async function getTransactions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { transactions: [] }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(10)

  return { transactions: transactions || [] }
}
