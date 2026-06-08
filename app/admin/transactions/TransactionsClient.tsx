"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/app/components/Sidebar";

interface Transaction {
  id: string;
  sender_id: string;
  sender_email: string;
  recipient_id: string;
  recipient_email: string;
  amount: number;
  note: string | null;
  created_at: string;
}

interface TransactionsClientProps {
  transactions: Transaction[];
  userName: string;
  userEmail: string;
}

function Avatar({
  email,
  color,
}: {
  email: string;
  color: "blue" | "green" | "purple";
}) {
  const classes = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-600/10 text-purple-600",
  };
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${classes[color]}`}
    >
      {email.charAt(0).toUpperCase()}
    </div>
  );
}

function TransactionModal({
  tx,
  onClose,
}: {
  tx: Transaction;
  onClose: () => void;
}) {
  const date = new Date(tx.created_at);
  const fullDate = date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header stripe */}
        <div className="gradient-card px-6 py-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Transaction
              </p>
              <p className="text-white text-3xl font-serif font-bold">
                ${Number(tx.amount).toFixed(2)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="material-icons-outlined text-white text-lg">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Sender → Recipient */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-1.5">From</p>
              <div className="flex items-center gap-2">
                <Avatar email={tx.sender_email} color="blue" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 break-all">
                    {tx.sender_email}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    {tx.sender_id}
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-8 h-8 rounded-full bg-purple-600/10 flex items-center justify-center">
              <span className="material-icons-outlined text-purple-600 text-lg">
                arrow_forward
              </span>
            </div>

            <div className="flex-1 bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-1.5">To</p>
              <div className="flex items-center gap-2">
                <Avatar email={tx.recipient_email} color="green" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 break-all">
                    {tx.recipient_email}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    {tx.recipient_id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 gap-4">
              <span className="text-sm text-gray-500 shrink-0">Date & Time</span>
              <span className="text-sm font-medium text-gray-900 text-right break-all">
                {fullDate}
              </span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 gap-4">
              <span className="text-sm text-gray-500 shrink-0">Note</span>
              <span className="text-sm font-medium text-gray-900 text-right break-all">
                {tx.note || (
                  <span className="text-gray-300 italic">No note</span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-gray-500">Transaction ID</span>
              <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded select-all">
                {tx.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type DateFilter = "all" | "today" | "7d" | "30d";

export default function TransactionsClient({
  transactions,
  userName,
  userEmail,
}: TransactionsClientProps) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoffs: Record<DateFilter, number> = {
      all: 0,
      today: now - 24 * 60 * 60 * 1000,
      "7d": now - 7 * 24 * 60 * 60 * 1000,
      "30d": now - 30 * 24 * 60 * 60 * 1000,
    };
    const cutoff = cutoffs[dateFilter];
    const q = search.trim().toLowerCase();

    return transactions.filter((tx) => {
      // Date filter
      if (cutoff > 0 && new Date(tx.created_at).getTime() < cutoff)
        return false;
      // Search filter — matches sender/recipient email or note
      if (
        q &&
        !tx.sender_email.toLowerCase().includes(q) &&
        !tx.recipient_email.toLowerCase().includes(q) &&
        !(tx.note ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [transactions, search, dateFilter]);

  const totalAmount = useMemo(
    () => filtered.reduce((s, tx) => s + Number(tx.amount), 0),
    [filtered]
  );
  const mobileHeader = (
    <div className="flex flex-col">
      <span className="font-serif text-lg font-bold text-gray-900 leading-tight">All Transactions</span>
      <span className="text-xs text-gray-500">
        {filtered.length} of {transactions.length} transaction
        {transactions.length !== 1 ? "s" : ""}
        {filtered.length > 0 && (
          <span className="ml-1 text-purple-600 font-medium">
            · ${totalAmount.toFixed(2)} total
          </span>
        )}
      </span>
    </div>
  );

  const dateFilterLabels: { id: DateFilter; label: string }[] = [
    { id: "all", label: "All time" },
    { id: "today", label: "Today" },
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
  ];

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} isAdmin mobileHeader={mobileHeader} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-6 hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 py-10">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              All Transactions
            </h1>
            <p className="text-sm text-gray-500">
              {filtered.length} of {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""}
              {filtered.length > 0 && (
                <span className="ml-1 text-purple-600 font-medium">
                  · ${totalAmount.toFixed(2)} total
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 text-purple-700 rounded-full text-xs font-semibold">
            <span className="material-icons-outlined text-sm">
              admin_panel_settings
            </span>
            Admin
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-4 mt-15">
          {/* Search + Date filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email or note…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-icons-outlined text-[18px]">
                    close
                  </span>
                </button>
              )}
            </div>

            {/* Date filter pills */}
            <div className="flex gap-2 shrink-0">
              {dateFilterLabels.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDateFilter(f.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    dateFilter === f.id
                      ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <span className="material-icons-outlined text-5xl mb-3">
                  receipt_long
                </span>
                <p className="text-base font-medium text-gray-500">
                  No transactions match
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or date filter
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Date
                      </th>
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Sender
                      </th>
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Recipient
                      </th>
                      <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                        Amount
                      </th>
                      <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                        Note
                      </th>
                      <th className="px-5 py-3.5 hidden lg:table-cell" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((tx) => {
                      const date = new Date(tx.created_at);
                      const dateStr = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      const timeStr = date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr
                          key={tx.id}
                          onClick={() => setSelectedTx(tx)}
                          className="hover:bg-purple-50/50 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="text-gray-800 font-medium text-xs">
                              {dateStr}
                            </p>
                            <p className="text-gray-400 text-xs">{timeStr}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar email={tx.sender_email} color="blue" />
                              <span className="text-gray-800 font-medium text-sm truncate max-w-[160px]">
                                {tx.sender_email}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar
                                email={tx.recipient_email}
                                color="green"
                              />
                              <span className="text-gray-800 font-medium text-sm truncate max-w-[160px]">
                                {tx.recipient_email}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <span className="font-bold text-gray-900">
                              ${Number(tx.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell max-w-[180px]">
                            {tx.note ? (
                              <span className="truncate block text-gray-500 text-sm">
                                {tx.note}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-sm italic">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <span className="material-icons-outlined text-gray-300 group-hover:text-purple-500 transition-colors text-lg">
                              open_in_new
                            </span>
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

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <TransactionModal
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
