import { httpClient } from "@/lib/httpClient"
import { CreateLedgerEntryData } from "@/types/api"

export const createLedgerEntry = async (data: CreateLedgerEntryData) => {
  const response = await httpClient.post("/api/ledger", data)

  return response.data
}
