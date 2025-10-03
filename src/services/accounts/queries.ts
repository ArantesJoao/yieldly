import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAccounts, getAccountById } from "@/services/accounts/api"
import { Account } from "@/types/api"

export function useAccounts(enabled: boolean = true) {
  return useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useAccount(id: string, options?: { enabled?: boolean }) {
  return useQuery<Account>({
    queryKey: ['account', id],
    queryFn: () => getAccountById(id),
    placeholderData: keepPreviousData,
    ...options
  })
}
