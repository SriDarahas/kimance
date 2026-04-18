"use client";

import { useEffect, useMemo, useState } from "react";

type CryptoAction = "buy" | "sell" | "send" | "receive" | null;
type CryptoTxType = "buy" | "sell" | "send" | "receive";
type CryptoTransaction = {
  id: string;
  type: CryptoTxType;
  btcAmount: number;
  usdAmount: number;
  date: string;
  status: "Completed";
};

const BTC_PRICE_USD = 67000;
const BTC_CHANGE_PERCENT = 2.14;
const STORAGE_KEY = "kimance-crypto-btc-balance";
const TX_STORAGE_KEY = "kimance-crypto-transactions";
const RECEIVE_WALLET_ADDRESS = "bc1qkimancewalletdemo5x9j2s8v";
const SEND_NETWORK_FEE = 0.0001;

export default function CryptoPage() {
  const [btcBalance, setBtcBalance] = useState(0);
  const [activeAction, setActiveAction] = useState<"buy" | "sell" | "send" | "receive" | null>(null);
  const [buyUsdAmount, setBuyUsdAmount] = useState("");
  const [sellBtcAmount, setSellBtcAmount] = useState("");
  const [sendAmountBtc, setSendAmountBtc] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? Number(stored) : 0.125;
      const safeBalance = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0.125;
      const txStored = window.localStorage.getItem(TX_STORAGE_KEY);
      const parsedTx = txStored ? (JSON.parse(txStored) as CryptoTransaction[]) : [];

      setBtcBalance(safeBalance);
      setTransactions(Array.isArray(parsedTx) ? parsedTx : []);
    } finally {
      setMounted(true);
    }
  }, []);

  const usdValue = useMemo(() => btcBalance * BTC_PRICE_USD, [btcBalance]);
  const buyUsd = Number(buyUsdAmount);
  const buyBtc = Number.isFinite(buyUsd) && buyUsd > 0 ? buyUsd / BTC_PRICE_USD : 0;
  const sellBtc = Number(sellBtcAmount);
  const sellUsd = Number.isFinite(sellBtc) && sellBtc > 0 ? sellBtc * BTC_PRICE_USD : 0;
  const sendBtc = Number(sendAmountBtc);
  const sendTotalDeduction = Number.isFinite(sendBtc) && sendBtc > 0 ? sendBtc + SEND_NETWORK_FEE : 0;
  const totalInvested = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "buy")
        .reduce((sum, tx) => sum + tx.usdAmount, 0),
    [transactions]
  );
  const totalSold = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "sell")
        .reduce((sum, tx) => sum + tx.usdAmount, 0),
    [transactions]
  );
  const totalProfitLoss = usdValue + totalSold - totalInvested;
  const portfolioChangePercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : BTC_CHANGE_PERCENT;

  const pushTransaction = (type: CryptoTxType, btcAmount: number, usdAmount: number) => {
    const nextTx: CryptoTransaction = {
      id: crypto.randomUUID(),
      type,
      btcAmount,
      usdAmount,
      date: new Date().toISOString(),
      status: "Completed",
    };
    const nextTransactions = [nextTx, ...transactions].slice(0, 50);
    setTransactions(nextTransactions);
    window.localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(nextTransactions));
  };

  const closeModal = () => {
    setActiveAction(null);
    setBuyUsdAmount("");
    setSellBtcAmount("");
    setSendAmountBtc("");
    setWalletAddress("");
    setCopied(false);
  };

  const openAction = (action: NonNullable<CryptoAction>) => {
    setStatusMessage(null);
    setActiveAction(action);
  };

  const confirmBuy = () => {
    if (!Number.isFinite(buyUsd) || buyUsd <= 0) {
      setStatusMessage("Enter a valid USD amount.");
      return;
    }
    const nextBalance = btcBalance + buyBtc;
    setBtcBalance(nextBalance);
    window.localStorage.setItem(STORAGE_KEY, String(nextBalance));
    pushTransaction("buy", buyBtc, buyUsd);
    setStatusMessage(`You will receive ${buyBtc.toFixed(6)} BTC for $${buyUsd.toFixed(2)}.`);
    closeModal();
  };

  const confirmSell = () => {
    if (!Number.isFinite(sellBtc) || sellBtc <= 0) {
      setStatusMessage("Enter a valid BTC amount.");
      return;
    }
    if (sellBtc > btcBalance) {
      setStatusMessage("Insufficient BTC balance.");
      return;
    }
    const nextBalance = btcBalance - sellBtc;
    setBtcBalance(nextBalance);
    window.localStorage.setItem(STORAGE_KEY, String(nextBalance));
    pushTransaction("sell", sellBtc, sellUsd);
    setStatusMessage(`You will receive $${sellUsd.toFixed(2)}.`);
    closeModal();
  };

  const confirmSend = () => {
    if (!walletAddress.trim()) {
      setStatusMessage("Enter a wallet address.");
      return;
    }
    if (!Number.isFinite(sendBtc) || sendBtc <= 0) {
      setStatusMessage("Enter a valid BTC amount.");
      return;
    }
    if (sendTotalDeduction > btcBalance) {
      setStatusMessage("Insufficient BTC balance.");
      return;
    }
    const nextBalance = btcBalance - sendTotalDeduction;
    setBtcBalance(nextBalance);
    window.localStorage.setItem(STORAGE_KEY, String(nextBalance));
    pushTransaction("send", sendBtc, sendBtc * BTC_PRICE_USD);
    setStatusMessage(`Sent ${sendBtc.toFixed(6)} BTC. Total deduction: ${sendTotalDeduction.toFixed(6)} BTC.`);
    closeModal();
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(RECEIVE_WALLET_ADDRESS);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const actionButtonClass =
    "rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-3 font-semibold text-sm transition-colors";

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-6 mt-15">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Crypto</h1>
          <p className="text-sm text-purple-600">Buy, sell, and manage your crypto</p>
        </div>
      </header>

      {statusMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">Bitcoin (BTC)</p>
            <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
              +{BTC_CHANGE_PERCENT.toFixed(2)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${BTC_PRICE_USD.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Live market price</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 font-medium">Your Holdings</p>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${BTC_CHANGE_PERCENT >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {BTC_CHANGE_PERCENT >= 0 ? "+" : ""}{BTC_CHANGE_PERCENT.toFixed(2)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {mounted ? btcBalance.toFixed(6) : "0.000000"} BTC
          </p>
          <p className="text-sm text-purple-600 mt-2">
            ${mounted ? usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"} USD
          </p>
          <p className="text-xs text-gray-400 mt-2">Updated just now</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => openAction("buy")}
          className={actionButtonClass}
        >
          Buy
        </button>
        <button
          onClick={() => openAction("sell")}
          className={actionButtonClass}
        >
          Sell
        </button>
        <button
          onClick={() => openAction("send")}
          className={actionButtonClass}
        >
          Send
        </button>
        <button
          onClick={() => openAction("receive")}
          className={actionButtonClass}
        >
          Receive
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">Portfolio Performance</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm font-semibold mt-2 ${portfolioChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
            {portfolioChangePercent >= 0 ? "+" : ""}{portfolioChangePercent.toFixed(2)}%
          </p>
          <div className="mt-5 h-24 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 flex items-end gap-1">
            {[24, 30, 22, 35, 28, 42, 40, 52, 48, 56, 50, 62].map((height, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-sm bg-purple-300/70"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">24h Change</p>
            <p className={`text-xl font-bold mt-2 ${BTC_CHANGE_PERCENT >= 0 ? "text-green-600" : "text-red-600"}`}>
              {BTC_CHANGE_PERCENT >= 0 ? "+" : ""}{BTC_CHANGE_PERCENT.toFixed(2)}%
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total Invested</p>
            <p className="text-xl font-bold mt-2 text-gray-900">
              ${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total Profit/Loss</p>
            <p className={`text-xl font-bold mt-2 ${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalProfitLoss >= 0 ? "+" : ""}${Math.abs(totalProfitLoss).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-bold text-gray-900">Recent Crypto Activity</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <p className="text-sm font-semibold text-gray-700">No crypto activity yet</p>
            <p className="text-xs text-gray-500 mt-1">Start by buying Bitcoin</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} BTC
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(tx.date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{tx.btcAmount.toFixed(6)} BTC</p>
                  <p className="text-xs text-gray-500">${tx.usdAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-[11px] text-green-600 font-medium mt-1">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeAction && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white border border-gray-100 p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {activeAction === "buy" && (
              <>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Buy Bitcoin</h2>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={buyUsdAmount}
                      onChange={(event) => setBuyUsdAmount(event.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="100"
                    />
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Conversion</p>
                    <p className="text-sm font-semibold text-gray-900">You will receive {buyBtc.toFixed(6)} BTC</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800"
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmBuy}
                    className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}

            {activeAction === "sell" && (
              <>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Sell Bitcoin</h2>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (BTC)</label>
                    <input
                      type="number"
                      min="0.000001"
                      step="0.000001"
                      value={sellBtcAmount}
                      onChange={(event) => setSellBtcAmount(event.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0.010000"
                    />
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Payout</p>
                    <p className="text-sm font-semibold text-gray-900">You will receive ${sellUsd.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800"
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmSell}
                    className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}

            {activeAction === "send" && (
              <>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Send Bitcoin</h2>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(event) => setWalletAddress(event.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="bc1q..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (BTC)</label>
                    <input
                      type="number"
                      min="0.000001"
                      step="0.000001"
                      value={sendAmountBtc}
                      onChange={(event) => setSendAmountBtc(event.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0.010000"
                    />
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Network fee</p>
                    <p className="text-sm font-semibold text-gray-900">{SEND_NETWORK_FEE.toFixed(4)} BTC</p>
                    <p className="text-xs text-gray-500 mt-2 mb-1">Total deduction</p>
                    <p className="text-sm font-semibold text-gray-900">{sendTotalDeduction.toFixed(6)} BTC</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800"
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmSend}
                    className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}

            {activeAction === "receive" && (
              <>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Receive Bitcoin</h2>
                <div className="space-y-4 mb-5">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Your BTC wallet address</p>
                    <p className="text-sm font-mono text-gray-800 break-all">{RECEIVE_WALLET_ADDRESS}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white h-40 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                      QR Placeholder
                    </div>
                  </div>
                  <button
                    onClick={copyAddress}
                    className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white"
                  >
                    {copied ? "Address copied" : "Copy address"}
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800"
                  >
                    Back
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}