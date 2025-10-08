import { DailySummary } from "@/services/summary/api";
import { AccountCardProps } from "@/components/accountCard/accountCard";

export const transformTotalSummaryToAcocuntCard = (summaries: DailySummary[] | undefined): AccountCardProps | null => {
  if (!summaries) return null;

  const mostRecentSummary = summaries[summaries.length - 1];

  const accountProps: AccountCardProps = {
    account: {
      id: "total",
      label: "Total",
      institution: "Total",
      currentBalanceMinor: mostRecentSummary.balanceEndMinor,
    },
    className: "h-72",
  }

  return accountProps;
}
