"use client"

import { useMemo } from "react";
import { formatCurrency, formatCurrencyCompact, formatDateShort, getLocalDateString } from "@/utils/conversions";
import { useTotalSummary } from "@/services/summary/queries";
import { useAppDate } from "@/app/providers/appDateProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import YieldsTableSkeleton from "./YieldsTableSkeleton";

const YieldsTable = () => {
  const { currentDate } = useAppDate();

  // Get summaries for last 90 days from current app date
  const toDate = useMemo(() => {
    return getLocalDateString(currentDate);
  }, [currentDate]);

  const fromDate = useMemo(() => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 90);
    return getLocalDateString(date);
  }, [currentDate]);

  const { data: summaries, isLoading } = useTotalSummary(fromDate, toDate);

  if (isLoading) {
    return <YieldsTableSkeleton />;
  }

  if (!summaries || summaries.length === 0) {
    return (
      <div className="max-h-[300px] overflow-y-auto p-4 text-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="border rounded-sm rounded-t-none overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto">
        <Table>
          <TableHeader className="bg-muted sticky top-0">
            <TableRow>
              <TableHead className="font-semibold text-foreground">Date</TableHead>
              <TableHead className="font-semibold text-foreground">Balance</TableHead>
              <TableHead className="font-semibold text-foreground">Yields</TableHead>
              <TableHead className="font-semibold text-foreground">Deposits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaries.slice().reverse().map((summary) => (
              <TableRow key={summary.date}>
                <TableCell className="font-medium text-nowrap">{formatDateShort(summary.date)}</TableCell>
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

