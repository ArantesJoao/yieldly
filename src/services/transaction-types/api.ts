import { httpClient } from "@/lib/httpClient"
import { TransactionType, CreateTransactionTypeData } from "@/types/api"

export const getTransactionTypes = async (): Promise<TransactionType[]> => {
  const response = await httpClient.get<TransactionType[]>("/api/transaction-types")
  return response.data
}

export const createTransactionType = async (data: CreateTransactionTypeData): Promise<TransactionType> => {
  const response = await httpClient.post<TransactionType>("/api/transaction-types", data)
  return response.data
}

export const deleteTransactionType = async (id: string): Promise<void> => {
  await httpClient.delete(`/api/transaction-types/${id}`)
}

