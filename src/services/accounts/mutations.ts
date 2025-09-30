import { createAccount } from "./api"
import { CreateAccountData } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createAccount'],
    mutationFn: (accountData: CreateAccountData) => createAccount(accountData),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['accounts'] })
      queryClient.resetQueries({ queryKey: ['accounts'] })
      toast.success("Account created successfully")
    },
    onError: () => {
      toast.error("Failed to create account")
    }
  })
}
