import { httpClient } from "@/lib/httpClient"

interface DailySummary {
  date: string
  balanceEndMinor: number
  yieldsMinor: number
  contributionsMinor: number
}

export const getTotalSummary = async (from: string, to: string): Promise<DailySummary[]> => {
  const response = await httpClient<DailySummary[]>(
    `/api/summary/total?from=${from}&to=${to}`
  )
  return response.data
}

