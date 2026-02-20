"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { login, loginWithPhone, sendPhoneOtp, verifyPhoneOtp } from "@/app/auth/actions";

export default function Login() {
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneAuthMode, setPhoneAuthMode] = useState<"password" | "otp">("password");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (authMethod === "email") {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await login(formData);
      setIsLoading(false);

      if (result?.error) {
        setError(result.error);
      }
    } else {
      if (!phone.startsWith("+")) {
        setError("Please enter your phone number with country code (e.g. +1234567890)");
        setIsLoading(false);
        return;
      }

      if (phoneAuthMode === "password") {
        const formData = new FormData();
        formData.append("phone", phone);
        formData.append("password", password);

        const result = await loginWithPhone(formData);
        setIsLoading(false);

        if (result?.error) {
          setError(result.error);
        }
      } else {
        // OTP mode - send OTP
        const formData = new FormData();
        formData.append("phone", phone);

        const result = await sendPhoneOtp(formData);
        setIsLoading(false);

        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setOtpSent(true);
        }
      }
    }
    // Success will redirect automatically via server action
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

  // Phone OTP verification screen
  if (otpSent && authMethod === "phone" && phoneAuthMode === "otp") {
    return (
      <div className="font-[family-name:var(--font-inter)] bg-white text-gray-900 min-h-screen">
        <div className="flex min-h-screen w-full flex-row">
          {/* Left Panel: Brand Showcase */}
          <div
            className="hidden lg:flex w-1/2 relative flex-col justify-between bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArEjg8Wu_EAl12MZeUi4NTQ7sXjZdZhqirQdqQB3v6LL-7Xihu7JYJGtdn-TFC3uFZZFLv4gaNAP82fw6O7Gt1zmkbDjLetvK8HsodcLP33WcJ8L3BOhJ7CsLcGVLIxPBBBR0R_dUmwH9Mk379EEiTrZa-QQYmMequI-tVqQ3a8h5aZaTQBcIfLo3P-ExlBPmiPLIn-NXF-tF37FzZO1x-XkMBTYhcMi5Z-EEeEw7E1sKGtgEskibwiB6jPPxlnDFOgS3wuI4rhRYa")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#6D28D9]/15 to-gray-900/60"></div>
            <div className="relative z-10 p-12">
              <Link href="/" className="inline-block bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                <Image src="/logo-crop.png" alt="Kimance Logo" width={140} height={40} className="h-10 w-auto" />
              </Link>
            </div>
            <div className="relative z-10 flex-1 flex items-center justify-center p-12">
              <div className="text-center max-w-[540px]">
                <h1 className="text-white text-5xl font-bold leading-tight mb-4 tracking-tight font-[family-name:var(--font-playfair)]">
                  Money without borders
                </h1>
                <p className="text-white/80 text-xl font-medium leading-relaxed">
                  Experience the future of AI-powered finance with secure, global transactions at your fingertips.
                </p>
              </div>
            </div>
            <div className="h-24"></div>
          </div>

          {/* Right Panel: OTP Verification */}
          <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24">
            <div className="w-full max-w-[480px] flex flex-col gap-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="material-icons-outlined text-4xl text-[#6D28D9]">sms</span>
              </div>
              <div className="text-center">
                <h2 className="text-gray-900 text-3xl font-black leading-tight tracking-tight font-[family-name:var(--font-playfair)] mb-2">
                  Enter verification code
                </h2>
                <p className="text-gray-500 text-base">
                  We sent a 6-digit code to <span className="font-semibold text-gray-700">{phone}</span>
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
                  <span className="text-gray-900 text-sm font-semibold ml-1">
                    Verification Code
                  </span>
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
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtpCode(""); setError(null); }}
                className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold transition-colors text-center"
              >
                ← Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[family-name:var(--font-inter)] bg-white text-gray-900 min-h-screen">
      <div className="flex min-h-screen w-full flex-row">
        {/* Left Panel: Brand Showcase */}
        <div
          className="hidden lg:flex w-1/2 relative flex-col justify-between bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArEjg8Wu_EAl12MZeUi4NTQ7sXjZdZhqirQdqQB3v6LL-7Xihu7JYJGtdn-TFC3uFZZFLv4gaNAP82fw6O7Gt1zmkbDjLetvK8HsodcLP33WcJ8L3BOhJ7CsLcGVLIxPBBBR0R_dUmwH9Mk379EEiTrZa-QQYmMequI-tVqQ3a8h5aZaTQBcIfLo3P-ExlBPmiPLIn-NXF-tF37FzZO1x-XkMBTYhcMi5Z-EEeEw7E1sKGtgEskibwiB6jPPxlnDFOgS3wuI4rhRYa")',
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#6D28D9]/15 to-gray-900/60"></div>

          {/* Logo Area */}
          <div className="relative z-10 p-12">
            <Link href="/" className="inline-block bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
              <Image
                src="/logo-transparent.png"
                alt="Kimance Logo"
                width={100}
                height={29}
                className="h-[32px] w-auto"
              />
            </Link>
          </div>

          {/* Hero Text Area */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-12">
            <div className="text-center max-w-[540px]">
              <h1 className="text-white text-5xl font-bold leading-tight mb-4 tracking-tight font-[family-name:var(--font-playfair)]">
                Money without borders
              </h1>
              <p className="text-white/80 text-xl font-medium leading-relaxed">
                Experience the future of AI-powered finance with secure, global
                transactions at your fingertips.
              </p>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="h-24"></div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24">
          <div className="w-full max-w-[480px] flex flex-col gap-8">
            {/* Mobile Logo (Visible only on small screens) */}
            <Link href="/" className="lg:hidden flex justify-center mb-4">
              <Image
                src="/logo-transparent.png"
                alt="Kimance Logo"
                width={100}
                height={29}
                className="h-[32px] w-auto"
              />
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-900 text-4xl font-black leading-tight tracking-tight font-[family-name:var(--font-playfair)]">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-base font-normal">
                Enter your credentials to access your account.
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
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email / Phone Field */}
              {authMethod === "email" ? (
                <label className="flex flex-col gap-2">
                  <span className="text-gray-900 text-sm font-semibold ml-1">
                    Email Address
                  </span>
                  <input
                    className="flex w-full h-14 px-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </label>
              ) : (
                <label className="flex flex-col gap-2">
                  <span className="text-gray-900 text-sm font-semibold ml-1">
                    Phone Number
                  </span>
                  <div className="relative w-full">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-base font-medium pointer-events-none flex items-center gap-1">
                      <span className="material-icons-outlined text-lg">phone</span>
                    </span>
                    <input
                      className="flex w-full h-14 pl-12 pr-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </label>
              )}

              {/* Password Field - shown for email or phone with password mode */}
              {(authMethod === "email" || phoneAuthMode === "password") && (
                <label className="flex flex-col gap-2">
                  <span className="text-gray-900 text-sm font-semibold ml-1">
                    Password
                  </span>
                  <div className="relative w-full">
                    <input
                      className="flex w-full h-14 pl-5 pr-12 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6D28D9] transition-colors flex items-center justify-center"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <span className="material-icons-outlined text-xl">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </label>
              )}

              {/* Phone auth mode toggle */}
              {authMethod === "phone" && (
                <button
                  type="button"
                  onClick={() => { setPhoneAuthMode(phoneAuthMode === "password" ? "otp" : "password"); setError(null); }}
                  className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold tracking-tight transition-colors text-left ml-1"
                >
                  {phoneAuthMode === "password" ? "Sign in with OTP instead" : "Sign in with password instead"}
                </button>
              )}

              {/* Forgot Password Link - only for email or phone password mode */}
              {(authMethod === "email" || phoneAuthMode === "password") && (
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold tracking-tight transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full h-12 items-center justify-center rounded-full bg-[#6D28D9] hover:bg-[#5A24B3] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-[#6D28D9]/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-icons-outlined animate-spin">refresh</span>
                    {authMethod === "phone" && phoneAuthMode === "otp" ? "Sending code..." : "Signing in..."}
                  </span>
                ) : (
                  authMethod === "phone" && phoneAuthMode === "otp" ? "Send Verification Code" : "Sign In"
                )}
              </button>
            </form>

            {/* Footer Sign Up */}
            <div className="flex items-center justify-center gap-1 mt-4">
              <p className="text-gray-500 text-sm font-medium">
                Don&apos;t have an account?
              </p>
              <Link
                href="/register"
                className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold transition-colors"
              >
                Create an account
              </Link>
            </div>

            {/* Footer Links */}
            <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <Link href="/contact" className="text-gray-400 hover:text-[#6D28D9] text-xs font-medium transition-colors">
                Contact Us
              </Link>
              <span className="text-gray-200">|</span>
              <Link href="/features" className="text-gray-400 hover:text-[#6D28D9] text-xs font-medium transition-colors">
                Explore Our Features
              </Link>
              <span className="text-gray-200">|</span>
              <Link href="/exchange-rate" className="text-gray-400 hover:text-[#6D28D9] text-xs font-medium transition-colors">
                Exchange Rate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
