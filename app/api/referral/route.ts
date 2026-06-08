import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userData } = await supabase
    .from('users')
    .select('referral_code')
    .eq('id', user.id)
    .single()

  const referralCode = userData?.referral_code || `KIM-${user.id.slice(0, 8)}`

  const { count: totalReferrals } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', user.id)

  const { count: qualifiedReferrals } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', user.id)
    .eq('status', 'QUALIFIED')

  const { data: rewards } = await supabase
    .from('rewards')
    .select('amount')
    .eq('user_id', user.id)
    .in('status', ['APPROVED', 'CREDITED'])

  const earnings = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0

  const { data: pending } = await supabase
    .from('rewards')
    .select('amount')
    .eq('user_id', user.id)
    .eq('status', 'PENDING')

  const pendingTotal = pending?.reduce((sum, r) => sum + r.amount, 0) || 0

  return NextResponse.json({
    referralCode,
    referralLink: `https://kimance-pay3.vercel.app/register?ref=${referralCode}`,
    totalReferrals: totalReferrals || 0,
    qualifiedReferrals: qualifiedReferrals || 0,
    earnings,
    pendingRewards: pendingTotal,
  })
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { action, amount } = await request.json()

    if (action === 'qualify') {
      if (!amount || amount < 100) {
        return NextResponse.json({ error: 'Amount below threshold' }, { status: 400 })
      }
      const { data: referral } = await supabase
        .from('referrals')
        .select('id, referrer_id')
        .eq('referee_id', user.id)
        .eq('status', 'REGISTERED')
        .single()
      if (!referral) {
        return NextResponse.json({ error: 'No pending referral' }, { status: 404 })
      }
      await supabase
        .from('referrals')
        .update({ status: 'QUALIFIED' })
        .eq('id', referral.id)
      await supabase.from('rewards').insert({
        user_id: referral.referrer_id,
        referral_id: referral.id,
        amount: 10,
        status: 'CREDITED',
        type: 'REFERRAL'
      })
      await supabase.from('rewards').insert({
        user_id: user.id,
        referral_id: referral.id,
        amount: 10,
        status: 'CREDITED',
        type: 'REFERRAL_BONUS'
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
