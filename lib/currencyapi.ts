export type CurrencyApiLatestResponse = {
  data: Record<
    string,
    {
      code: string
      value: number
    }
  >
  meta?: Record<string, any>
}

type FetchRatesOptions = {
  base?: string
  symbols?: string[]
}

export async function fetchRates({ base = 'USD', symbols }: FetchRatesOptions = {}) {
  const key = process.env.CURRENCYAPI_KEY
  if (!key) {
    throw new Error('Missing environment variable CURRENCYAPI_KEY')
  }

  const params = new URLSearchParams({ base_currency: base })
  if (symbols && symbols.length) params.set('currencies', symbols.join(','))
  params.set('apikey', key)

  const url = `https://api.currencyapi.com/v3/latest?${params.toString()}`

  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`CurrencyAPI error: ${res.status} ${text}`)
  }

  const json = (await res.json()) as CurrencyApiLatestResponse
  return json
}

export default fetchRates
