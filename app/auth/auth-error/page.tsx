import Link from 'next/link'
import Image from 'next/image'

export default function AuthError() {
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


          {/* Hero Text Area */}
          <div className="relative z-10 p-12 max-w-[640px]">
            <h1 className="text-white text-5xl font-bold leading-tight mb-4 tracking-tight font-[family-name:var(--font-playfair)]">
              Authentication Error
            </h1>
            <p className="text-white/90 text-xl font-medium leading-relaxed max-w-[480px]">
              We&apos;ll help you get back on track.
            </p>
          </div>
        </div>

        {/* Right Panel: Error Message */}
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

            {/* Error Icon */}
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-outlined text-4xl text-red-500">error_outline</span>
              </div>
              
              <h2 className="text-gray-900 text-3xl font-black leading-tight tracking-tight font-[family-name:var(--font-playfair)]">
                Authentication Error
              </h2>
              <p className="text-purple-600 text-sm font-normal mt-2">
                Something went wrong during authentication.
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <p className="text-red-700 text-sm leading-relaxed">
                The link may have expired or already been used. Please try again with a fresh link, or contact support if the problem persists.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="flex w-full h-12 items-center justify-center rounded-full bg-[#6D28D9] hover:bg-[#5A24B3] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-[#6D28D9]/30"
              >
                Back to Login
              </Link>
              <Link
                href="/register"
                className="flex w-full h-12 items-center justify-center rounded-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 text-base font-bold tracking-wide transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
