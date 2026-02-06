"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/auth/actions";

interface SidebarProps {
  userName: string;
  userEmail: string;
}

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "#", icon: "account_balance_wallet", label: "My Wallets" },
  { href: "/send-money", icon: "send", label: "Send Money" },
  { href: "#", icon: "pie_chart", label: "Budgeting", badge: "New" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex-col hidden md:flex h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <Image
          src="/icon.png"
          alt="Kimance Logo"
          width={36}
          height={36}
          className="rounded"
        />
        <span className="font-serif text-2xl text-purple-600 font-bold tracking-tight">
          Kimance
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href) && item.href !== "#";
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                isActive
                  ? "bg-purple-600/10 text-purple-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className="material-icons-outlined text-xl">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group">
          <div className="w-9 h-9 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-600 font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">{userName}</span>
            <span className="text-xs text-gray-500 truncate">{userEmail}</span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="material-icons-outlined text-gray-400 hover:text-purple-600 transition-colors text-xl"
              title="Sign out"
            >
              logout
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
