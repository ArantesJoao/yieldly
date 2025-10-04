import { createLedgerEntry, spreadYields } from "./api"
import { CreateLedgerEntryData, SpreadYieldsData } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateLedgerEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createLedgerEntry'],
    mutationFn: (data: CreateLedgerEntryData) => createLedgerEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['account'] })

      // Invalidate all summary queries
      queryClient.invalidateQueries({ queryKey: ['totalSummary'] })
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] })

      toast.success("Deposit created successfully")
    },
    onError: () => {
      toast.error("Failed to create deposit")
    }
  })
}

export const useSpreadYields = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['spreadYields'],
    mutationFn: (data: SpreadYieldsData) => spreadYields(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['account'] })

      // Invalidate all summary queries
      queryClient.invalidateQueries({ queryKey: ['totalSummary'] })
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] })

      toast.success("Yields spread successfully")
    },
    onError: () => {
      toast.error("Failed to spread yields")
    }
  })
}
