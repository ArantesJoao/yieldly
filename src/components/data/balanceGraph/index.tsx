"use client"

import * as React from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import BalanceGraph from "./balanceGraph"

const Graphs = () => {
  const [dateRange, setDateRange] = React.useState<DateRange>(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 30)
    return { from, to }
  })

  const getDaysText = () => {
    const days = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    return `Last ${days} days`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance</CardTitle>
        <CardDescription>{getDaysText()}</CardDescription>
        <CardAction>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <BalanceGraph dateRange={dateRange} />
      </CardContent>
    </Card>
  )
}

export default Graphs
