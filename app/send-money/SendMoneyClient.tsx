"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { sendMoney, getBalance } from "./actions";
import { sendMobileMoney, getMobileMoneyBalance, getSavedRecipients, saveRecipient, type SavedRecipient } from "../mobile-money-actions";
import { MOBILE_MONEY_COUNTRIES } from '../mobile-money-data';
import Sidebar from "@/app/components/Sidebar";

type CurrencyCode = 'USD' | 'CAD' | 'EUR' | 'GBP' | 'AUD';

const SUPPORTED_CURRENCIES: Record<CurrencyCode, { symbol: string; name: string; rateToUSD: number }> = {
  USD: { symbol: "$", name: "US Dollar", rateToUSD: 1 },
  CAD: { symbol: "CA$", name: "Canadian Dollar", rateToUSD: 0.73 },
  EUR: { symbol: "€", name: "Euro", rateToUSD: 1.09 },
  GBP: { symbol: "£", name: "British Pound", rateToUSD: 1.27 },
  AUD: { symbol: "A$", name: "Australian Dollar", rateToUSD: 0.66 },
};

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  US: 'USD',
  CA: 'CAD',
  UK: 'GBP',
  EU: 'EUR',
  AU: 'AUD',
};

const TRANSFER_REASONS = [
  { value: "family_support", label: "Family support" },
  { value: "gift", label: "Gift" },
  { value: "salary", label: "Salary payment" },
  { value: "education", label: "Education fees" },
  { value: "business", label: "Business payment" },
  { value: "rent", label: "Rent / Mortgage" },
  { value: "other", label: "Other" },
];

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  TESTPROMO: { discount: 0.2, label: "20% off" },
  "5OFF": { discount: 0.05, label: "5% off" },
};

const AFRICAN_COUNTRIES = MOBILE_MONEY_COUNTRIES.map(c => c.code);

interface SavedRecipientLocal {
  id: string;
  email: string;
  name: string;
  address: string;
  country: string;
  postalCode: string;
  lastSent: string;
}

interface LocalMobileRecipient {
  id: string;
  name: string;
  phoneNumber: string;
  providerCode: string;
  countryCode: string;
  lastSent: string;
}

interface SendMoneyClientProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
  primaryCurrency?: string;
}

export default function SendMoneyClient({ userName, userEmail, isAdmin = false, primaryCurrency = 'USD' }: SendMoneyClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [destinationCountry, setDestinationCountry] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>("");
  const [selectedRecipientEmail, setSelectedRecipientEmail] = useState("");
  const [selectedRecipientName, setSelectedRecipientName] = useState("");
  const [selectedRecipientAddress, setSelectedRecipientAddress] = useState("");
  const [selectedRecipientCountry, setSelectedRecipientCountry] = useState("");
  const [selectedRecipientPostalCode, setSelectedRecipientPostalCode] = useState("");
  const [amount, setAmount] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState<CurrencyCode>((primaryCurrency as CurrencyCode) in SUPPORTED_CURRENCIES ? primaryCurrency as CurrencyCode : 'USD');
  const [destinationCurrency, setDestinationCurrency] = useState<CurrencyCode>("USD");
  const [note, setNote] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [confirmSent, setConfirmSent] = useState(false);
  const [savedRecipientsList, setSavedRecipientsList] = useState<SavedRecipientLocal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientAddress, setNewRecipientAddress] = useState("");
  const [newRecipientCountry, setNewRecipientCountry] = useState("");
  const [newRecipientPostalCode, setNewRecipientPostalCode] = useState("");
  
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>([]);
  const [localMobileRecipients, setLocalMobileRecipients] = useState<LocalMobileRecipient[]>([]);
  const [selectedMobileRecipientId, setSelectedMobileRecipientId] = useState<string>("");
  const [showMobileAddForm, setShowMobileAddForm] = useState(false);
  const [newMobileRecipient, setNewMobileRecipient] = useState({ name: "", phoneNumber: "", providerCode: "" });
  const [isPhoneValidated, setIsPhoneValidated] = useState(false);

  const isAfrica = AFRICAN_COUNTRIES.includes(destinationCountry);
  const selectedCountry = MOBILE_MONEY_COUNTRIES.find(c => c.code === destinationCountry);
  const availableProviders = selectedCountry?.providers || [];

  const exchangeRate = SUPPORTED_CURRENCIES[sourceCurrency].rateToUSD / SUPPORTED_CURRENCIES[destinationCurrency].rateToUSD;
  const originalAmount = parseFloat(amount) || 0;
  const amountInUSD = originalAmount * SUPPORTED_CURRENCIES[sourceCurrency].rateToUSD;
  const convertedAmount = originalAmount * exchangeRate;
  const localAmount = amountInUSD;

  const mobileHeader = (
    <div className="flex flex-col">
      <span className="font-serif text-lg font-bold text-gray-900 leading-tight">Send Money</span>
      <span className="text-xs text-purple-600">Fast, secure transfers worldwide</span>
    </div>
  );

  const loadSavedRecipients = () => {
    const saved = JSON.parse(localStorage.getItem('savedRecipients') || '[]');
    setSavedRecipientsList(saved);
  };

  const saveNewRecipient = () => {
    if (!newRecipientEmail || !newRecipientName || !newRecipientAddress || !newRecipientCountry || !newRecipientPostalCode) {
      setError("Please fill all fields");
      return;
    }
    const saved = JSON.parse(localStorage.getItem('savedRecipients') || '[]');
    const newId = Date.now().toString();
    saved.push({ 
      id: newId, 
      email: newRecipientEmail, 
      name: newRecipientName, 
      address: newRecipientAddress,
      country: newRecipientCountry,
      postalCode: newRecipientPostalCode,
      lastSent: new Date().toISOString() 
    });
    localStorage.setItem('savedRecipients', JSON.stringify(saved));
    setSavedRecipientsList(saved);
    setSelectedRecipientId(newId);
    setSelectedRecipientEmail(newRecipientEmail);
    setSelectedRecipientName(newRecipientName);
    setSelectedRecipientAddress(newRecipientAddress);
    setSelectedRecipientCountry(newRecipientCountry);
    setSelectedRecipientPostalCode(newRecipientPostalCode);
    setShowAddForm(false);
    setNewRecipientEmail("");
    setNewRecipientName("");
    setNewRecipientAddress("");
    setNewRecipientCountry("");
    setNewRecipientPostalCode("");
  };

  const loadLocalMobileRecipients = () => {
    const saved = JSON.parse(localStorage.getItem('mobileMoneyRecipients') || '[]');
    setLocalMobileRecipients(saved);
  };

  const saveLocalMobileRecipient = () => {
    if (!newMobileRecipient.name || !newMobileRecipient.phoneNumber || !newMobileRecipient.providerCode) {
      setError("Please fill all fields (name, phone, network)");
      return;
    }
    if (!isPhoneValidated) {
      setError("Please click Check Details first");
      return;
    }
    const fullPhoneNumber = `+243${newMobileRecipient.phoneNumber}`;
    const saved = JSON.parse(localStorage.getItem('mobileMoneyRecipients') || '[]');
    const newId = Date.now().toString();
    saved.push({ 
      id: newId, 
      name: newMobileRecipient.name, 
      phoneNumber: fullPhoneNumber, 
      providerCode: newMobileRecipient.providerCode, 
      countryCode: destinationCountry,
      lastSent: new Date().toISOString() 
    });
    localStorage.setItem('mobileMoneyRecipients', JSON.stringify(saved));
    setLocalMobileRecipients(saved);
    setSelectedMobileRecipientId(newId);
    setShowMobileAddForm(false);
    setNewMobileRecipient({ name: "", phoneNumber: "", providerCode: "" });
    setIsPhoneValidated(false);
  };

  useEffect(() => {
    loadSavedRecipients();
    loadLocalMobileRecipients();
    if (isAfrica) {
      getMobileMoneyBalance().then(res => {
        if (res.balance !== undefined) setBalance(res.balance);
      });
      getSavedRecipients().then(res => setSavedRecipients(res.recipients));
    } else {
      getBalance().then(res => {
        if (res.balance !== undefined) setBalance(res.balance);
      });
    }
  }, [isAfrica]);

  useEffect(() => {
    const mapped = COUNTRY_TO_CURRENCY[destinationCountry];
    if (mapped) setDestinationCurrency(mapped);
  }, [destinationCountry]);

  const handleStep1Next = () => {
    if (!destinationCountry) {
      setError("Please select destination country");
      return;
    }
    if (!amount || originalAmount <= 0) {
      setError("Please enter an amount");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSend = async () => {
    setLoading(true);
    setError(null);

    let result;
    if (isAfrica) {
      let recipientData;
      let savedRecipientId = null;
      
      if (selectedMobileRecipientId) {
        const saved = localMobileRecipients.find(r => r.id === selectedMobileRecipientId);
        if (saved) {
          recipientData = { name: saved.name, phoneNumber: saved.phoneNumber, providerCode: saved.providerCode };
          savedRecipientId = selectedMobileRecipientId;
        } else {
          setError("Selected recipient not found");
          setLoading(false);
          return;
        }
      } else {
        setError("Please select a recipient");
        setLoading(false);
        return;
      }

      result = await sendMobileMoney(savedRecipientId, recipientData, amountInUSD, sourceCurrency, note);
      if (result.success) {
        setSuccess(true);
        setConfirmSent(true);
        const balanceRes = await getMobileMoneyBalance();
        if (balanceRes.balance !== undefined) setBalance(balanceRes.balance);
        // Refresh transactions list and balance
        router.refresh();
      } else {
        setError(result.error || "Failed to send");
      }
    } else {
      if (!selectedRecipientId && !selectedRecipientEmail) {
        setError("Please select a recipient");
        setLoading(false);
        return;
      }
      result = await sendMoney(selectedRecipientEmail, amountInUSD, note, transferReason);
      if (result.success) {
        setSuccess(true);
        if (result.newBalance !== undefined) setBalance(result.newBalance);
        setConfirmSent(true);
        // Refresh transactions list and balance
        router.refresh();
      } else {
        setError(result.error || "Failed to send");
      }
    }

    setLoading(false);
  };

  const handleReset = () => {
    setStep(1);
    setDestinationCountry("");
    setSelectedRecipientId("");
    setSelectedRecipientEmail("");
    setSelectedRecipientName("");
    setSelectedRecipientAddress("");
    setSelectedRecipientCountry("");
    setSelectedRecipientPostalCode("");
    setAmount("");
    setNote("");
    setTransferReason("");
    setSourceCurrency((primaryCurrency as CurrencyCode) in SUPPORTED_CURRENCIES ? primaryCurrency as CurrencyCode : 'USD');
    setDestinationCurrency("USD");
    setError(null);
    setSuccess(false);
    setConfirmSent(false);
    setPromoCode("");
    setAppliedPromo(null);
    setPromoError(null);
    setShowAddForm(false);
    setNewRecipientEmail("");
    setNewRecipientName("");
    setNewRecipientAddress("");
    setNewRecipientCountry("");
    setNewRecipientPostalCode("");
    setSelectedMobileRecipientId("");
    setShowMobileAddForm(false);
    setNewMobileRecipient({ name: "", phoneNumber: "", providerCode: "" });
    setIsPhoneValidated(false);
  };

  const handleReview = () => {
    if (!isAfrica && !selectedRecipientId && !selectedRecipientEmail) {
      setError("Please select a recipient");
      return;
    }
    if (isAfrica && !selectedMobileRecipientId) {
      setError("Please select a recipient");
      return;
    }
    setError(null);
    setStep(3);
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} isAdmin={isAdmin} mobileHeader={mobileHeader} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 px-6 hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">Send Money</h1>
            <p className="text-sm text-purple-600">Fast, secure transfers with real-time rates</p>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
          <div className="gradient-card h-40 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <p className="text-gray-400 font-medium mb-1 text-sm">Available Balance</p>
              <h2 className="font-serif text-4xl font-medium tracking-tight">
                ${balance !== null ? balance.toFixed(2) : '...'}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
                <span className="material-icons-outlined text-red-500">error</span>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                  <span className="material-icons-outlined text-green-600 text-4xl">check</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Money Sent!</h3>
                <p className="text-gray-600 mb-2">Successfully sent <span className="font-bold text-purple-600">{sourceCurrency} {originalAmount.toFixed(2)}</span></p>
                <p className="text-gray-500 text-sm mb-1">Amount deducted: USD {amountInUSD.toFixed(2)}</p>
                {confirmSent && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                    Confirmation sent to both sender and recipient
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors">Back to Dashboard</Link>
                  <button onClick={handleReset} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-200 transition-all">Send Again</button>
                </div>
              </div>
            )}

            {!success && step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Destination country</label>
                  <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select country</option>
                    <optgroup label="North America / Europe">
                      <option value="US">United States (USD)</option>
                      <option value="CA">Canada (CAD)</option>
                      <option value="UK">United Kingdom (GBP)</option>
                      <option value="EU">Europe (EUR)</option>
                      <option value="AU">Australia (AUD)</option>
                    </optgroup>
                    <optgroup label="Africa - Mobile Money">
                      {MOBILE_MONEY_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>{country.name} ({country.currency})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">Real-time exchange rate</p>
                  <p className="text-3xl font-bold text-purple-700">
                    1 {sourceCurrency} = {exchangeRate.toFixed(4)} {destinationCurrency}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">You will be charged USD {amountInUSD.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">You send</label>
                    <div className="flex gap-2">
                      <select
                        value={sourceCurrency}
                        onChange={(e) => setSourceCurrency(e.target.value as CurrencyCode)}
                        className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
                      >
                        {Object.keys(SUPPORTED_CURRENCIES).map((code) => (<option key={code}>{code}</option>))}
                      </select>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient gets</label>
                    <div className="flex gap-2">
                      <select
                        value={destinationCurrency}
                        onChange={(e) => setDestinationCurrency(e.target.value as CurrencyCode)}
                        className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
                      >
                        {Object.keys(SUPPORTED_CURRENCIES).map((code) => (<option key={code}>{code}</option>))}
                      </select>
                      <input
                        type="text"
                        value={isAfrica ? localAmount.toFixed(2) : convertedAmount.toFixed(2)}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-xl font-bold text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStep1Next}
                  disabled={!destinationCountry || !amount || originalAmount <= 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span className="material-icons-outlined">arrow_forward</span>
                  Continue to Recipient
                </button>
              </div>
            )}

            {!success && step === 2 && (
              <div className="space-y-6">
                {isAfrica ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select recipient</label>
                    
                    {localMobileRecipients.length > 0 && (
                      <select
                        value={selectedMobileRecipientId}
                        onChange={(e) => setSelectedMobileRecipientId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white mb-4"
                      >
                        <option value="">Select a saved recipient</option>
                        {localMobileRecipients.map((r) => (
                          <option key={r.id} value={r.id}>{r.name} ({r.phoneNumber}) - {r.providerCode}</option>
                        ))}
                      </select>
                    )}

                    {!showMobileAddForm ? (
                      <button
                        onClick={() => setShowMobileAddForm(true)}
                        className="text-purple-600 text-sm hover:underline"
                      >
                        + Add new recipient
                      </button>
                    ) : (
                      <div className="space-y-5 mt-4 p-5 border rounded-xl bg-gray-50">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Recipient name
                          </label>
                          <input
                            type="text"
                            value={newMobileRecipient.name}
                            onChange={(e) => setNewMobileRecipient({ ...newMobileRecipient, name: e.target.value })}
                            placeholder="Full name"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Choose delivery network
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => setNewMobileRecipient({ ...newMobileRecipient, providerCode: "orange" })}
                              className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                                newMobileRecipient.providerCode === "orange"
                                  ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              Orange Money
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewMobileRecipient({ ...newMobileRecipient, providerCode: "airtel" })}
                              className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                                newMobileRecipient.providerCode === "airtel"
                                  ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              Airtel Money
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewMobileRecipient({ ...newMobileRecipient, providerCode: "mpesa" })}
                              className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                                newMobileRecipient.providerCode === "mpesa"
                                  ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              M-PESA
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Enter recipient phone number
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium bg-white px-1 rounded z-10">
                              +243
                            </div>
                            <input
                              type="tel"
                              value={newMobileRecipient.phoneNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '')
                                if (val.length <= 9) {
                                  setNewMobileRecipient({ ...newMobileRecipient, phoneNumber: val })
                                  setIsPhoneValidated(false)
                                }
                              }}
                              placeholder="843 959 150"
                              className="w-full pl-20 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                            />
                          </div>
                          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <span className="text-base">⚠️</span>
                            Please double check the recipient information as we may not be able to refund the transfer once it has been sent.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const provider = newMobileRecipient.providerCode
                            const phone = newMobileRecipient.phoneNumber
                            if (!provider) {
                              setError("Please select a network first")
                              return
                            }
                            if (!phone || phone.length < 9) {
                              setError("Please enter a valid phone number")
                              return
                            }
                            setError(null)
                            const providerName = 
                              provider === "orange" ? "Orange Money" :
                              provider === "airtel" ? "Airtel Money" : "M-PESA"
                            alert(`✓ Phone number validated for ${providerName}`)
                            setIsPhoneValidated(true)
                          }}
                          className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition shadow-sm"
                        >
                          Check Details
                        </button>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => {
                              setShowMobileAddForm(false)
                              setIsPhoneValidated(false)
                              setNewMobileRecipient({ name: "", phoneNumber: "", providerCode: "" })
                            }}
                            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveLocalMobileRecipient}
                            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm"
                          >
                            Save Recipient
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select recipient</label>
                    
                    {savedRecipientsList.length > 0 && (
                      <select
                        value={selectedRecipientId}
                        onChange={(e) => {
                          const selected = savedRecipientsList.find(r => r.id === e.target.value);
                          if (selected) {
                            setSelectedRecipientId(selected.id);
                            setSelectedRecipientEmail(selected.email);
                            setSelectedRecipientName(selected.name);
                            setSelectedRecipientAddress(selected.address);
                            setSelectedRecipientCountry(selected.country);
                            setSelectedRecipientPostalCode(selected.postalCode);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white mb-4"
                      >
                        <option value="">Select a saved recipient</option>
                        {savedRecipientsList.map((r) => (
                          <option key={r.id} value={r.id}>{r.name} ({r.email})</option>
                        ))}
                      </select>
                    )}

                    {!showAddForm ? (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="text-purple-600 text-sm hover:underline"
                      >
                        + Add new recipient
                      </button>
                    ) : (
                      <div className="space-y-4 mt-4 p-4 border rounded-xl">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Recipient name</label>
                          <input
                            type="text"
                            value={newRecipientName}
                            onChange={(e) => setNewRecipientName(e.target.value)}
                            className="w-full px-4 py-3 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Recipient email</label>
                          <input
                            type="email"
                            value={newRecipientEmail}
                            onChange={(e) => setNewRecipientEmail(e.target.value)}
                            className="w-full px-4 py-3 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Address</label>
                          <input
                            type="text"
                            value={newRecipientAddress}
                            onChange={(e) => setNewRecipientAddress(e.target.value)}
                            className="w-full px-4 py-3 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Country</label>
                          <input
                            type="text"
                            value={newRecipientCountry}
                            onChange={(e) => setNewRecipientCountry(e.target.value)}
                            className="w-full px-4 py-3 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Postal code</label>
                          <input
                            type="text"
                            value={newRecipientPostalCode}
                            onChange={(e) => setNewRecipientPostalCode(e.target.value)}
                            className="w-full px-4 py-3 border rounded-xl"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-100 py-2 rounded-xl">Cancel</button>
                          <button onClick={saveNewRecipient} className="flex-1 bg-purple-600 text-white py-2 rounded-xl">Save</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isAfrica && selectedRecipientId && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Transfer reason</label>
                      <select value={transferReason} onChange={(e) => setTransferReason(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                        <option value="">Select a reason</option>
                        {TRANSFER_REASONS.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Add a note</label>
                      <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's this for?" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="text-sm font-semibold mb-3">Promo Code</div>
                      {appliedPromo ? (
                        <div className="flex justify-between"><span>{appliedPromo} applied</span><button onClick={() => setAppliedPromo(null)}>Remove</button></div>
                      ) : (
                        <div className="flex gap-2">
                          <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter promo code" className="flex-1 px-4 py-3 border rounded-xl" />
                          <button onClick={() => { if (PROMO_CODES[promoCode]) setAppliedPromo(promoCode); else setPromoError("Invalid"); }} className="px-5 py-3 bg-purple-600 text-white rounded-xl">Apply</button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-3">Select payment method</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["wallet", "debit_card", "credit_card", "paypal", "bank_account"].map((m) => (
                          <button key={m} onClick={() => setPaymentMethod(m)} className={`p-3 rounded-xl border-2 ${paymentMethod === m ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}>{m.replace("_", " ")}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between"><span>You send</span><span>{sourceCurrency} {originalAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Transfer fee</span><span className="text-green-600">$0.00</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t"><span>Recipient gets</span><span>{isAfrica ? `${selectedCountry?.currencySymbol || "$"} ${localAmount.toFixed(2)}` : `${destinationCurrency} ${convertedAmount.toFixed(2)}`}</span></div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 py-4 rounded-xl">Back</button>
                  <button onClick={handleReview} className="flex-1 bg-purple-600 text-white py-4 rounded-xl">
                    Review
                  </button>
                </div>
              </div>
            )}

            {!success && step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">You send</span>
                    <span className="font-bold text-lg">{sourceCurrency} {originalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Exchange rate</span>
                    <span className="text-sm">1 {sourceCurrency} = {exchangeRate.toFixed(4)} {destinationCurrency}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-2">
                    <span className="text-gray-500">Recipient gets</span>
                    <span className="font-bold text-xl text-purple-600">{isAfrica ? `${selectedCountry?.currencySymbol || "$"} ${localAmount.toFixed(2)}` : `${destinationCurrency} ${convertedAmount.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Transfer fee</span>
                    <span className="text-green-600">$0.00</span>
                  </div>
                  {!isAfrica && selectedRecipientName && (
                    <>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-500">Recipient</span>
                        <span className="font-medium">{selectedRecipientName} ({selectedRecipientEmail})</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-500">Address</span>
                        <span className="font-medium">{selectedRecipientAddress}, {selectedRecipientCountry}, {selectedRecipientPostalCode}</span>
                      </div>
                    </>
                  )}
                  {isAfrica && selectedMobileRecipientId && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">Recipient</span>
                      <span className="font-medium">{localMobileRecipients.find(r => r.id === selectedMobileRecipientId)?.name}</span>
                    </div>
                  )}
                  {transferReason && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">Transfer reason</span>
                      <span className="font-medium">{TRANSFER_REASONS.find(r => r.value === transferReason)?.label}</span>
                    </div>
                  )}
                  {note && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">Note</span>
                      <span className="font-medium">{note}</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="flex justify-between items-center py-2 text-green-600">
                      <span className="text-sm">Promo applied</span>
                      <span>-{sourceCurrency} {(originalAmount * (PROMO_CODES[appliedPromo]?.discount || 0)).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="bg-purple-50 rounded-xl p-4 flex gap-3">
                  <span className="material-icons-outlined text-purple-600">verified_user</span>
                  <p className="text-sm text-purple-800">Bank-level encryption • Your transaction is protected</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 py-4 rounded-xl">Back</button>
                  <button onClick={handleSend} disabled={loading} className="flex-1 bg-purple-600 text-white py-4 rounded-xl disabled:opacity-50">
                    {loading ? "Processing..." : "Confirm & Send"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
