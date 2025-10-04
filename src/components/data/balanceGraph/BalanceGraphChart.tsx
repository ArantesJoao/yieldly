import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BALANCE_GRAPH_CONFIG } from "./chartConfig";
import { convertToMinor, formatCurrencyCompact, formatCurrencyFromMajorDetailed } from "@/utils/conversions";

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
          tickFormatter={(value) => formatCurrencyCompact(convertToMinor(value))}
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
              formatter={(value) => formatCurrencyFromMajorDetailed(Number(value))}
            />
          }
        />
        <Bar dataKey="balance" fill="#64748b" radius={2} />
      </BarChart>
    </ChartContainer>
  );
};

export default BalanceGraphChart;

