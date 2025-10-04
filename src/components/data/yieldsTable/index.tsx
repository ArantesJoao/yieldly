"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import YieldsTable from "./yieldsTable"

interface YieldsTableWrapperProps {
  period?: string
}

const YieldsTableWrapper = ({ period = "Last 90 days" }: YieldsTableWrapperProps) => {
  return (
    <Card className="pb-0 gap-4">
      <CardHeader>
        <CardTitle>Yields</CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <YieldsTable />
      </CardContent>
    </Card>
  )
}

export default YieldsTableWrapper

