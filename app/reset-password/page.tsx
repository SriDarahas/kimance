'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { updatePassword } from '@/app/auth/actions'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    const result = await updatePassword(formData)
    setIsLoading(false)
    
    if (result?.error) {
      setError(result.error)
    }
    // Success will redirect automatically via server action
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
            <Link href="/" className="inline-block bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
              <Image
                src="/logo-transparent-new.png"
                alt="Kimance Logo"
                width={400}
                height={114}
                className="h-[126px] w-auto"
              />
            </Link>
          </div>

          {/* Hero Text Area */}
          <div className="relative z-10 p-12 max-w-[640px]">
            <h1 className="text-white text-5xl font-bold leading-tight mb-4 tracking-tight font-[family-name:var(--font-playfair)]">
              Set new password
            </h1>
            <p className="text-white/90 text-xl font-medium leading-relaxed max-w-[480px]">
              Create a strong password to secure your account.
            </p>
          </div>
        </div>

        {/* Right Panel: Reset Password Form */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-white px-4 sm:px-12 xl:px-24">
          <div className="w-full max-w-[480px] flex flex-col gap-8">
            {/* Mobile Logo (Visible only on small screens) */}
            <Link href="/" className="lg:hidden flex justify-center mb-4">
              <Image
                src="/logo-transparent-new.png"
                alt="Kimance Logo"
                width={400}
                height={114}
                className="h-[126px] w-auto"
              />
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-900 text-4xl font-black leading-tight tracking-tight font-[family-name:var(--font-playfair)]">
                New Password
              </h2>
              <p className="text-gray-500 text-base font-normal">
                Enter your new password below.
              </p>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="flex flex-col gap-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <span className="material-icons-outlined text-red-500 mt-0.5">error_outline</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Password Field */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-900 text-sm font-semibold ml-1">
                  New Password
                </span>
                <input
                  className="flex w-full h-14 px-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                  placeholder="Create a strong password"
                  type="password"
                  name="password"
                  required
                  minLength={6}
                />
              </label>

              {/* Confirm Password Field */}
              <label className="flex flex-col gap-2">
                <span className="text-gray-900 text-sm font-semibold ml-1">
                  Confirm New Password
                </span>
                <input
                  className="flex w-full h-14 px-5 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 transition-all text-base font-medium"
                  placeholder="Confirm your password"
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
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
                    Updating...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
