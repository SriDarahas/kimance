"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="font-(family-name:--font-inter) bg-gray-50 text-gray-900 min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
          >
            <span className="material-icons-outlined text-xl group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            <span className="text-sm font-medium">Back</span>
          </button>
          <Image src="/logo-crop.png" alt="Kimance Logo" width={120} height={36} className="h-9 w-auto" />
          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-linear-to-br from-primary to-[#4C1D95] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 font-(family-name:--font-playfair)">
            Get in Touch
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
            Have a question or need support? We&apos;re here to help — reach out anytime.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-4xl mx-auto px-6 -mt-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Service Email Card */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-icons-outlined text-primary text-3xl">email</span>
            </div>
            <div>
              <h3 className="text-gray-900 text-xl font-bold mb-1">Customer Service</h3>
              <a
                href="mailto:contact@kimance.com"
                className="text-primary hover:text-[#5A24B3] text-base font-semibold transition-colors break-all"
              >
                contact@kimance.com
              </a>
            </div>
            <p className="text-gray-400 text-sm">General inquiries &amp; account questions</p>
          </div>

          {/* Support Email Card */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-icons-outlined text-primary text-3xl">support_agent</span>
            </div>
            <div>
              <h3 className="text-gray-900 text-xl font-bold mb-1">Support &amp; Help</h3>
              <a
                href="mailto:support@kimance.com"
                className="text-primary hover:text-[#5A24B3] text-base font-semibold transition-colors break-all"
              >
                support@kimance.com
              </a>
            </div>
            <p className="text-gray-400 text-sm">Technical issues &amp; troubleshooting</p>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-icons-outlined text-primary text-3xl">phone</span>
            </div>
            <div>
              <h3 className="text-gray-900 text-xl font-bold mb-2">Call Us</h3>
              <a
                href="tel:+16132903200"
                className="text-primary hover:text-[#5A24B3] text-base font-semibold transition-colors"
              >
                (613) 290-3200
              </a>
            </div>
            <p className="text-gray-400 text-sm">Mon–Fri, 9 AM – 5 PM EST</p>
          </div>
        </div>
      </section>
    </div>
  );
}
