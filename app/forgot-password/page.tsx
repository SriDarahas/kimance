'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { resetPassword } from '@/app/auth/actions'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(null)
    setIsLoading(true)
    
    const result = await resetPassword(formData)
    setIsLoading(false)
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
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
              Reset your password
            </h1>
            <p className="text-white/90 text-xl font-medium leading-relaxed max-w-[480px]">
              We&apos;ll send you a link to reset your password securely.
            </p>
          </div>
        </div>

        {/* Right Panel: Forgot Password Form */}
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
                Forgot Password?
              </h2>
              <p className="text-gray-500 text-base font-normal">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons-outlined text-3xl text-green-500">mail</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Check your email</h3>
                <p className="text-gray-500 text-sm">{success}</p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center text-[#6D28D9] font-bold hover:underline"
                >
                  <span className="material-icons-outlined text-sm mr-1">arrow_back</span>
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                {/* Form */}
                <form action={handleSubmit} className="flex flex-col gap-5">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <span className="material-icons-outlined text-red-500 mt-0.5">error_outline</span>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Email Field */}
                  <label className="flex flex-col gap-2">
                    <span className="text-gray-900 text-sm font-semibold ml-1">
                      Email Address
                    </span>
                    <input
                      className="flex w-full h-14 px-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                      placeholder="name@example.com"
                      type="email"
                      name="email"
                      required
                    />
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full h-12 items-center justify-center rounded-full bg-[#6D28D9] hover:bg-[#5A24B3] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-[#6D28D9]/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="material-icons-outlined animate-spin">refresh</span>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="flex items-center justify-center gap-1 mt-4">
                  <Link
                    href="/login"
                    className="text-[#6D28D9] hover:text-[#5A24B3] text-sm font-bold transition-colors flex items-center gap-1"
                  >
                    <span className="material-icons-outlined text-sm">arrow_back</span>
                    Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
