"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signup } from "@/app/auth/actions";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
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
  };

  // Success state - show confirmation message
  if (success) {
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
                  Start your journey
                </h1>
                <p className="text-white/80 text-xl font-medium leading-relaxed">
                  Join thousands of users who trust Kimance for secure, borderless financial management.
                </p>
              </div>
            </div>
            <div className="h-24"></div>
          </div>

          {/* Right Panel: Success Message */}
          <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24">
            <div className="w-full max-w-[480px] text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-outlined text-4xl text-green-500">mail</span>
              </div>
              <h2 className="text-gray-900 text-3xl font-black leading-tight tracking-tight font-[family-name:var(--font-playfair)] mb-4">
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
                src="/logo-crop.png"
                alt="Kimance Logo"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Hero Text Area */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-12">
            <div className="text-center max-w-[540px]">
              <h1 className="text-white text-5xl font-bold leading-tight mb-4 tracking-tight font-[family-name:var(--font-playfair)]">
                Start your journey
              </h1>
              <p className="text-white/80 text-xl font-medium leading-relaxed">
                Join thousands of users who trust Kimance for secure, borderless
                financial management.
              </p>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="h-24"></div>
        </div>

        {/* Right Panel: Register Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24 py-12">
          <div className="w-full max-w-[480px] flex flex-col gap-6">
            {/* Mobile Logo (Visible only on small screens) */}
            <Link href="/" className="lg:hidden flex justify-center mb-4">
              <Image
                src="/logo-crop.png"
                alt="Kimance Logo"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-900 text-4xl font-black leading-tight tracking-tight font-[family-name:var(--font-playfair)]">
                Create Account
              </h2>
              <p className="text-gray-500 text-base font-normal">
                Fill in your details to get started with Kimance.
              </p>
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
              {/* Full Name Field */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-900 text-sm font-semibold ml-1">
                  Full Name
                </span>
                <input
                  className="flex w-full h-14 px-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                  placeholder="John Doe"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </label>

              {/* Email Field */}
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

              {/* Password Field */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-900 text-sm font-semibold ml-1">
                  Password
                </span>
                <div className="relative w-full">
                  <input
                    className="flex w-full h-14 pl-5 pr-12 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                    placeholder="Create a strong password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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

              {/* Confirm Password Field */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-900 text-sm font-semibold ml-1">
                  Confirm Password
                </span>
                <div className="relative w-full">
                  <input
                    className="flex w-full h-14 pl-5 pr-12 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6D28D9] transition-colors flex items-center justify-center"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    <span className="material-icons-outlined text-xl">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>

              {/* Terms and Conditions */}
              <label className="flex items-start gap-3 mt-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#6D28D9] border-gray-300 rounded focus:ring-[#6D28D9]"
                  required
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-500">
                  I agree to the{" "}
                  <Link href="#" className="text-[#6D28D9] hover:underline font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#6D28D9] hover:underline font-medium">
                    Privacy Policy
                  </Link>
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
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer Sign In */}
            <div className="flex items-center justify-center gap-1 mt-4">
              <p className="text-gray-500 text-sm font-medium">
                Already have an account?
              </p>
              <Link
                href="/login"
                className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
