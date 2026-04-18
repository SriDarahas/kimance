import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Sidebar from "@/app/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is admin (use admin client to bypass RLS)
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';
  const mobileHeader = (
    <div className="flex items-center justify-center w-full">
      <img src="/logo-transparent.png" alt="Kimance" className="h-9 w-auto" />
    </div>
  );

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        isAdmin={isAdmin}
        mobileHeader={mobileHeader}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
