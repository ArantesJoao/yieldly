import { useQuery } from "@tanstack/react-query"
import { getTotalSummary } from "./api"

export const useTotalSummary = (from: string, to: string) => {
  return useQuery({
    queryKey: ["totalSummary", from, to],
    queryFn: () => getTotalSummary(from, to),
    enabled: !!from && !!to,
  })
}

