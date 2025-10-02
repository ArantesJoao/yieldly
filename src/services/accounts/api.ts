import { httpClient } from "@/lib/httpClient"
import { CreateAccountData, Account } from "@/types/api"

export const createAccount = async (account: CreateAccountData): Promise<Account> => {
  const response = await httpClient.post<Account>("/api/accounts", account)
  return response.data
}

export const getAccounts = async (): Promise<Account[]> => {
  const response = await httpClient.get<Account[]>("/api/accounts")
  return response.data
}

export const getAccountById = async (id: string): Promise<Account> => {
  const response = await httpClient.get<Account>(`/api/accounts/${id}`)
  return response.data
}
