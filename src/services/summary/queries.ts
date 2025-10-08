import { useQuery } from "@tanstack/react-query"
import { getTotalSummary, getAccountSummary } from "./api"

export const useTotalSummary = (from?: string, to?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["totalSummary", from, to],
    queryFn: () => getTotalSummary(from, to),
    enabled,
  })
}

export const useAccountSummary = (accountId: string | null, from?: string, to?: string) => {
  return useQuery({
    queryKey: ["accountSummary", accountId, from, to],
    queryFn: () => getAccountSummary(accountId!, from, to),
    enabled: !!accountId && !!from && !!to,
  })
}

