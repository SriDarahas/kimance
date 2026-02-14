import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify wallet belongs to user
    const { data: wallet } = await supabase
      .from('wallets')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!wallet || wallet.user_id !== user.id) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    // Delete wallet
    const { error } = await supabase
      .from('wallets')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete wallet" },
      { status: 500 }
    );
  }
}
