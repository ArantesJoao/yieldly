"use client"

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/languageContext";
import { useCurrentAccount } from "@/contexts/currentAccountContext";
import { useAccountSummary, useTotalSummary } from "@/services/summary/queries";
import { formatCurrency, formatCurrencyCompact, formatDateShort, getLocalDateString } from "@/utils/conversions";

import YieldsTableSkeleton from "./YieldsTableSkeleton";
import type { DateRange } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface YieldsTableProps {
  dateRange: DateRange
}

const YieldsTable = ({ dateRange }: YieldsTableProps) => {
  const { currentAccountId } = useCurrentAccount();
  const { t } = useTranslation('dashboard');
  const { locale } = useLanguage();

  const toDate = useMemo(() => {
    return getLocalDateString(dateRange.to);
  }, [dateRange.to]);

  const fromDate = useMemo(() => {
    return getLocalDateString(dateRange.from);
  }, [dateRange.from]);

  const isTotalView = currentAccountId === "total";
  const { data: accountSummaries, isLoading: isAccountLoading } = useAccountSummary(currentAccountId, fromDate, toDate);
  const { data: totalSummaries, isLoading: isTotalLoading } = useTotalSummary(fromDate, toDate, isTotalView);

  const summaries = isTotalView ? totalSummaries : accountSummaries;
  const isLoading = isTotalView ? isTotalLoading : isAccountLoading;

  if (isLoading) {
    return <YieldsTableSkeleton />;
  }

  if (!summaries || summaries.length === 0) {
    return (
      <div className="max-h-[300px] overflow-y-auto p-4 text-center text-muted-foreground">
        {t('yieldsTable.empty')}
      </div>
    );
  }

  return (
    <div className="border rounded-sm rounded-t-none overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto">
        <Table>
          <TableHeader className="bg-muted sticky top-0">
            <TableRow>
              <TableHead className="font-semibold text-foreground">{t('yieldsTable.columns.date')}</TableHead>
              <TableHead className="font-semibold text-foreground">{t('yieldsTable.columns.balance')}</TableHead>
              <TableHead className="font-semibold text-foreground">{t('yieldsTable.columns.yields')}</TableHead>
              <TableHead className="font-semibold text-foreground">{t('yieldsTable.columns.deposits')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaries.slice().reverse().map((summary) => (
              <TableRow key={summary.date + summary.balanceEndMinor}>
                <TableCell className="font-medium text-nowrap">{formatDateShort(summary.date, locale)}</TableCell>
                <TableCell className="font-mono">
                  {formatCurrency(summary.balanceEndMinor, "BRL")}
                </TableCell>
                <TableCell className={`font-mono text-green-600 dark:text-green-400 ${summary.yieldsMinor === 0 ? 'text-center' : ''}`}>
                  {summary.yieldsMinor > 0 ? formatCurrency(summary.yieldsMinor, "BRL") : '-'}
                </TableCell>
                <TableCell className={`font-mono text-center text-blue-600 dark:text-blue-400 ${summary.depositsMinor === 0 ? 'text-center' : ''}`}>
                  {summary.depositsMinor > 0 ? formatCurrencyCompact(summary.depositsMinor) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default YieldsTable

