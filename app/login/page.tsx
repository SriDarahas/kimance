"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password });
  };

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
          <div className="absolute inset-0 bg-gradient-to-b from-[#6D28D9]/30 to-gray-900/90"></div>

          {/* Logo Area */}
          <div className="relative z-10 p-12">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/icon.png"
                alt="Kimance Logo"
                width={40}
                height={40}
                className="rounded"
              />
              <span className="text-white text-2xl font-bold tracking-tight font-[family-name:var(--font-playfair)]">
                Kimance
              </span>
            </Link>
          </div>

          {/* Hero Text Area */}
          <div className="relative z-10 p-12 max-w-[640px]">
            <h1 className="text-white text-5xl font-bold leading-tight mb-4 tracking-tight font-[family-name:var(--font-playfair)]">
              Money without borders
            </h1>
            <p className="text-white/90 text-xl font-medium leading-relaxed max-w-[480px]">
              Experience the future of AI-powered finance with secure, global
              transactions at your fingertips.
            </p>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24">
          <div className="w-full max-w-[480px] flex flex-col gap-8">
            {/* Mobile Logo (Visible only on small screens) */}
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-4">
              <Image
                src="/icon.png"
                alt="Kimance Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-gray-900 text-xl font-bold font-[family-name:var(--font-playfair)]">
                Kimance
              </span>
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

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6D28D9] transition-colors flex items-center justify-center"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-icons-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold tracking-tight transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="flex w-full h-12 items-center justify-center rounded-full bg-[#6D28D9] hover:bg-[#5A24B3] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-[#6D28D9]/30 mt-2"
              >
                Sign In
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
          </div>
        </div>
      </div>
    </div>
  );
}
