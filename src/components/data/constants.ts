import { type ChartConfig } from "@/components/ui/chart"

export const YIELDS_GRAPH_TYPE = "yields"

export interface YieldsChartData {
  day: string
  yields: number
  balance: number
  deposits: number
}

export const YIELDS_GRAPH_CONFIG = {
  yields: {
    label: "Yields",
    color: "#2563eb",
  },
} satisfies ChartConfig
