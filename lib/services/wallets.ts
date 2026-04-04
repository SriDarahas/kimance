import type { SupabaseClient } from '@supabase/supabase-js'

export interface WalletRecord {
  id: string
  user_id: string
  currency: string
  balance: number
  created_at: string
}

type FundingMethod = 'bank_transfer' | 'card' | 'crypto_transfer'
export type WalletTransactionType = 'add_funds' | 'send'

type FundingInput = {
  userId: string
  email: string
  walletId: string
  amount: number
  method: FundingMethod
  note?: string
}

const FUNDING_NOTE_PREFIX = 'ADD_FUNDS'
const SEND_NOTE_PREFIX = 'SEND'

export function isFundingTransaction(note: string | null | undefined) {
  return typeof note === 'string' && note.startsWith(`${FUNDING_NOTE_PREFIX}:`)
}

export function isSendTransaction(note: string | null | undefined) {
  return typeof note === 'string' && note.startsWith(`${SEND_NOTE_PREFIX}:`)
}

function buildTxNote(prefix: string, detail?: string) {
  if (!detail) return `${prefix}:`
  return `${prefix}:${detail.trim()}`
}

function isMissingColumnError(message: string | undefined) {
  if (!message) return false
  const lower = message.toLowerCase()
  return (
    lower.includes('could not find') ||
    lower.includes('column') ||
    lower.includes('does not exist')
  )
}

type RecordTransactionInput = {
  userId: string
  senderEmail: string
  recipientId?: string
  recipientEmail: string
  amount: number
  type: WalletTransactionType
  note?: string
}

export async function recordTransaction(
  supabase: SupabaseClient,
  input: RecordTransactionInput
) {
  const legacyPayload = {
    sender_id: input.userId,
    sender_email: input.senderEmail,
    recipient_id: input.recipientId ?? input.userId,
    recipient_email: input.recipientEmail,
    amount: input.amount,
    note: input.note ?? null,
  }

  const typedPayload = {
    ...legacyPayload,
    user_id: input.userId,
    type: input.type,
  }

  let { data, error } = await supabase
    .from('transactions')
    .insert(typedPayload)
    .select('*')
    .single()

  if (error && isMissingColumnError(error.message)) {
    const legacyResult = await supabase
      .from('transactions')
      .insert(legacyPayload)
      .select('*')
      .single()
    data = legacyResult.data
    error = legacyResult.error
  }

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getUserWallets(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as WalletRecord[]
}

export async function getUserGlobalBalance(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('balances')
    .select('amount')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return Number(data?.amount ?? 0)
}

export async function setUserGlobalBalance(
  supabase: SupabaseClient,
  input: { userId: string; email: string; amount: number }
) {
  const { data: existing, error: existingError } = await supabase
    .from('balances')
    .select('user_id')
    .eq('user_id', input.userId)
    .maybeSingle()

  if (existingError) {
    throw new Error(existingError.message)
  }

  if (existing) {
    const { data, error } = await supabase
      .from('balances')
      .update({
        amount: input.amount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', input.userId)
      .select('amount')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return Number(data.amount)
  }

  const { data, error } = await supabase
    .from('balances')
    .insert({
      user_id: input.userId,
      email: input.email,
      amount: input.amount,
    })
    .select('amount')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return Number(data.amount)
}

export async function applyWalletFunding(
  supabase: SupabaseClient,
  input: FundingInput
) {
  const fundingAmount = Number(input.amount)
  if (!Number.isFinite(fundingAmount) || fundingAmount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id, balance, currency')
    .eq('id', input.walletId)
    .eq('user_id', input.userId)
    .single()

  if (walletError || !wallet) {
    throw new Error('Wallet not found')
  }

  const newWalletBalance = Number(wallet.balance) + fundingAmount

  const { error: walletUpdateError } = await supabase
    .from('wallets')
    .update({ balance: newWalletBalance })
    .eq('id', input.walletId)
    .eq('user_id', input.userId)

  if (walletUpdateError) {
    throw new Error(walletUpdateError.message)
  }

  const currentGlobalBalance = await getUserGlobalBalance(supabase, input.userId)
  const newGlobalBalance = await setUserGlobalBalance(supabase, {
    userId: input.userId,
    email: input.email,
    amount: currentGlobalBalance + fundingAmount,
  })

  const composedNote = `${FUNDING_NOTE_PREFIX}:${input.method}${
    input.note ? `:${input.note.trim()}` : ''
  }`

  const transaction = await recordTransaction(supabase, {
    userId: input.userId,
    senderEmail: input.email,
    recipientId: input.userId,
    recipientEmail: input.email,
    amount: fundingAmount,
    type: 'add_funds',
    note: composedNote,
  })

  return {
    walletId: wallet.id,
    walletCurrency: wallet.currency,
    walletBalance: newWalletBalance,
    globalBalance: newGlobalBalance,
    transaction,
  }
}

export function buildSendNote(note?: string) {
  return buildTxNote(SEND_NOTE_PREFIX, note)
}