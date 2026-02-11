import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostListingClient from "./PostListingClient";

export default async function PostListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';

  return <PostListingClient userName={userName} userEmail={userEmail} />;
}
