"use client"

import { useState, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateShort, getLocalDateString } from "@/utils/conversions"
import { useTotalSummary } from "@/services/summary/queries"
import { useAppDate } from "@/app/providers/appDateProvider"
import { Calendar as CalendarIcon, ChevronDown, ChevronUp } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { currentDate, setCurrentDate } = useAppDate()

  // Check if date is overridden
  const isDateOverridden = useMemo(() => {
    const today = new Date()
    return getLocalDateString(currentDate) !== getLocalDateString(today)
  }, [currentDate])

  // Get summaries for last 90 days from current app date
  const toDate = useMemo(() => {
    return getLocalDateString(currentDate)
  }, [currentDate])

  const fromDate = useMemo(() => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - 90)
    return getLocalDateString(date)
  }, [currentDate])

  const { data: summaries, isLoading } = useTotalSummary(fromDate, toDate, true)

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full py-2 flex items-center justify-between hover:bg-muted ${isDateOverridden ? 'bg-yellow-100 dark:bg-yellow-900/20 hover:bg-yellow-200 dark:hover:bg-yellow-900/30' : ''
            }`}
          aria-label="Toggle debug panel"
        >
          <span className="font-semibold text-xs uppercase tracking-wide flex items-center gap-2">
            <span className="text-muted-foreground">🐛 Debug Panel</span>
            {isDateOverridden && (
              <span className="text-yellow-700 dark:text-yellow-400 animate-pulse">
                ⚠️ Date Override Active
              </span>
            )}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>

        {isExpanded && (
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Date Control */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Application Date</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentDate}
                        onSelect={(date) => {
                          if (date) {
                            date.setHours(12, 0, 0, 0)
                            setCurrentDate(date)
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const date = new Date(currentDate)
                      date.setHours(12, 0, 0, 0)
                      date.setDate(date.getDate() - 1)
                      setCurrentDate(date)
                    }}
                  >
                    -1 Day
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const date = new Date(currentDate)
                      date.setHours(12, 0, 0, 0)
                      date.setDate(date.getDate() + 1)
                      setCurrentDate(date)
                    }}
                  >
                    +1 Day
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const date = new Date(currentDate)
                      date.setHours(12, 0, 0, 0)
                      date.setDate(date.getDate() - 7)
                      setCurrentDate(date)
                    }}
                  >
                    -1 Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const date = new Date(currentDate)
                      date.setHours(12, 0, 0, 0)
                      date.setDate(date.getDate() + 7)
                      setCurrentDate(date)
                    }}
                  >
                    +1 Week
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded border border-yellow-300 dark:border-yellow-700">
                  <p><strong>⚠️ Active:</strong> Application date is overridden. All deposits will use the selected date.</p>
                  <p className="mt-1 text-[10px]">Current app date: <strong>{getLocalDateString(currentDate)}</strong></p>
                </div>
              </div>

              {/* Daily Summaries Table */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">
                  Daily Summaries (Last 90 days)
                </h3>

                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading summaries...</div>
                ) : summaries && summaries.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-[40vh] overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-muted sticky top-0">
                          <tr>
                            <th className="text-left p-2 font-semibold">Date</th>
                            <th className="text-right p-2 font-semibold">Balance</th>
                            <th className="text-right p-2 font-semibold">Yields</th>
                            <th className="text-right p-2 font-semibold">Deposits</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summaries.slice().reverse().map((summary) => (
                            <tr
                              key={summary.date}
                              className="border-t hover:bg-muted/50"
                            >
                              <td className="p-2 font-medium">{formatDateShort(summary.date)}</td>
                              <td className="p-2 text-right font-mono">
                                {formatCurrency(summary.balanceEndMinor, "BRL")}
                              </td>
                              <td className="p-2 text-right font-mono text-green-600 dark:text-green-400">
                                {summary.yieldsMinor > 0 ? formatCurrency(summary.yieldsMinor, "BRL") : '-'}
                              </td>
                              <td className="p-2 text-right font-mono text-blue-600 dark:text-blue-400">
                                {summary.depositsMinor > 0 ? formatCurrency(summary.depositsMinor, "BRL") : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No summaries found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

