import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTransactionType, deleteTransactionType } from "./api"
import { CreateTransactionTypeData } from "@/types/api"
import { toast } from "sonner"

export function useCreateTransactionType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionTypeData) => createTransactionType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionTypes'] })
      toast.success("Transaction type created successfully")
    },
    onError: () => {
      toast.error("Failed to create transaction type")
    }
  })
}

export function useDeleteTransactionType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransactionType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionTypes'] })
      toast.success("Transaction type deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete transaction type")
    }
  })
}

