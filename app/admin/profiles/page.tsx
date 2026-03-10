import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ProfilesClient from "./ProfilesClient";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

export default async function AdminProfilesPage() {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!currentUser) {
    redirect("/login");
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all profiles with their data
  const { data: users, error } = await adminClient
    .from("profiles")
    .select("id, role, created_at, email, full_name, phone")
    .order("created_at", { ascending: false });

  // For any profiles missing email, try to get from auth.users via RPC or handle gracefully
  const combinedUsers: UserProfile[] = (users || []).map((u) => ({
    id: u.id,
    email: u.email || "",
    full_name: u.full_name,
    phone: u.phone,
    role: u.role,
    created_at: u.created_at,
  }));

  if (error) {
    console.error("Admin: failed to fetch profiles", error);
  }

  const userName =
    currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "Admin";
  const userEmail = currentUser.email || "";

  return (
    <ProfilesClient
      users={combinedUsers}
      userName={userName}
      userEmail={userEmail}
      currentUserId={currentUser.id}
    />
  );
}
