export interface DateRange {
  from: Date
  to: Date
}

export interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export interface DateRangePickerContentProps {
  value: DateRange
  onChange: (range: DateRange) => void
  onClose: () => void
}

