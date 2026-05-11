"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { logout } from "@/app/auth/actions";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import SidebarNavigation from "@/app/components/SidebarNavigation";

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Transfer Received",
    body: "You received $250.00 from John Doe.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Wallet Funded",
    body: "Your USD wallet was topped up with $500.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 3,
    title: "Exchange Complete",
    body: "Your EUR → GBP exchange was completed successfully.",
    time: "Yesterday",
    unread: false,
  },
];

interface SidebarProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
  mobileHeader?: ReactNode;
}

export default function Sidebar({ userName, userEmail, isAdmin = false, mobileHeader }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const NotificationBell = () => (
    <div className="relative">
      {notifOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setNotifOpen(false)}
        />
      )}
      <button
        onClick={() => setNotifOpen((o) => !o)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <span className="material-icons-outlined text-2xl text-gray-600">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-purple-600 rounded-full" />
        )}
      </button>

      {notifOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 ${n.unread ? "bg-purple-50" : "bg-white"}`}
              >
                <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-gray-100">
            <button
              onClick={markAllRead}
              className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium py-1.5 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Image
          src="/logo-transparent.png"
          alt="Kimance Logo"
          width={140}
          height={40}
          className="h-11 w-auto"
        />
      </div>

      <SidebarNavigation onNavigate={() => setMobileMenuOpen(false)} isAdmin={isAdmin} />

      <div className="p-4 border-t border-gray-200 space-y-3">
        <LanguageSwitcher />
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
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <div className="min-w-0 flex-1">
          {mobileHeader ?? (
            <Image
              src="/logo-transparent.png"
              alt="Kimance Logo"
              width={110}
              height={32}
              className="h-8.5 w-auto"
            />
          )}
        </div>
        <div className="flex items-center gap-1">
          {NotificationBell()}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="material-icons-outlined text-2xl text-gray-600">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 w-72 bg-white h-full z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex-col hidden md:flex h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile spacer for fixed header */}
      <div className="md:hidden h-16 shrink-0" />
    </>
  );
}
