import { NextResponse } from 'next/server'
import fetchRates from '../../../lib/currencyapi'

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  data: unknown
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

export async function GET(req: Request) {
  const url = new URL(req.url)
  const base = url.searchParams.get('base') ?? 'USD'
  const symbolsParam = url.searchParams.get('symbols') ?? ''

  const cacheKey = `${base}:${symbolsParam}`
  const now = Date.now()

  // Return cached data if still fresh
  const cached = cache.get(cacheKey)
  if (cached && now < cached.expiresAt) {
    return NextResponse.json(cached.data, {
      headers: {
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      },
    })
  }

  const symbols = symbolsParam ? symbolsParam.split(',') : undefined

  try {
    const data = await fetchRates({ base, symbols })
    cache.set(cacheKey, { data, expiresAt: now + CACHE_TTL_MS })
    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      },
    })
  } catch (err: any) {
    // If the external API fails but we have stale data, return it rather than a 500
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'STALE',
          'Cache-Control': 'public, max-age=60',
        },
      })
    }
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
