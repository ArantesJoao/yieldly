import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { formatDateShort, getLocalDateString } from "@/utils/conversions"
import type { DateRange } from "./types"
import { useTranslation } from "react-i18next"

interface CustomRangeProps {
  value: DateRange
  onChange: (range: DateRange) => void
  onApply: () => void
}

export function CustomRange({ value, onChange, onApply }: CustomRangeProps) {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-4 -mb-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{t('modals.dateRangePicker.title')}</h4>
          {value.from && value.to && (
            <span className="text-xs text-muted-foreground">
              {formatDateShort(getLocalDateString(value.from))} - {formatDateShort(getLocalDateString(value.to))}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {t('modals.dateRangePicker.selectPredefinedRange')}
        </p>
        <Calendar
          mode="range"
          selected={{
            from: value.from,
            to: value.to,
          }}
          onSelect={(range) => {
            if (range?.from) {
              onChange({
                from: range.from,
                to: range.to || range.from,
              })
            }
          }}
          disabled={(date) => date > new Date()}
          initialFocus
          className="w-full"
          numberOfMonths={1}
        />
      </div>

      <Button onClick={onApply} className="w-full" size="lg">
        {t('buttons.apply')}
      </Button>
    </div>
  )
}

