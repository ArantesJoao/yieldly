import { Account } from "@prisma/client"

export const createAccount = async (account: Account) => {
  const response = await fetch("/api/accounts", {
    method: "POST",
    body: JSON.stringify(account),
  })

  return response.json()
}

export const getAccounts = async () => {
  const response = await fetch("/api/accounts")
  return response.json()
}

export const getAccountById = async (id: string) => {
  const response = await fetch(`/api/accounts/${id}`)
  return response.json()
}
