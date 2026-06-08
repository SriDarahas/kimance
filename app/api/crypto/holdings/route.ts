import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase
      .from('crypto_holdings')
      .select('*')
      .eq('user_id', user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch holdings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { symbol, type, crypto_amount, usd_amount, wallet_address } = await req.json();
    if (!symbol || !type || !crypto_amount || !usd_amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('crypto_holdings')
      .select('*')
      .eq('user_id', user.id)
      .eq('symbol', symbol)
      .single();

    let newBalance = 0;
    if (type === 'buy' || type === 'receive') {
      newBalance = Number(existing?.balance || 0) + Number(crypto_amount);
    } else if (type === 'sell' || type === 'send') {
      const current = Number(existing?.balance || 0);
      if (Number(crypto_amount) > current) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }
      newBalance = current - Number(crypto_amount);
    }

    if (existing) {
      await supabase
        .from('crypto_holdings')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('symbol', symbol);
    } else {
      await supabase
        .from('crypto_holdings')
        .insert({ user_id: user.id, symbol, balance: newBalance });
    }

    const { error: txError } = await supabase
      .from('crypto_transactions')
      .insert({
        user_id: user.id,
        symbol,
        type,
        crypto_amount: Number(crypto_amount),
        usd_amount: Number(usd_amount),
        wallet_address: wallet_address || null,
        status: 'completed',
      });

    if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });
    return NextResponse.json({ success: true, balance: newBalance });
  } catch (e) {
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
  }
}
