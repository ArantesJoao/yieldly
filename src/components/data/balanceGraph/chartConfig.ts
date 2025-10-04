import { type ChartConfig } from "@/components/ui/chart";

export const BALANCE_GRAPH_CONFIG = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const formatCurrency = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR')}`;
};

export const formatCurrencyDetailed = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

