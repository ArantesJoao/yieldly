import { useMemo } from "react";
import { getLocalDateString, convertToMajor } from "@/utils/conversions";
import { useAccountSummary } from "@/services/summary/queries";
import { useCurrentAccount } from "@/contexts/currentAccountContext";
import type { DateRange } from "@/components/ui/date-range-picker";

export const useBalanceGraphData = (dateRange: DateRange) => {
  const { currentAccountId } = useCurrentAccount();

  const toDate = useMemo(() => {
    return getLocalDateString(dateRange.to);
  }, [dateRange.to]);

  const fromDate = useMemo(() => {
    return getLocalDateString(dateRange.from);
  }, [dateRange.from]);

  const { data: summaries, isLoading } = useAccountSummary(currentAccountId, fromDate, toDate);

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

