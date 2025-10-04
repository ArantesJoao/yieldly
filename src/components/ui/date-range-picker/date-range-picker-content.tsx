import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuickRanges } from "./quick-ranges"
import { CustomRange } from "./custom-range"
import type { DateRange, DateRangePickerContentProps } from "./types"

export function DateRangePickerContent({ value, onChange, onClose }: DateRangePickerContentProps) {
  const [tempRange, setTempRange] = React.useState<DateRange>(value)

  const handleQuickSelect = (range: DateRange) => {
    setTempRange(range)
    onChange(range)
    onClose()
  }

  const handleCustomChange = (range: DateRange) => {
    setTempRange(range)
  }

  const handleApply = () => {
    onChange(tempRange)
    onClose()
  }

  return (
    <Tabs defaultValue="quick" className="w-full">
      <div className="px-4 pt-4">
        <TabsList className="w-full">
          <TabsTrigger value="quick" className="flex-1">
            Quick Ranges
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex-1">
            Custom Range
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="quick" className="p-4 mt-0">
        <QuickRanges onSelectRange={handleQuickSelect} />
      </TabsContent>

      <TabsContent value="custom" className="p-4 mt-0 space-y-4">
        <CustomRange
          value={tempRange}
          onChange={handleCustomChange}
          onApply={handleApply}
        />
      </TabsContent>
    </Tabs>
  )
}

