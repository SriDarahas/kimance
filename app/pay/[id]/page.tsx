import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  hasPayLinkSupabaseEnv,
  parsePayLinkNote,
  type PayLinkPayload,
} from "@/lib/services/pay-links";
import PayLinkClaimClient from "./PayLinkClaimClient";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ preview?: string }>;
};

export default async function PayLinkClaimPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  if (!hasPayLinkSupabaseEnv()) {
    const preview = resolvedSearchParams?.preview;
    if (!preview) {
      notFound();
    }

    let payload: PayLinkPayload;
    try {
      payload = JSON.parse(decodeURIComponent(preview)) as PayLinkPayload;
    } catch {
      notFound();
    }

    return <PayLinkClaimClient payLinkId={id} payload={payload} demoMode />;
  }

  const adminClient = createAdminClient();

  const { data: transaction } = await adminClient
    .from("transactions")
    .select("id, note")
    .eq("id", id)
    .single();

  if (!transaction) {
    notFound();
  }

  const payload = parsePayLinkNote(transaction.note);
  if (!payload) {
    notFound();
  }

  return <PayLinkClaimClient payLinkId={id} payload={payload} />;
}
