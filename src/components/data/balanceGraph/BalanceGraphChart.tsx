import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BALANCE_GRAPH_CONFIG, formatCurrency, formatCurrencyDetailed } from "./chartConfig";

interface ChartDataPoint {
  date: string;
  balance: number;
  fullDate: string;
}

interface BalanceGraphChartProps {
  data: ChartDataPoint[];
}

const BalanceGraphChart = ({ data }: BalanceGraphChartProps) => {
  return (
    <ChartContainer config={BALANCE_GRAPH_CONFIG} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullDate;
                }
                return '';
              }}
              formatter={(value) => formatCurrencyDetailed(Number(value))}
            />
          }
        />
        <Bar dataKey="balance" fill="var(--color-balance)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default BalanceGraphChart;

