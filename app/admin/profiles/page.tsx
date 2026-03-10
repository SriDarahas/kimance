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
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all users from auth.users with their profile roles
  const { data: users, error } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  // Get user emails from auth.users (need to query auth schema)
  // We'll join the data in the client or use a different approach
  // For now, let's get all auth users data
  const { data: authUsers } = await adminClient.auth.admin.listUsers();

  // Combine profile data with auth user metadata
  const combinedUsers: UserProfile[] = (users || []).map((p) => {
    const authUser = authUsers?.users.find((u) => u.id === p.id);
    return {
      id: p.id,
      email: authUser?.email || "",
      full_name: authUser?.user_metadata?.full_name || null,
      phone: authUser?.user_metadata?.phone || null,
      role: p.role,
      created_at: p.created_at,
    };
  });

  if (error) {
    console.error("Admin: failed to fetch profiles", error);
  }

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
  const userEmail = user.email || "";

  return (
    <ProfilesClient
      users={combinedUsers}
      userName={userName}
      userEmail={userEmail}
      currentUserId={user.id}
    />
  );
}
