"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  buildClaimReference,
  buildPayLinkNote,
  isPayLinkExpired,
  parsePayLinkNote,
  type PayLinkMethod,
  type PayLinkPayload,
} from "@/lib/services/pay-links";

type ClaimInput = {
  payLinkId: string;
  otp: string;
  method: PayLinkMethod;
  fullName: string;
  email?: string;
  bankName?: string;
  accountName?: string;
  mobileProvider?: string;
  mobileNumber?: string;
  walletAddress?: string;
};

type ClaimResult =
  | { success: true; payload: PayLinkPayload; message: string }
  | { success: false; error: string };

function formatAmount(currency: string, amount: number) {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function claimPayLink(input: ClaimInput): Promise<ClaimResult> {
  try {
    const adminClient = createAdminClient();
    const { data: transaction, error: transactionError } = await adminClient
      .from("transactions")
      .select("id, amount, note")
      .eq("id", input.payLinkId)
      .single();

    if (transactionError || !transaction) {
      return { success: false, error: "Pay link not found." };
    }

    const payload = parsePayLinkNote(transaction.note);
    if (!payload) {
      return { success: false, error: "This transfer link is invalid." };
    }

    if (payload.status !== "pending") {
      return { success: false, error: "This pay link is no longer active." };
    }

    if (isPayLinkExpired(payload)) {
      return {
        success: false,
        error: "This pay link expired. Ask the sender to create a new one.",
      };
    }

    if (input.otp.trim() !== payload.otp) {
      return { success: false, error: "Incorrect OTP. Check the secure code and try again." };
    }

    if (!payload.allowedMethods.includes(input.method)) {
      return { success: false, error: "This payout method is not available for the link." };
    }

    const nextPayload: PayLinkPayload = {
      ...payload,
      status: "claimed",
      claimedAt: new Date().toISOString(),
      claimMethod: input.method,
      claimedBy: input.fullName.trim() || input.email || "Recipient",
      claimReference: buildClaimReference(input.method, {
        email: input.email,
        bankName: input.bankName,
        accountName: input.accountName,
        mobileProvider: input.mobileProvider,
        mobileNumber: input.mobileNumber,
        walletAddress: input.walletAddress,
      }),
    };

    let recipientEmail = input.email?.trim() || "claimed@kimance.link";

    if (input.method === "wallet") {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: "Sign in to Kimance before claiming into your wallet.",
        };
      }

      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, balance")
        .eq("user_id", user.id)
        .eq("currency", payload.destinationCurrency)
        .maybeSingle();

      if (wallet) {
        const { error: walletUpdateError } = await supabase
          .from("wallets")
          .update({
            balance: Number(
              (Number(wallet.balance) + payload.destinationAmount).toFixed(2)
            ),
          })
          .eq("id", wallet.id)
          .eq("user_id", user.id);

        if (walletUpdateError) {
          return { success: false, error: walletUpdateError.message };
        }
      } else {
        const { error: createWalletError } = await supabase.from("wallets").insert({
          user_id: user.id,
          currency: payload.destinationCurrency,
          balance: payload.destinationAmount,
        });

        if (createWalletError) {
          return { success: false, error: createWalletError.message };
        }
      }

      recipientEmail = user.email || recipientEmail;
      nextPayload.claimedBy =
        user.user_metadata?.full_name || user.email || nextPayload.claimedBy;
      nextPayload.claimReference = user.email || "Kimance wallet payout";
    }

    const { error: updateError } = await adminClient
      .from("transactions")
      .update({
        recipient_email: recipientEmail,
        note: buildPayLinkNote(nextPayload),
      })
      .eq("id", input.payLinkId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath(`/pay/${input.payLinkId}`);
    revalidatePath("/pay-link");
    revalidatePath("/dashboard");
    revalidatePath("/wallets");

    const message =
      input.method === "wallet"
        ? `${formatAmount(
            payload.destinationCurrency,
            payload.destinationAmount
          )} has been added to your Kimance wallet.`
        : `${formatAmount(
            payload.destinationCurrency,
            payload.destinationAmount
          )} will be sent by ${
            input.method === "mobile_money"
              ? "mobile money"
              : input.method === "bank"
              ? "bank transfer"
              : "crypto wallet"
          }. This link is now closed.`;

    return { success: true, payload: nextPayload, message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to claim pay link.",
    };
  }
}
