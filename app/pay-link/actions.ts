"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  buildPayLinkNote,
  convertCurrency,
  generatePayLinkCode,
  generatePayLinkOtp,
  type PayLinkFundingMethod,
  parsePayLinkNote,
  type PayLinkPayload,
} from "@/lib/services/pay-links";

type CreatePayLinkInput = {
  sourceWalletId: string;
  sourceCurrency: string;
  destinationCurrency: string;
  amount: number;
  fundingMethod?: PayLinkFundingMethod;
  note?: string;
  expiresInHours: 24;
};

type PayLinkResult =
  | { success: true; id: string; payload: PayLinkPayload }
  | { success: false; error: string };

async function insertPayLinkTransaction(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: {
    userId: string;
    senderEmail: string;
    amount: number;
    note: string;
  }
) {
  const typedPayload = {
    sender_id: input.userId,
    sender_email: input.senderEmail,
    recipient_id: null,
    recipient_email: "unclaimed@paylink.kimance",
    amount: input.amount,
    note: input.note,
    user_id: input.userId,
    type: "send",
  };

  let { data, error } = await supabase
    .from("transactions")
    .insert(typedPayload)
    .select("*")
    .single();

  if (error && error.message.toLowerCase().includes("column")) {
    const legacyPayload = {
      sender_id: input.userId,
      sender_email: input.senderEmail,
      recipient_id: null,
      recipient_email: "unclaimed@paylink.kimance",
      amount: input.amount,
      note: input.note,
    };

    const legacyResult = await supabase
      .from("transactions")
      .insert(legacyPayload)
      .select("*")
      .single();

    data = legacyResult.data;
    error = legacyResult.error;
  }

  if (error || !data) {
    throw new Error(error?.message || "Failed to save pay link");
  }

  return data;
}

export async function createPayLink(
  input: CreatePayLinkInput
): Promise<PayLinkResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in to create a pay link." };
    }

    if (!input.sourceWalletId) {
      return { success: false, error: "Select a wallet to continue." };
    }

    const amount = Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { success: false, error: "Enter a valid amount." };
    }

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("id, currency, balance")
      .eq("id", input.sourceWalletId)
      .eq("user_id", user.id)
      .single();

    if (walletError || !wallet) {
      return { success: false, error: "Wallet not found." };
    }

    if (wallet.currency !== input.sourceCurrency) {
      return {
        success: false,
        error: "Selected wallet currency no longer matches your form.",
      };
    }

    if (Number(wallet.balance) < amount) {
      return { success: false, error: "Insufficient wallet balance." };
    }

    const { exchangeRate, convertedAmount } = convertCurrency(
      amount,
      input.sourceCurrency,
      input.destinationCurrency
    );

    const payload: PayLinkPayload = {
      version: 1,
      code: generatePayLinkCode(),
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + input.expiresInHours * 60 * 60 * 1000
      ).toISOString(),
      otp: generatePayLinkOtp(),
      senderName:
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Kimance User",
      sourceWalletId: wallet.id,
      sourceCurrency: input.sourceCurrency,
      sourceAmount: Number(amount.toFixed(2)),
      fundingMethod: input.fundingMethod ?? "wallet_balance",
      destinationCurrency: input.destinationCurrency,
      destinationAmount: convertedAmount,
      exchangeRate,
      note: input.note?.trim() || undefined,
      allowedMethods: ["wallet", "bank", "mobile_money", "crypto"],
    };

    const { error: updateError } = await supabase
      .from("wallets")
      .update({
        balance: Number((Number(wallet.balance) - amount).toFixed(2)),
      })
      .eq("id", wallet.id)
      .eq("user_id", user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    const transaction = await insertPayLinkTransaction(supabase, {
      userId: user.id,
      senderEmail: user.email ?? "",
      amount,
      note: buildPayLinkNote(payload),
    });

    revalidatePath("/pay-link");
    revalidatePath("/dashboard");
    revalidatePath("/wallets");

    return { success: true, id: transaction.id, payload };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create pay link.",
    };
  }
}

export async function cancelPayLink(payLinkId: string): Promise<PayLinkResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in to manage this pay link." };
    }

    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("id, sender_id, amount, note")
      .eq("id", payLinkId)
      .single();

    if (transactionError || !transaction) {
      return { success: false, error: "Pay link not found." };
    }

    if (transaction.sender_id !== user.id) {
      return { success: false, error: "You do not have access to this pay link." };
    }

    const payload = parsePayLinkNote(transaction.note);
    if (!payload) {
      return { success: false, error: "This transaction is not a pay link." };
    }

    if (payload.status !== "pending") {
      return {
        success: false,
        error: "Only active pay links can be canceled or released.",
      };
    }

    const nextPayload: PayLinkPayload = {
      ...payload,
      status: "canceled",
      canceledAt: new Date().toISOString(),
    };

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("id", payload.sourceWalletId)
      .eq("user_id", user.id)
      .single();

    if (walletError || !wallet) {
      return { success: false, error: "Source wallet not found." };
    }

    const { error: walletUpdateError } = await supabase
      .from("wallets")
      .update({
        balance: Number((Number(wallet.balance) + payload.sourceAmount).toFixed(2)),
      })
      .eq("id", payload.sourceWalletId)
      .eq("user_id", user.id);

    if (walletUpdateError) {
      return { success: false, error: walletUpdateError.message };
    }

    const { error: txUpdateError } = await supabase
      .from("transactions")
      .update({
        note: buildPayLinkNote(nextPayload),
      })
      .eq("id", payLinkId)
      .eq("sender_id", user.id);

    if (txUpdateError) {
      return { success: false, error: txUpdateError.message };
    }

    revalidatePath("/pay-link");
    revalidatePath("/dashboard");
    revalidatePath("/wallets");
    revalidatePath(`/pay/${payLinkId}`);

    return { success: true, id: payLinkId, payload: nextPayload };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel pay link.",
    };
  }
}
