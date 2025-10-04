"use client"

import { useBalanceGraphData } from "./useBalanceGraphData";
import BalanceGraphEmpty from "./BalanceGraphEmpty";
import BalanceGraphChart from "./BalanceGraphChart";
import BalanceGraphSkeleton from "./BalanceGraphSkeleton";
import type { DateRange } from "@/components/ui/date-range-picker";

interface BalanceGraphProps {
  dateRange: DateRange
}

const BalanceGraph = ({ dateRange }: BalanceGraphProps) => {
  const { chartData, isLoading } = useBalanceGraphData(dateRange);

  if (isLoading) {
    return <BalanceGraphSkeleton />;
  }

  if (!chartData || chartData.length === 0) {
    return <BalanceGraphEmpty />;
  }

  return <BalanceGraphChart data={chartData} />;
};

export default BalanceGraph;
