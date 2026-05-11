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

const CRYPTO_ASSETS = [
  { symbol: "BTC", name: "Bitcoin", price: 67000, change: 2.14 },
  { symbol: "ETH", name: "Ethereum", price: 3500, change: 1.82 },
  { symbol: "USDC", name: "USD Coin", price: 1.0, change: 0.01 },
  { symbol: "USDT", name: "Tether", price: 1.0, change: 0.0 },
  { symbol: "DAI", name: "Dai", price: 1.0, change: 0.02 },
];
const WALLET_ADDRESSES: Record<string, string> = {
  BTC: "bc1qkimancewalletdemo5x9j2s8v",
  ETH: "0xKimanceDemoWallet1234567890abcdef",
  USDC: "0xKimanceDemoWalletUSDC1234567890",
  USDT: "0xKimanceDemoWalletUSDT1234567890",
  DAI: "0xKimanceDemoWalletDAI12345678901",
};
const SEND_NETWORK_FEE = 0.0001;

export default function CryptoPage() {
  const [selectedAsset, setSelectedAsset] = useState(CRYPTO_ASSETS[0]);
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
  const [modalStep, setModalStep] = useState<"input" | "confirm" | "success">("input");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const STORAGE_KEY = `kimance-crypto-${selectedAsset.symbol}-balance`;
  const TX_STORAGE_KEY = `kimance-crypto-${selectedAsset.symbol}-transactions`;

  useEffect(() => {
    const load = async () => {
      setMounted(false);
      try {
        const [holdingsRes, txRes] = await Promise.all([
          fetch('/api/crypto/holdings'),
          fetch(`/api/crypto/transactions?symbol=${selectedAsset.symbol}`)
        ]);
        const holdings = await holdingsRes.json();
        const txData = await txRes.json();
        const holding = Array.isArray(holdings) ? holdings.find((h: any) => h.symbol === selectedAsset.symbol) : null;
        setBtcBalance(holding ? Number(holding.balance) : 0);
        setTransactions(Array.isArray(txData) ? txData.map((tx: any) => ({
          id: tx.id,
          type: tx.type as CryptoTxType,
          btcAmount: Number(tx.crypto_amount),
          usdAmount: Number(tx.usd_amount),
          date: tx.created_at,
          status: 'Completed' as const,
        })) : []);
      } catch (e) {
        setBtcBalance(0);
        setTransactions([]);
      }
      setMounted(true);
    };
    load();
  }, [selectedAsset.symbol]);

  const usdValue = useMemo(() => btcBalance * selectedAsset.price, [btcBalance, selectedAsset.price]);
  const buyUsd = Number(buyUsdAmount);
  const buyBtc = Number.isFinite(buyUsd) && buyUsd > 0 ? buyUsd / selectedAsset.price : 0;
  const sellBtc = Number(sellBtcAmount);
  const sellUsd = Number.isFinite(sellBtc) && sellBtc > 0 ? sellBtc * selectedAsset.price : 0;
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
  const portfolioChangePercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : selectedAsset.change;

  const pushTransaction = (type: CryptoTxType, btcAmount: number, usdAmount: number) => {
    const nextTx: CryptoTransaction = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
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
    setModalStep("input");
    setErrorMessage(null);
  };

  const openAction = (action: NonNullable<CryptoAction>) => {
    setStatusMessage(null);
    setErrorMessage(null);
    setModalStep("input");
    setActiveAction(action);
  };

  const confirmBuy = async () => {
    if (modalStep === 'input') {
      if (!Number.isFinite(buyUsd) || buyUsd <= 0) {
        setErrorMessage('Please enter a valid USD amount greater than 0.');
        return;
      }
      setErrorMessage(null);
      setModalStep('confirm');
      return;
    }
    if (modalStep === 'confirm') {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/crypto/holdings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol: selectedAsset.symbol,
            type: 'buy',
            crypto_amount: buyBtc,
            usd_amount: buyUsd,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.error || 'Transaction failed');
          setModalStep('input');
          setIsSubmitting(false);
          return;
        }
        setBtcBalance(data.balance);
        setTransactions(prev => [{
          id: Math.random().toString(36),
          type: 'buy' as CryptoTxType,
          btcAmount: buyBtc,
          usdAmount: buyUsd,
          date: new Date().toISOString(),
          status: 'Completed' as const,
        }, ...prev]);
        setModalStep('success');
      } catch (e) {
        setErrorMessage('Network error. Please try again.');
        setModalStep('input');
      }
      setIsSubmitting(false);
      return;
    }
    closeModal();
  };

  const confirmSell = async () => {
    if (modalStep === 'input') {
      if (!Number.isFinite(sellBtc) || sellBtc <= 0) {
        setErrorMessage(`Please enter a valid ${selectedAsset.symbol} amount.`);
        return;
      }
      if (sellBtc > btcBalance) {
        setErrorMessage(`Insufficient balance. You have ${btcBalance.toFixed(6)} ${selectedAsset.symbol}.`);
        return;
      }
      setErrorMessage(null);
      setModalStep('confirm');
      return;
    }
    if (modalStep === 'confirm') {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/crypto/holdings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol: selectedAsset.symbol,
            type: 'sell',
            crypto_amount: sellBtc,
            usd_amount: sellUsd,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.error || 'Transaction failed');
          setModalStep('input');
          setIsSubmitting(false);
          return;
        }
        setBtcBalance(data.balance);
        setTransactions(prev => [{
          id: Math.random().toString(36),
          type: 'sell' as CryptoTxType,
          btcAmount: sellBtc,
          usdAmount: sellUsd,
          date: new Date().toISOString(),
          status: 'Completed' as const,
        }, ...prev]);
        setModalStep('success');
      } catch (e) {
        setErrorMessage('Network error. Please try again.');
        setModalStep('input');
      }
      setIsSubmitting(false);
      return;
    }
    closeModal();
  };

  const confirmSend = async () => {
    if (modalStep === 'input') {
      if (!walletAddress.trim()) {
        setErrorMessage('Please enter a recipient wallet address.');
        return;
      }
      if (!Number.isFinite(sendBtc) || sendBtc <= 0) {
        setErrorMessage(`Please enter a valid ${selectedAsset.symbol} amount.`);
        return;
      }
      if (sendTotalDeduction > btcBalance) {
        setErrorMessage(`Insufficient balance. You have ${btcBalance.toFixed(6)} ${selectedAsset.symbol}.`);
        return;
      }
      setErrorMessage(null);
      setModalStep('confirm');
      return;
    }
    if (modalStep === 'confirm') {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/crypto/holdings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol: selectedAsset.symbol,
            type: 'send',
            crypto_amount: sendTotalDeduction,
            usd_amount: sendBtc * selectedAsset.price,
            wallet_address: walletAddress,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(data.error || 'Transaction failed');
          setModalStep('input');
          setIsSubmitting(false);
          return;
        }
        setBtcBalance(data.balance);
        setTransactions(prev => [{
          id: Math.random().toString(36),
          type: 'send' as CryptoTxType,
          btcAmount: sendBtc,
          usdAmount: sendBtc * selectedAsset.price,
          date: new Date().toISOString(),
          status: 'Completed' as const,
        }, ...prev]);
        setModalStep('success');
      } catch (e) {
        setErrorMessage('Network error. Please try again.');
        setModalStep('input');
      }
      setIsSubmitting(false);
      return;
    }
    closeModal();
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESSES[selectedAsset.symbol]);
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
            <p className="text-sm text-gray-500 font-medium">{selectedAsset.name} ({selectedAsset.symbol})</p>
            <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
              +{selectedAsset.change.toFixed(2)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${selectedAsset.price.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Live market price</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 font-medium">Your Holdings</p>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${selectedAsset.change >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {selectedAsset.change >= 0 ? "+" : ""}{selectedAsset.change.toFixed(2)}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {mounted ? btcBalance.toFixed(6) : "0.000000"} {selectedAsset.symbol}
          </p>
          <p className="text-sm text-purple-600 mt-2">
            ${mounted ? usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"} USD
          </p>
          <p className="text-xs text-gray-400 mt-2">Updated just now</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CRYPTO_ASSETS.map((asset) => (
          <button
            key={asset.symbol}
            onClick={() => setSelectedAsset(asset)}
            className={
              selectedAsset.symbol === asset.symbol
                ? "px-4 py-2 rounded-xl text-sm font-semibold bg-purple-600 text-white border border-purple-600"
                : "px-4 py-2 rounded-xl text-sm font-semibold bg-white text-gray-700 border border-gray-200 hover:border-purple-300"
            }
          >
            {asset.symbol}
          </button>
        ))}
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
            <p className={`text-xl font-bold mt-2 ${selectedAsset.change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {selectedAsset.change >= 0 ? "+" : ""}{selectedAsset.change.toFixed(2)}%
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
            <p className="text-xs text-gray-500 mt-1">Start by buying {selectedAsset.name}</p>
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
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {selectedAsset.symbol}
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
                  <p className="text-sm font-semibold text-gray-900">{tx.btcAmount.toFixed(6)} {selectedAsset.symbol}</p>
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
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={modalStep === "success" ? closeModal : undefined}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="material-icons-outlined text-white text-xl">
                      {activeAction === "buy" ? "trending_up" : activeAction === "sell" ? "trending_down" : activeAction === "send" ? "send" : "download"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">
                      {activeAction === "buy" ? `Buy ${selectedAsset.name}` : activeAction === "sell" ? `Sell ${selectedAsset.name}` : activeAction === "send" ? `Send ${selectedAsset.name}` : `Receive ${selectedAsset.name}`}
                    </h2>
                    <p className="text-purple-200 text-xs">
                      {modalStep === "input" ? "Step 1 of 2 — Enter details" : modalStep === "confirm" ? "Step 2 of 2 — Review & confirm" : "Transaction complete"}
                    </p>
                  </div>
                </div>
                {modalStep !== "success" && (
                  <button onClick={closeModal} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <span className="material-icons-outlined text-white text-lg">close</span>
                  </button>
                )}
              </div>
              {modalStep !== "success" && activeAction !== "receive" && (
                <div className="flex gap-2 mt-4">
                  <div className="flex-1 h-1 rounded-full bg-white"></div>
                  <div className={`flex-1 h-1 rounded-full ${modalStep === "confirm" ? "bg-white" : "bg-white/30"}`}></div>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* SUCCESS SCREEN */}
              {modalStep === "success" && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons-outlined text-green-600 text-3xl">check_circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Transaction Successful</h3>
                  <p className="text-gray-500 text-sm mb-6">Your transaction has been processed successfully.</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{activeAction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Asset</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedAsset.name}</span>
                    </div>
                    {activeAction === "buy" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Amount paid</span>
                          <span className="text-sm font-semibold text-gray-900">${buyUsd.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Amount received</span>
                          <span className="text-sm font-semibold text-purple-600">{buyBtc.toFixed(6)} {selectedAsset.symbol}</span>
                        </div>
                      </>
                    )}
                    {activeAction === "sell" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Amount sold</span>
                          <span className="text-sm font-semibold text-gray-900">{sellBtc.toFixed(6)} {selectedAsset.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Amount received</span>
                          <span className="text-sm font-semibold text-purple-600">${sellUsd.toFixed(2)} USD</span>
                        </div>
                      </>
                    )}
                    {activeAction === "send" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Amount sent</span>
                          <span className="text-sm font-semibold text-gray-900">{sendBtc.toFixed(6)} {selectedAsset.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Network fee</span>
                          <span className="text-sm font-semibold text-gray-900">{SEND_NETWORK_FEE.toFixed(4)} {selectedAsset.symbol}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-3">
                          <span className="text-sm text-gray-500">Total deducted</span>
                          <span className="text-sm font-bold text-gray-900">{sendTotalDeduction.toFixed(6)} {selectedAsset.symbol}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                        Completed
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date</span>
                      <span className="text-sm font-semibold text-gray-900">{new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <button onClick={closeModal} className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white transition-colors">
                    Done
                  </button>
                </div>
              )}

              {/* BUY — INPUT */}
              {activeAction === "buy" && modalStep === "input" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount in USD</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                      <input
                        type="number" min="1" step="1" value={buyUsdAmount}
                        onChange={(e) => { setBuyUsdAmount(e.target.value); setErrorMessage(null); }}
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-semibold"
                        placeholder="100"
                        autoFocus
                      />
                    </div>
                  </div>
                  {buyUsd > 0 && (
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <p className="text-xs text-purple-600 font-medium mb-2">You will receive</p>
                      <p className="text-2xl font-bold text-purple-700">{buyBtc.toFixed(6)} {selectedAsset.symbol}</p>
                      <p className="text-xs text-gray-500 mt-1">At ${selectedAsset.price.toLocaleString()} per {selectedAsset.symbol}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Market price</span>
                      <span className="font-semibold text-gray-900">${selectedAsset.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Kimance fee</span>
                      <span className="font-semibold text-green-600">$0.00 (Free)</span>
                    </div>
                  </div>
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                      <span className="material-icons-outlined text-red-500 text-lg">error_outline</span>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800 transition-colors">Cancel</button>
                    <button onClick={confirmBuy} className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white transition-colors">Continue →</button>
                  </div>
                </div>
              )}

              {/* BUY — CONFIRM */}
              {activeAction === "buy" && modalStep === "confirm" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Order Summary</p>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">You pay</span>
                      <span className="text-sm font-bold text-gray-900">${buyUsd.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">You receive</span>
                      <span className="text-sm font-bold text-purple-600">{buyBtc.toFixed(6)} {selectedAsset.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Rate</span>
                      <span className="text-sm font-semibold text-gray-900">1 {selectedAsset.symbol} = ${selectedAsset.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Fee</span>
                      <span className="text-sm font-semibold text-green-600">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-sm font-bold text-gray-900">Total charged</span>
                      <span className="text-sm font-bold text-gray-900">${buyUsd.toFixed(2)} USD</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-start gap-2">
                    <span className="material-icons-outlined text-yellow-600 text-lg mt-0.5">info</span>
                    <p className="text-xs text-yellow-700">This is a simulated transaction for demo purposes. No real funds will be moved.</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setModalStep("input")} className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800 transition-colors">← Back</button>
                    <button
                      onClick={confirmBuy}
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 font-semibold text-white transition-colors"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Buy'}
                    </button>
                  </div>
                </div>
              )}

              {/* SELL — INPUT */}
              {activeAction === "sell" && modalStep === "input" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Available balance</span>
                    <span className="text-sm font-bold text-gray-900">{btcBalance.toFixed(6)} {selectedAsset.symbol}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ({selectedAsset.symbol})</label>
                    <input
                      type="number" min="0.000001" step="0.000001" value={sellBtcAmount}
                      onChange={(e) => { setSellBtcAmount(e.target.value); setErrorMessage(null); }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-semibold"
                      placeholder="0.010000"
                      autoFocus
                    />
                    <button onClick={() => setSellBtcAmount(btcBalance.toFixed(6))} className="text-xs text-purple-600 mt-1 hover:underline">Use max</button>
                  </div>
                  {sellBtc > 0 && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <p className="text-xs text-green-600 font-medium mb-2">You will receive</p>
                      <p className="text-2xl font-bold text-green-700">${sellUsd.toFixed(2)} USD</p>
                      <p className="text-xs text-gray-500 mt-1">At ${selectedAsset.price.toLocaleString()} per {selectedAsset.symbol}</p>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                      <span className="material-icons-outlined text-red-500 text-lg">error_outline</span>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800 transition-colors">Cancel</button>
                    <button onClick={confirmSell} className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white transition-colors">Continue →</button>
                  </div>
                </div>
              )}

              {/* SELL — CONFIRM */}
              {activeAction === "sell" && modalStep === "confirm" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Order Summary</p>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">You sell</span>
                      <span className="text-sm font-bold text-gray-900">{sellBtc.toFixed(6)} {selectedAsset.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">You receive</span>
                      <span className="text-sm font-bold text-green-600">${sellUsd.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Rate</span>
                      <span className="text-sm font-semibold text-gray-900">1 {selectedAsset.symbol} = ${selectedAsset.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Fee</span>
                      <span className="text-sm font-semibold text-green-600">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-sm font-bold text-gray-900">Total received</span>
                      <span className="text-sm font-bold text-green-600">${sellUsd.toFixed(2)} USD</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-start gap-2">
                    <span className="material-icons-outlined text-yellow-600 text-lg mt-0.5">info</span>
                    <p className="text-xs text-yellow-700">This is a simulated transaction for demo purposes. No real funds will be moved.</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setModalStep("input")} className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800 transition-colors">← Back</button>
                    <button
                      onClick={confirmSell}
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 font-semibold text-white transition-colors"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Sell'}
                    </button>
                  </div>
                </div>
              )}

              {/* SEND — INPUT */}
              {activeAction === "send" && modalStep === "input" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Available balance</span>
                    <span className="text-sm font-bold text-gray-900">{btcBalance.toFixed(6)} {selectedAsset.symbol}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient wallet address</label>
                    <input
                      type="text" value={walletAddress}
                      onChange={(e) => { setWalletAddress(e.target.value); setErrorMessage(null); }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      placeholder={selectedAsset.symbol === "BTC" ? "bc1q..." : "0x..."}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ({selectedAsset.symbol})</label>
                    <input
                      type="number" min="0.000001" step="0.000001" value={sendAmountBtc}
                      onChange={(e) => { setSendAmountBtc(e.target.value); setErrorMessage(null); }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-semibold"
                      placeholder="0.010000"
                    />
                  </div>
                  {sendBtc > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-semibold">{sendBtc.toFixed(6)} {selectedAsset.symbol}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Network fee</span>
                        <span className="font-semibold">{SEND_NETWORK_FEE.toFixed(4)} {selectedAsset.symbol}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                        <span className="font-bold text-gray-900">Total deducted</span>
                        <span className="font-bold text-gray-900">{sendTotalDeduction.toFixed(6)} {selectedAsset.symbol}</span>
                      </div>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                      <span className="material-icons-outlined text-red-500 text-lg">error_outline</span>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800 transition-colors">Cancel</button>
                    <button onClick={confirmSend} className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-white transition-colors">Continue →</button>
                  </div>
                </div>
              )}

              {/* SEND — CONFIRM */}
              {activeAction === "send" && modalStep === "confirm" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Transaction Summary</p>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">To address</span>
                      <span className="text-sm font-mono text-gray-900 truncate max-w-40">{walletAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Amount</span>
                      <span className="text-sm font-bold text-gray-900">{sendBtc.toFixed(6)} {selectedAsset.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Network fee</span>
                      <span className="text-sm font-semibold text-gray-900">{SEND_NETWORK_FEE.toFixed(4)} {selectedAsset.symbol}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-sm font-bold text-gray-900">Total deducted</span>
                      <span className="text-sm font-bold text-red-600">{sendTotalDeduction.toFixed(6)} {selectedAsset.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">USD value</span>
                      <span className="text-sm font-semibold text-gray-900">${(sendBtc * selectedAsset.price).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                    <span className="material-icons-outlined text-red-500 text-lg mt-0.5">warning</span>
                    <p className="text-xs text-red-700">Double-check the wallet address. Crypto transactions cannot be reversed once confirmed.</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setModalStep("input")} className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800 transition-colors">← Back</button>
                    <button
                      onClick={confirmSend}
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3 font-semibold text-white transition-colors"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Send'}
                    </button>
                  </div>
                </div>
              )}

              {/* RECEIVE */}
              {activeAction === "receive" && (
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs text-purple-600 font-semibold mb-2">Your {selectedAsset.symbol} deposit address</p>
                    <p className="text-sm font-mono text-gray-800 break-all leading-relaxed">{WALLET_ADDRESSES[selectedAsset.symbol]}</p>
                  </div>
                  <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white h-44 flex flex-col items-center justify-center gap-2">
                    <span className="material-icons-outlined text-gray-300 text-5xl">qr_code_2</span>
                    <p className="text-xs text-gray-400">QR code for {selectedAsset.symbol} address</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-start gap-2">
                    <span className="material-icons-outlined text-yellow-600 text-lg mt-0.5">info</span>
                    <p className="text-xs text-yellow-700">Only send {selectedAsset.symbol} to this address. Sending other assets may result in permanent loss.</p>
                  </div>
                  <button
                    onClick={copyAddress}
                    className={`w-full rounded-xl py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${copied ? "bg-green-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
                  >
                    <span className="material-icons-outlined text-lg">{copied ? "check" : "content_copy"}</span>
                    {copied ? "Address copied!" : "Copy address"}
                  </button>
                  <button onClick={closeModal} className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800 transition-colors">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
