import { NextRequest, NextResponse } from "next/server";
import {
  createStripeAccountLink,
  createStripeConnectedAccount,
  getStripeConnectedAccount,
} from "@/lib/integrations/stripe";
import { createClient } from "@/lib/supabase/server";

type IntegrationAccountRecord = {
  provider_account_id: string;
  status: string;
};

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

async function getStripeAccountRecord(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const { data, error } = await supabase
    .from("integration_accounts")
    .select("provider_account_id, status")
    .eq("user_id", userId)
    .eq("provider", "stripe")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as IntegrationAccountRecord | null;
}

export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const record = await getStripeAccountRecord(supabase, user.id);
    if (!record) {
      return NextResponse.json({ connected: false, status: "not_started" });
    }

    const account = await getStripeConnectedAccount(record.provider_account_id);
    return NextResponse.json({
      connected: true,
      status: account.details_submitted ? "submitted" : record.status,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe request failed." },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let record = await getStripeAccountRecord(supabase, user.id);
    if (!record) {
      const account = await createStripeConnectedAccount({
        email: user.email,
        kimanceUserId: user.id,
      });

      const { data, error } = await supabase
        .from("integration_accounts")
        .insert({
          user_id: user.id,
          provider: "stripe",
          provider_account_id: account.id,
          status: "onboarding",
        })
        .select("provider_account_id, status")
        .single();

      if (error) throw new Error(error.message);
      record = data as IntegrationAccountRecord;
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const accountLink = await createStripeAccountLink({
      accountId: record.provider_account_id,
      refreshUrl: `${baseUrl}/settings?stripe=refresh`,
      returnUrl: `${baseUrl}/settings?stripe=return`,
    });

    return NextResponse.json({
      onboardingUrl: accountLink.url,
      expiresAt: new Date(accountLink.expires_at * 1000).toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe request failed." },
      { status: 503 }
    );
  }
}
