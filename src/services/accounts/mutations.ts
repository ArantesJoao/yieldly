import { Account } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAccount } from "./api"

export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createAccount'],
    mutationFn: (accountData: Account) => createAccount(accountData),
    onSuccess: (data) => {
      console.log(data)
      queryClient.refetchQueries({ queryKey: ['accounts'] })
      queryClient.resetQueries({ queryKey: ['accounts'] })
    },
    onError: (error, context) => {
      console.log(context)
      console.error(error)
    }
  })
}
