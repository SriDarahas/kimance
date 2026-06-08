"use server";

import { createClient } from "@/lib/supabase/server";
import { applyWalletFunding } from "@/lib/services/wallets";

type AddFundsInput = {
  walletId: string;
  amount: number;
  method: "bank_transfer" | "card" | "crypto_transfer";
  note?: string;
};

export async function addFunds(input: AddFundsInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!input.walletId) {
    throw new Error("Wallet is required");
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  return applyWalletFunding(supabase, {
    userId: user.id,
    email: user.email ?? "",
    walletId: input.walletId,
    amount: input.amount,
    method: input.method,
    note: input.note,
  });
}