import { NextResponse } from 'next/server'
import fetchRates from '../../../lib/currencyapi'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const base = url.searchParams.get('base') ?? 'USD'
  const symbolsParam = url.searchParams.get('symbols')
  const symbols = symbolsParam ? symbolsParam.split(',') : undefined

  try {
    const data = await fetchRates({ base, symbols })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
