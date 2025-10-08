import { httpClient } from "@/lib/httpClient"

interface DailySummary {
  date: string
  balanceEndMinor: number
  yieldsMinor: number
  depositsMinor: number
}

export const getTotalSummary = async (from?: string, to?: string): Promise<DailySummary[]> => {
  const params = new URLSearchParams()
  if (from) params.append('from', from)
  if (to) params.append('to', to)

  const queryString = params.toString()
  const url = queryString ? `/api/summary/total?${queryString}` : '/api/summary/total'

  const response = await httpClient<DailySummary[]>(url)

  console.log(response.data)
  return response.data
}

export const getAccountSummary = async (accountId: string, from?: string, to?: string): Promise<DailySummary[]> => {
  const params = new URLSearchParams({ accountId })
  if (from) params.append('from', from)
  if (to) params.append('to', to)

  const response = await httpClient<DailySummary[]>(
    `/api/summary/account?${params.toString()}`
  )
  return response.data
}

