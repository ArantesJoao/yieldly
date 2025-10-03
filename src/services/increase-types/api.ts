import { httpClient } from "@/lib/httpClient"

export interface IncreaseType {
  id: string
  ownerUserId: string
  name: string
}

export const getIncreaseTypes = async (): Promise<IncreaseType[]> => {
  const response = await httpClient.get<IncreaseType[]>("/api/increase-types")
  return response.data
}

