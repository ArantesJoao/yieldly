import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getTransactionTypes } from "./api"
import { TransactionType } from "@/types/api"

export function useTransactionTypes(enabled: boolean = true) {
  return useQuery<TransactionType[]>({
    queryKey: ['transactionTypes'],
    queryFn: () => getTransactionTypes(),
    placeholderData: keepPreviousData,
    enabled,
  })
}

