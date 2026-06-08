"use client"
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { getTranslation } from '@/lib/i18n'

type Rate = {
  code: string
  value: number
}

type RatesResponse = {
  data?: Record<string, Rate>
  meta?: any
  error?: string
}

const WATCHLIST_CURRENCIES: { code: string; flag: string; name: string; color: string }[] = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar", color: "bg-gray-800" },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar", color: "bg-red-600" },
  { code: "EUR", flag: "🇪🇺", name: "Euro", color: "bg-blue-600" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound", color: "bg-indigo-600" },
  { code: "CDF", flag: "🇨🇩", name: "Congolese Franc", color: "bg-sky-600" },
  { code: "XAF", flag: "🇨🇲", name: "CFA Franc (CEMAC)", color: "bg-green-700" },
  { code: "XOF", flag: "🇨🇮", name: "CFA Franc (UEMOA)", color: "bg-orange-600" },
  { code: "KES", flag: "🇰🇪", name: "Kenyan Shilling", color: "bg-red-700" },
  { code: "NGN", flag: "🇳🇬", name: "Nigerian Naira", color: "bg-green-600" },
  { code: "RWF", flag: "🇷🇼", name: "Rwandan Franc", color: "bg-cyan-600" },
  { code: "BIF", flag: "🇧🇮", name: "Burundian Franc", color: "bg-red-500" },
  { code: "TZS", flag: "🇹🇿", name: "Tanzanian Shilling", color: "bg-blue-500" },
  { code: "UGX", flag: "🇺🇬", name: "Ugandan Shilling", color: "bg-yellow-600" },
  { code: "ZAR", flag: "🇿🇦", name: "South African Rand", color: "bg-green-500" },
  { code: "GHS", flag: "🇬🇭", name: "Ghanaian Cedi", color: "bg-yellow-500" },
  { code: "ETB", flag: "🇪🇹", name: "Ethiopian Birr", color: "bg-lime-600" },
  { code: "MAD", flag: "🇲🇦", name: "Moroccan Dirham", color: "bg-red-600" },
  { code: "EGP", flag: "🇪🇬", name: "Egyptian Pound", color: "bg-amber-600" },
  { code: "MZN", flag: "🇲🇿", name: "Mozambican Metical", color: "bg-teal-600" },
  { code: "AOA", flag: "🇦🇴", name: "Angolan Kwanza", color: "bg-red-800" },
]

const ALL_CODES = WATCHLIST_CURRENCIES.map(c => c.code)

export default function WatchlistClient() {
  const { language } = useLanguage()
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars)
  const [rates, setRates] = useState<Record<string, Rate> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/currency?base=USD&symbols=${ALL_CODES.join(",")}`)
      const json = (await res.json()) as RatesResponse
      if (!res.ok) throw new Error(json?.error || 'Failed to load rates')
      setRates(json.data ?? null)
    } catch (err: any) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg font-bold text-gray-900">{t('watchlist')}</h3>
        <span className="text-[10px] text-gray-400 font-medium">{WATCHLIST_CURRENCIES.length} currencies</span>
      </div>
      
      {loading && <p className="text-xs text-gray-500">{t('loadingRates')}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="max-h-[260px] overflow-y-auto space-y-1 pr-1">
          {WATCHLIST_CURRENCIES.map((curr) => {
            const rate = rates?.[curr.code]
            return (
              <div key={curr.code} className="w-full flex items-center justify-between hover:bg-purple-50 rounded-lg p-2 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{curr.flag}</span>
                  <div>
                    <span className="text-xs font-bold text-gray-900">{curr.code}</span>
                    <span className="text-[10px] text-gray-400 block leading-tight">{curr.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900">
                    {rate ? rate.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: rate.value > 100 ? 0 : 4 }) : '—'}
                  </span>
                  <span className="text-[10px] text-gray-400 block">per USD</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
