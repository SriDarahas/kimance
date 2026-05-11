"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => n.unread).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('transactions')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_email.eq.${user.email}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!data) return;

      const mapped: Notification[] = data.map((tx: any) => {
        const isSender = tx.sender_id === user.id;
        const isFunding = typeof tx.note === 'string' && tx.note.startsWith('ADD_FUNDS:');
        const amount = `$${Number(tx.amount).toFixed(2)}`;
        if (isFunding) {
          return { id: tx.id, title: 'Funds added to wallet', body: `${amount} was added successfully.`, time: timeAgo(tx.created_at), unread: false };
        }
        if (isSender) {
          return { id: tx.id, title: `Money sent to ${tx.recipient_email}`, body: `You sent ${amount}`, time: timeAgo(tx.created_at), unread: false };
        }
        return { id: tx.id, title: 'Money received', body: `You received ${amount} from ${tx.sender_email}`, time: timeAgo(tx.created_at), unread: true };
      });

      setNotifications(mapped.length > 0 ? mapped : [
        { id: '1', title: 'Welcome to Kimance Pay!', body: 'Your wallet is ready to use.', time: 'Just now', unread: true },
        { id: '2', title: 'Security tip', body: 'Enable 2FA to protect your account.', time: '1 hour ago', unread: true },
      ]);
    };
    load();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setNotifOpen(o => !o)}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-purple-600 transition-colors relative shadow-sm"
      >
        <span className="material-icons-outlined text-xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {notifications.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-400">No notifications yet</p>
                  <p className="text-xs text-gray-300 mt-1">Your transactions will appear here</p>
                </div>
              )}
              {notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${n.unread ? 'bg-purple-50/40' : ''}`}>
                  <div className="flex items-start gap-2">
                    {n.unread && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />}
                    <div className={n.unread ? '' : 'pl-3.5'}>
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                      <p className="text-xs text-purple-500 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100">
              <button onClick={markAllRead} className="w-full text-sm text-purple-600 font-medium hover:text-purple-700">
                Mark all as read
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
