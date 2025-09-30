import { httpClient } from "@/lib/httpClient"
import { CreateAccountData } from "@/types/api"

export const createAccount = async (account: CreateAccountData) => {
  const response = await httpClient.post("/api/accounts", account)
  return response.data
}

export const getAccounts = async () => {
  const response = await httpClient.get("/api/accounts")
  return response.data
}

export const getAccountById = async (id: string) => {
  const response = await httpClient.get(`/api/accounts/${id}`)
  return response.data
}
