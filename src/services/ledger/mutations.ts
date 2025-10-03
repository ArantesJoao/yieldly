import { createLedgerEntry } from "./api"
import { CreateLedgerEntryData } from "@/types/api"
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

      queryClient.invalidateQueries({ queryKey: ['summary'] })

      toast.success("Deposit created successfully")
    },
    onError: () => {
      toast.error("Failed to create deposit")
    }
  })
}
