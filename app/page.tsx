import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#F3F4F6] text-gray-800 font-[family-name:var(--font-inter)] min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Kimance Logo"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#6D28D9] font-bold tracking-tight">
            Kimance
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 bg-[#6D28D9]/10 text-[#6D28D9] rounded-xl font-medium text-sm"
          >
            <span className="material-icons-outlined text-xl">dashboard</span>
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">account_balance_wallet</span>
            My Wallets
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">receipt_long</span>
            Transactions
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">pie_chart</span>
            Budgeting
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              New
            </span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">settings</span>
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link href="/settings" className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
            <Image
              alt="User Avatar"
              className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbXr3DDLyxloYuvfePJxu5u_hv5Cs48XjznWxqit9UDCu3ZjK-6DvfuZpUVWckI1hULyWPmPiYiSljlJWnD4IjiTIh9A1r34OIX50pAiJfo0y_aHeaghYxBGWbr56WXXVKT9W9QXf76NVUJrFN6xVMIrdJ1tieKJwnv3btBt7elx5wSd-rpA1aMGe55bn_MzhWKVZBOwGzimrfK1uYadc4hPe-43-mO4aaoBlFaxDzJKuUu2hchBJrA8TqiATMsFxACVKb3EY0uwZZ"
              width={36}
              height={36}
            />
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900">Yanis M.</span>
              <span className="text-xs text-gray-500">Pro Member</span>
            </div>
            <span className="material-icons-outlined ml-auto text-gray-400 text-xl">
              expand_more
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-gray-900">
              Hi, Yanis
            </h1>
            <p className="text-xs text-gray-500">Welcome back to your financial overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#6D28D9] transition-colors relative shadow-sm">
              <span className="material-icons-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500">
              <span className="material-icons-outlined text-xl">menu</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
          {/* Top Row - Balance Card + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Balance Card */}
            <div className="lg:col-span-5 relative group">
              <div className="gradient-card h-52 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden ring-1 ring-black/5 transition-transform transform hover:scale-[1.01] duration-300">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#6D28D9]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 font-medium mb-1 text-sm">Global Balance</p>
                    <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium tracking-tight">
                      $12,450.00
                    </h2>
                  </div>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <span className="material-icons-outlined text-xl">more_vert</span>
                  </button>
                </div>
                <div className="relative z-10 flex items-end justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium flex items-center">
                      <span className="material-icons-outlined text-sm mr-0.5">arrow_upward</span>
                      2.5%
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 border border-white/10"></div>
                    <div className="w-6 h-6 rounded-full bg-[#6D28D9]/40 border border-white/10"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="#" className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-200 hover:bg-blue-300 transition-colors group border border-transparent">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-icons-outlined text-xl">add</span>
                </div>
                <span className="font-medium text-gray-800 text-xs">Add Funds</span>
              </Link>
              <Link href="/send-money" className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-purple-200 hover:bg-purple-300 transition-colors group border border-transparent">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-icons-outlined text-xl">arrow_forward</span>
                </div>
                <span className="font-medium text-gray-800 text-xs">Send Money</span>
              </Link>
              <Link href="#" className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-orange-200 hover:bg-orange-300 transition-colors group border border-transparent">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-icons-outlined text-xl">currency_exchange</span>
                </div>
                <span className="font-medium text-gray-800 text-xs">Exchange</span>
              </Link>
              <Link href="#" className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-green-200 hover:bg-green-300 transition-colors group border border-transparent">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-icons-outlined text-xl">currency_bitcoin</span>
                </div>
                <span className="font-medium text-gray-800 text-xs">Crypto</span>
              </Link>
            </div>
          </div>

          {/* Bottom Row - Transactions + Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-gray-900">
                  Recent Transactions
                </h3>
                <Link href="#" className="text-[#6D28D9] text-xs font-medium hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                      <span className="material-icons-outlined text-xl">shopping_basket</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Organika Grocers</p>
                      <p className="text-xs text-gray-500">Today, 2:03pm</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">-$35.43</span>
                </button>
                <button className="w-full flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <span className="material-icons-outlined text-xl">fitness_center</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">APZ Sports House</p>
                      <p className="text-xs text-gray-500">Today, 12:43pm</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">-$120.00</span>
                </button>
                <button className="w-full flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                      <span className="material-icons-outlined text-xl">local_bar</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Sloven Bar</p>
                      <p className="text-xs text-gray-500">Yesterday, 10:05pm</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">-$85.20</span>
                </button>
                <button className="w-full flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <span className="material-icons-outlined text-xl">subscriptions</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Netflix Subscription</p>
                      <p className="text-xs text-gray-500">Oct 24, 9:00am</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">-$15.99</span>
                </button>
              </div>
            </div>

            {/* Right Column - Insights + Watchlist */}
            <div className="lg:col-span-1 space-y-4">
              {/* AI Insights */}
              <div className="bg-gradient-to-br from-[#6D28D9]/10 to-blue-500/10 rounded-2xl p-4 border border-[#6D28D9]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <span className="material-icons-outlined text-5xl text-[#6D28D9]">psychology</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#6D28D9] text-white text-xs font-bold px-2 py-0.5 rounded">AI</span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-gray-900">
                    Smart Insights
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <span className="font-semibold text-[#6D28D9]">Good job!</span> You spent{" "}
                      <span className="font-semibold text-green-600">15% less</span> on dining out
                      compared to last week.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 opacity-80">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Projected savings for this month:{" "}
                      <span className="font-semibold text-gray-900">$450.00</span> based on current
                      trends.
                    </p>
                  </div>
                </div>
                <button className="mt-3 w-full py-2 bg-white text-[#6D28D9] font-medium text-xs rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  View Full Report
                </button>
              </div>

              {/* Watchlist */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold text-gray-900 mb-3">
                  Watchlist
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1.5 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        B
                      </div>
                      <span className="text-xs font-medium text-gray-800">Bitcoin</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-gray-800">$34,210</span>
                      <span className="text-xs text-green-500 block">+1.2%</span>
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1.5 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        E
                      </div>
                      <span className="text-xs font-medium text-gray-800">Ethereum</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-gray-800">$1,780</span>
                      <span className="text-xs text-red-500 block">-0.5%</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
