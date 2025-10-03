import { httpClient } from "@/lib/httpClient"
import { CreateLedgerEntryData, SpreadYieldsData } from "@/types/api"

export const createLedgerEntry = async (data: CreateLedgerEntryData) => {
  const response = await httpClient.post("/api/ledger", data)

  return response.data
}

export const spreadYields = async (data: SpreadYieldsData) => {
  const response = await httpClient.post("/api/ledger/spread", data)

  return response.data
}
