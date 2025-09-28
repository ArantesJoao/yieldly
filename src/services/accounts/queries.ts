import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAccounts, getAccountById } from "@/services/accounts/api"

export function useAccounts(enabled: boolean = true) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
    placeholderData: keepPreviousData,
    enabled: (!queryClient.getQueryData(['company-groups']) && enabled),
  })
}

export function useCompanyGroupById(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccountById(id),
    placeholderData: keepPreviousData,
    ...options
  })
}
