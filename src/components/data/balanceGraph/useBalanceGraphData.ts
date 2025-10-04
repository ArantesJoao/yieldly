import { useMemo } from "react";
import { getLocalDateString, convertToMajor } from "@/utils/conversions";
import { useTotalSummary } from "@/services/summary/queries";
import type { DateRange } from "@/components/ui/date-range-picker";

export const useBalanceGraphData = (dateRange: DateRange) => {
  const toDate = useMemo(() => {
    return getLocalDateString(dateRange.to);
  }, [dateRange.to]);

  const fromDate = useMemo(() => {
    return getLocalDateString(dateRange.from);
  }, [dateRange.from]);

  const { data: summaries, isLoading } = useTotalSummary(fromDate, toDate);

  const chartData = useMemo(() => {
    if (!summaries) return [];

    return summaries.map((summary) => {
      const [year, month, day] = summary.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      return {
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        balance: convertToMajor(summary.balanceEndMinor),
        fullDate: summary.date,
      };
    });
  }, [summaries]);

  return { chartData, isLoading };
};

