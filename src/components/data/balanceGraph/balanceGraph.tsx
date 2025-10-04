"use client"

import { useAppDate } from "@/app/providers/appDateProvider";
import { useBalanceGraphData } from "./useBalanceGraphData";
import BalanceGraphEmpty from "./BalanceGraphEmpty";
import BalanceGraphChart from "./BalanceGraphChart";

const BalanceGraph = () => {
  const { currentDate } = useAppDate();
  const { chartData, isLoading } = useBalanceGraphData(currentDate);

  if (isLoading) {
    return <BalanceGraphEmpty isLoading />;
  }

  if (!chartData || chartData.length === 0) {
    return <BalanceGraphEmpty />;
  }

  return <BalanceGraphChart data={chartData} />;
};

export default BalanceGraph;
