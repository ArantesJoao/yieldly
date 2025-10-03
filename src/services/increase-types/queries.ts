import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getIncreaseTypes, IncreaseType } from "./api"

export function useIncreaseTypes(enabled: boolean = true) {
  return useQuery<IncreaseType[]>({
    queryKey: ['increaseTypes'],
    queryFn: () => getIncreaseTypes(),
    placeholderData: keepPreviousData,
    enabled,
  })
}

