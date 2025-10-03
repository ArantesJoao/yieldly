import { createAccount, updateAccount, deleteAccount } from "./api"
import { CreateAccountData, UpdateAccountData } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createAccount'],
    mutationFn: (accountData: CreateAccountData) => createAccount(accountData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success("Account created successfully")
    },
    onError: () => {
      toast.error("Failed to create account")
    }
  })
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateAccount'],
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountData }) => updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['account'] })
      toast.success("Account updated successfully")
    },
    onError: () => {
      toast.error("Failed to update account")
    }
  })
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['deleteAccount'],
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success("Account deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete account")
    }
  })
}
