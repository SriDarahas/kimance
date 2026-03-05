"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signup, signupWithPhone, verifyPhoneOtp } from "@/app/auth/actions";

type Rate = { code: string; value: number };
type RatesResponse = { data?: Record<string, Rate>; error?: string };

const TICKER_CURRENCIES = ["USD", "CAD", "EUR", "GBP", "CDF", "XAF", "XOF", "KES", "NGN", "RWF", "BIF", "TZS", "UGX"];

export default function Register() {
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [rates, setRates] = useState<Record<string, Rate> | null>(null);

  // Fetch exchange rates for ticker
  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch(`/api/currency?base=USD&symbols=${TICKER_CURRENCIES.join(",")}`);
        const json = (await res.json()) as RatesResponse;
        if (json.data) setRates(json.data);
      } catch { /* silent fail */ }
    }
    loadRates();
    const id = setInterval(loadRates, 30000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    if (authMethod === "email") {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);

      const result = await signup(formData);
      setIsLoading(false);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    } else {
      if (!phone.startsWith("+")) {
        setError("Please enter your phone number with country code (e.g. +1234567890)");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("password", password);

      const result = await signupWithPhone(formData);
      setIsLoading(false);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setOtpSent(true);
        setSuccess(result.success);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("token", otpCode);
    formData.append("type", "sms");

    const result = await verifyPhoneOtp(formData);
    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
    }
  };

  const formatRate = (code: string) => {
    const rate = rates?.[code];
    if (!rate) return "—";
    return ["CDF","BIF","UGX","TZS","KES","NGN","XAF","XOF","RWF"].includes(code)
      ? rate.value.toFixed(2)
      : rate.value.toFixed(4);
  };

  // Shared ticker bar
  const TickerBar = () => (
    <div className="w-full bg-[#1e1033] text-white overflow-hidden h-10 flex items-center relative z-50">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...Array(2)].map((_, rep) => (
          <div key={rep} className="flex items-center gap-6 px-4">
            {TICKER_CURRENCIES.map((code) => (
              <span key={`${code}-${rep}`} className="flex items-center gap-1.5 text-xs font-medium">
                <span className="text-purple-300 font-bold">{code}</span>
                <span className="text-white/80">{formatRate(code)}</span>
                <span className="text-green-400 text-[10px]">●</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Shared left panel
  const LeftPanel = () => (
    <div className="hidden lg:flex w-1/2 relative flex-col justify-between overflow-hidden">
      <Image src="/login-hero.png" alt="Kimance - Global Finance" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e1033]/60 via-[#1e1033]/40 to-[#1e1033]/80"></div>

      <div className="relative z-10 flex justify-center pt-10">
        <Link href="/">
          <Image src="/logo-transparent.png" alt="Kimance Logo" width={220} height={60} className="h-16 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-12">
        <div className="text-center max-w-[540px]" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4 tracking-tight font-[family-name:var(--font-playfair)]">
            Send. Store. Exchange.
            <br />
            <span className="text-purple-300">Protect. Grow.</span>
          </h1>
          <p className="text-white text-lg font-semibold leading-relaxed">
            All with Security You Can Trust.
          </p>
          <p className="text-white/80 text-sm mt-4 leading-relaxed">
            Join thousands managing money smarter across borders.
          </p>
        </div>
      </div>

      <div className="relative z-10 px-8 pb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-purple-300 text-lg">currency_exchange</span>
              <span className="text-white/70 text-xs font-medium">Live Rates</span>
            </div>
            <span className="text-green-400 text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {["CAD", "EUR", "GBP"].map((code) => (
              <div key={code} className="text-center">
                <span className="text-white/50 text-[10px] block">USD/{code}</span>
                <span className="text-white font-bold text-sm">
                  {rates?.[code] ? rates[code].value.toFixed(4) : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Phone OTP verification state
  if (otpSent && authMethod === "phone") {
    return (
      <div className="font-[family-name:var(--font-inter)] bg-white text-gray-900 min-h-screen flex flex-col">
        <TickerBar />
        <div className="flex flex-1 w-full flex-row">
          <LeftPanel />
          <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24">
            <div className="w-full max-w-[480px] flex flex-col gap-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="material-icons-outlined text-4xl text-[#6D28D9]">sms</span>
              </div>
              <div className="text-center">
                <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight font-[family-name:var(--font-playfair)] mb-2">
                  Verify your phone
                </h2>
                <p className="text-gray-500 text-base">
                  Enter the 6-digit code sent to <span className="font-semibold text-gray-700">{phone}</span>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <span className="material-icons-outlined text-red-500 mt-0.5">error_outline</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form className="flex flex-col gap-5" onSubmit={handleVerifyOtp}>
                <label className="flex flex-col gap-2">
                  <span className="text-gray-900 text-sm font-semibold ml-1">Verification Code</span>
                  <input
                    className="flex w-full h-14 px-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium text-center tracking-[0.5em]"
                    placeholder="000000"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </label>
                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="flex w-full h-12 items-center justify-center rounded-full bg-[#6D28D9] hover:bg-[#5A24B3] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-[#6D28D9]/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="material-icons-outlined animate-spin">refresh</span>
                      Verifying...
                    </span>
                  ) : "Verify & Continue"}
                </button>
              </form>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setSuccess(null); setOtpCode(""); }}
                className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold transition-colors text-center"
              >
                ← Back to registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state — email confirmation
  if (success && authMethod === "email") {
    return (
      <div className="font-[family-name:var(--font-inter)] bg-white text-gray-900 min-h-screen flex flex-col">
        <TickerBar />
        <div className="flex flex-1 w-full flex-row">
          <LeftPanel />
          <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24">
            <div className="w-full max-w-[480px] text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-outlined text-4xl text-green-500">email</span>
              </div>
              <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight font-[family-name:var(--font-playfair)] mb-4">
                Check your email
              </h2>
              <p className="text-gray-500 text-base mb-8">{success}</p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#6D28D9] hover:bg-[#5A24B3] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-[#6D28D9]/30 px-8 py-3"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main registration form
  return (
    <div className="font-[family-name:var(--font-inter)] bg-white text-gray-900 min-h-screen flex flex-col">
      <TickerBar />
      <div className="flex flex-1 w-full flex-row">
        <LeftPanel />

        {/* Right Panel: Register Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24 py-12">
          <div className="w-full max-w-[480px] flex flex-col gap-6">
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden flex justify-center mb-4">
              <Image src="/logo-transparent.png" alt="Kimance Logo" width={140} height={40} className="h-[44px] w-auto" />
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight font-[family-name:var(--font-playfair)]">
                Create Account
              </h2>
              <p className="text-gray-500 text-base font-normal">
                Fill in your details to get started with Kimance.
              </p>
            </div>

            {/* Auth Method Toggle */}
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={() => { setAuthMethod("email"); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
                  authMethod === "email"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="material-icons-outlined text-lg">email</span>
                Email
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod("phone"); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
                  authMethod === "phone"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="material-icons-outlined text-lg">phone</span>
                Phone
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <span className="material-icons-outlined text-red-500 mt-0.5">error_outline</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-900 text-sm font-semibold ml-1">Full Name</span>
                <input className="flex w-full h-14 px-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium" placeholder="John Doe" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isLoading} />
              </label>

              {/* Email / Phone */}
              {authMethod === "email" ? (
                <label className="flex flex-col gap-2">
                  <span className="text-gray-900 text-sm font-semibold ml-1">Email Address</span>
                  <input className="flex w-full h-14 px-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium" placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </label>
              ) : (
                <label className="flex flex-col gap-2">
                  <span className="text-gray-900 text-sm font-semibold ml-1">Phone Number</span>
                  <div className="relative w-full">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-base font-medium pointer-events-none flex items-center gap-1">
                      <span className="material-icons-outlined text-lg">phone</span>
                    </span>
                    <input className="flex w-full h-14 pl-12 pr-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium" placeholder="+1 (555) 000-0000" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isLoading} />
                  </div>
                </label>
              )}

              {/* Password */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-900 text-sm font-semibold ml-1">Password</span>
                <div className="relative w-full">
                  <input className="flex w-full h-14 pl-5 pr-12 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium" placeholder="Create a strong password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isLoading} />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6D28D9] transition-colors flex items-center justify-center" type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    <span className="material-icons-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </label>

              {/* Confirm Password */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-900 text-sm font-semibold ml-1">Confirm Password</span>
                <div className="relative w-full">
                  <input className="flex w-full h-14 pl-5 pr-12 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium" placeholder="Confirm your password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} disabled={isLoading} />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6D28D9] transition-colors flex items-center justify-center" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                    <span className="material-icons-outlined text-xl">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </label>

              {/* Terms */}
              <label className="flex items-start gap-3 mt-2">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 w-4 h-4 text-[#6D28D9] border-gray-300 rounded focus:ring-[#6D28D9]" required disabled={isLoading} />
                <span className="text-sm text-gray-500">
                  I agree to the{" "}
                  <Link href="#" className="text-[#6D28D9] hover:underline font-medium">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#6D28D9] hover:underline font-medium">Privacy Policy</Link>
                </span>
              </label>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full h-12 items-center justify-center rounded-full bg-[#6D28D9] hover:bg-[#5A24B3] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-[#6D28D9]/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-icons-outlined animate-spin">refresh</span>
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-center gap-1 mt-4">
              <p className="text-gray-500 text-sm font-medium">Already have an account?</p>
              <Link href="/login" className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold transition-colors">Sign in</Link>
            </div>

            <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <Link href="/contact" className="text-gray-400 hover:text-[#6D28D9] text-xs font-medium transition-colors">Contact Us</Link>
              <span className="text-gray-200">|</span>
              <Link href="/features" className="text-gray-400 hover:text-[#6D28D9] text-xs font-medium transition-colors">Explore Our Features</Link>
              <span className="text-gray-200">|</span>
              <Link href="/exchange-rate" className="text-gray-400 hover:text-[#6D28D9] text-xs font-medium transition-colors">Exchange Rate</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
