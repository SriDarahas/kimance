import { NextRequest, NextResponse } from "next/server";
import { verifyStripeWebhook } from "@/lib/integrations/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature." },
        { status: 400 }
      );
    }

    const rawBody = await request.text();
    const event = verifyStripeWebhook(rawBody, signature);

    if (event.type === "account.updated") {
      const account = event.data.object;
      const status = account.payouts_enabled
        ? "active"
        : account.details_submitted
          ? "submitted"
          : "onboarding";

      const adminClient = createAdminClient();
      const { error } = await adminClient
        .from("integration_accounts")
        .update({
          status,
          capabilities: {
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("provider", "stripe")
        .eq("provider_account_id", account.id);

      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook." },
      { status: 400 }
    );
  }
}
