"use client"
import React, { useEffect, useState } from 'react'

type Rate = {
  code: string
  value: number
}

type RatesResponse = {
  data?: Record<string, Rate>
  meta?: any
  error?: string
}

export default function WatchlistClient() {
  const [rates, setRates] = useState<Record<string, Rate> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/currency?base=USD&symbols=USD,CAD')
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
      <h3 className="font-serif text-base font-semibold text-gray-900 mb-3">Watchlist</h3>
      <div className="space-y-2">
        {loading && <p className="text-xs text-gray-500">Loading rates…</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1.5 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold">$</div>
                <span className="text-xs font-medium text-gray-800">USD</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-gray-800">{rates?.USD ? rates.USD.value.toFixed(4) : '—'}</span>
                <span className="text-xs text-gray-500 block">Base: USD</span>
              </div>
            </div>

            <div className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1.5 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">C</div>
                <span className="text-xs font-medium text-gray-800">CAD</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-gray-800">{rates?.CAD ? rates.CAD.value.toFixed(4) : '—'}</span>
                <span className="text-xs text-gray-500 block">Updated every 10s</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
