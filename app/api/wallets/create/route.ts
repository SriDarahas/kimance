import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currency, type } = await req.json();

    if (!currency) {
      return NextResponse.json({ error: "Currency is required" }, { status: 400 });
    }

    // Check if wallet already exists
    const { data: existing } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .eq('currency', currency)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Wallet for this currency already exists" },
        { status: 400 }
      );
    }

    // Create new wallet
    const { data: newWallet, error } = await supabase
      .from('wallets')
      .insert({
        user_id: user.id,
        email: user.email,
        currency,
        type: type || 'fiat',
        balance: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newWallet);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create wallet" },
      { status: 500 }
    );
  }
}
