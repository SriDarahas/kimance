"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/app/components/Sidebar";
import { updateUserRole } from "./actions";

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface ProfilesClientProps {
  users: User[];
  userName: string;
  userEmail: string;
  currentUserId: string;
}

function Avatar({ name, color }: { name: string; color: "blue" | "green" | "purple" | "orange" }) {
  const classes = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-600/10 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${classes[color]}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function UserModal({ user, currentUserId, onClose, onRoleChange }: { user: User; currentUserId: string; onClose: () => void; onRoleChange: (newRole: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const date = new Date(user.created_at);
  const fullDate = date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const isAdmin = user.role === "admin";
  const isSelf = user.id === currentUserId;

  // Derive user info (in a real app these would come from profile data)
  const emailParts = user.email.split("@");
  const firstName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
  const lastName = "—";
  const contactNumber = "—";
  const address = "—";
  const city = "—";
  const country = "—";

  const handleRoleChange = async () => {
    setLoading(true);
    await onRoleChange(isAdmin ? "user" : "admin");
    setLoading(false);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="gradient-card px-6 py-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-1">User Profile</p>
              <p className="text-white text-2xl font-serif font-bold truncate max-w-[280px]">
                {firstName}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <span className="material-icons-outlined text-white text-lg">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Avatar + Basic Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <Avatar name={user.email} color={isAdmin ? "purple" : "blue"} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 break-all">{user.email}</p>
              <p className="text-xs text-gray-400 font-mono">{user.id}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-gray-200 text-gray-600"}`}>
              {user.role.toUpperCase()}
            </span>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-icons-outlined text-purple-500 text-base">person</span>
              Personal Information
            </h3>
            <div className="divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <span className="text-sm text-gray-500 shrink-0">First Name</span>
                <span className="text-sm font-medium text-gray-900 text-right">{firstName}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Last Name</span>
                <span className="text-sm font-medium text-gray-400 text-right">{lastName}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Email</span>
                <span className="text-sm font-medium text-gray-900 text-right break-all">{user.email}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Contact Number</span>
                <span className="text-sm font-medium text-gray-400 text-right">{contactNumber}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Address</span>
                <span className="text-sm font-medium text-gray-400 text-right">{address}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <span className="text-sm text-gray-500 shrink-0">City</span>
                <span className="text-sm font-medium text-gray-400 text-right">{city}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Country</span>
                <span className="text-sm font-medium text-gray-400 text-right">{country}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Signed Up</span>
                <span className="text-sm font-medium text-gray-900 text-right break-all">{fullDate}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods (Hidden Info) */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-icons-outlined text-purple-500 text-base">credit_card</span>
              Payment Methods
            </h3>
            <div className="divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-gray-400 text-base">credit_card</span>
                  <span className="text-sm text-gray-500">Debit Card</span>
                </div>
                <span className="text-sm font-medium text-gray-400 font-mono">•••• •••• •••• ••••</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-gray-400 text-base">credit_score</span>
                  <span className="text-sm text-gray-500">Credit Card</span>
                </div>
                <span className="text-sm font-medium text-gray-400 font-mono">•••• •••• •••• ••••</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-gray-400 text-base">account_balance</span>
                  <span className="text-sm text-gray-500">Bank Account</span>
                </div>
                <span className="text-sm font-medium text-gray-400 font-mono">•••••••••</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1 flex items-center gap-1">
              <span className="material-icons-outlined text-xs">lock</span>
              Sensitive information is hidden for security
            </p>
          </div>

          {/* Verification */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className={`material-icons-outlined text-lg ${verified ? "text-green-500" : "text-gray-400"}`}>
                {verified ? "verified" : "gpp_maybe"}
              </span>
              <div>
                <span className="text-sm font-medium text-gray-700">Account Verification</span>
                <p className="text-xs text-gray-400">{verified ? "Identity verified" : "Not yet verified"}</p>
              </div>
            </div>
            <button
              onClick={handleVerify}
              disabled={verifying || verified}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                verified
                  ? "bg-green-100 text-green-700 cursor-default"
                  : verifying
                    ? "bg-gray-100 text-gray-400 cursor-wait"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
              }`}
            >
              {verified ? "✓ Verified" : verifying ? "Verifying..." : "Verify Account"}
            </button>
          </div>

          {/* Change Role */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-700">Change Role</span>
            <button
              onClick={handleRoleChange}
              disabled={loading || isSelf}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isSelf
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isAdmin
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
              } ${loading ? "opacity-50" : ""}`}
              title={isSelf ? "You cannot change your own role" : undefined}
            >
              {loading ? "Saving..." : isSelf ? "Your Role" : isAdmin ? "Remove Admin" : "Make Admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilesClient({ users, userName, userEmail, currentUserId }: ProfilesClientProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (q && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;
  const mobileHeader = (
    <div className="flex flex-col">
      <span className="font-serif text-lg font-bold text-gray-900 leading-tight">User Profiles</span>
      <span className="text-xs text-gray-500">
        {filtered.length} of {users.length} users
        {adminCount > 0 && <span className="ml-2 text-purple-600">· {adminCount} admins</span>}
      </span>
    </div>
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      window.location.reload();
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} isAdmin mobileHeader={mobileHeader} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="hidden md:flex h-20 px-6 items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 py-10">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">User Profiles</h1>
            <p className="text-sm text-gray-500">
              {filtered.length} of {users.length} users
              {adminCount > 0 && <span className="ml-2 text-purple-600">· {adminCount} admins</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 text-purple-700 rounded-full text-xs font-semibold">
            <span className="material-icons-outlined text-sm">admin_panel_settings</span>
            Admin
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-4 mt-15">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-[18px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <span className="material-icons-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {[
                { id: "all", label: `All (${users.length})` },
                { id: "user", label: `Users (${userCount})` },
                { id: "admin", label: `Admins (${adminCount})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setRoleFilter(f.id as typeof roleFilter)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    roleFilter === f.id
                      ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <span className="material-icons-outlined text-5xl mb-3">people</span>
                <p className="text-base font-medium text-gray-500">No users found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">User</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Role</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Joined</th>
                      <th className="px-5 py-3.5 hidden lg:table-cell" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((user) => {
                      const date = new Date(user.created_at);
                      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                      const isAdmin = user.role === "admin";
                      const isSelf = user.id === currentUserId;

                      return (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className="hover:bg-purple-50/50 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={user.email} color={isAdmin ? "purple" : "blue"} />
                              <div className="min-w-0">
                                <p className="text-gray-800 font-medium text-sm truncate max-w-[200px]">
                                  {user.email}
                                  {isSelf && <span className="ml-2 text-xs text-purple-600">(You)</span>}
                                </p>
                                <p className="text-gray-500 text-xs font-mono truncate max-w-[200px]">{user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{dateStr}</td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <span className="material-icons-outlined text-gray-300 group-hover:text-purple-500 transition-colors text-lg">open_in_new</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedUser && (
        <UserModal
          user={selectedUser}
          currentUserId={currentUserId}
          onClose={() => setSelectedUser(null)}
          onRoleChange={(newRole) => handleRoleChange(selectedUser.id, newRole)}
        />
      )}
    </div>
  );
}
