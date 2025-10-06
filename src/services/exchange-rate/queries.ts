import { useQuery } from "@tanstack/react-query"
import { getExchangeRate } from "./api"

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ['exchangeRate', 'BRL', 'USD'],
    queryFn: getExchangeRate,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

