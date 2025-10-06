import axios from 'axios'

interface FrankfurterResponse {
  rates: {
    USD: number
  }
}

export const getExchangeRate = async (): Promise<number> => {
  const response = await axios.get<FrankfurterResponse>(
    'https://api.frankfurter.dev/v1/latest?base=BRL&symbols=USD'
  )

  return response.data.rates.USD
}

