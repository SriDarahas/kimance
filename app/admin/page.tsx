import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Sidebar from "@/app/components/Sidebar";

export default async function AdminPage() {
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

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
  const userEmail = user.email || "";

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} isAdmin />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 px-6 hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 py-10">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 text-purple-700 rounded-full text-xs font-semibold">
            <span className="material-icons-outlined text-sm">admin_panel_settings</span>
            Admin
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto w-full mt-15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Link
              href="/admin/transactions"
              className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-3xl text-purple-600">receipt_long</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Transactions</h2>
              <p className="text-gray-500 text-sm">
                View all transactions across the platform, search by email, filter by date, and see transaction details.
              </p>
              <div className="mt-5 flex items-center text-purple-600 font-semibold text-sm">
                <span>Go to Transactions</span>
                <span className="material-icons-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </Link>

            <Link
              href="/admin/profiles"
              className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-3xl text-purple-600">people</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">User Profiles</h2>
              <p className="text-gray-500 text-sm">
                Browse all registered users, view their details, and manage admin roles.
              </p>
              <div className="mt-5 flex items-center text-purple-600 font-semibold text-sm">
                <span>Go to Profiles</span>
                <span className="material-icons-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
