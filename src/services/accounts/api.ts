import { httpClient } from "@/lib/httpClient"
import { CreateAccountData, UpdateAccountData, Account } from "@/types/api"

export const createAccount = async (account: CreateAccountData): Promise<Account> => {
  const response = await httpClient.post<Account>("/api/accounts", account)
  return response.data
}

export const getAccounts = async (): Promise<Account[]> => {
  const response = await httpClient.get<Account[]>("/api/accounts")
  return response.data
}

const getTotalAccountsSummary = async (): Promise<number> => {
  const response = await httpClient.get<number>("/api/accounts/total-balance")
  return response.data
}

export const getAccountById = async (id: string): Promise<Account> => {
  const response = await httpClient.get<Account>(`/api/accounts/${id}`)
  return response.data
}

export const updateAccount = async (id: string, data: UpdateAccountData): Promise<Account> => {
  const response = await httpClient.patch<Account>(`/api/accounts/${id}`, data)
  return response.data
}

export const deleteAccount = async (id: string): Promise<{ success: boolean }> => {
  const response = await httpClient.delete<{ success: boolean }>(`/api/accounts/${id}`)
  return response.data
}
