"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { formatDateLong } from "@/utils/conversions";

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface SinceDatePickerProps {
  value: string
  onChange: (date: string) => void
  defaultValue?: string
}

export function SinceDatePicker({ value, onChange, defaultValue }: SinceDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const initialDate = value || defaultValue
  const [date, setDate] = React.useState<Date | undefined>(
    initialDate ? new Date(initialDate) : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [inputValue, setInputValue] = React.useState(formatDateLong(date))

  React.useEffect(() => {
    if (defaultValue && !date) {
      const defaultDate = new Date(defaultValue)
      setDate(defaultDate)
      setMonth(defaultDate)
      setInputValue(formatDateLong(defaultDate))
    }
  }, [defaultValue, date])

  React.useEffect(() => {
    if (value && value !== date?.toISOString().split('T')[0]) {
      const newDate = new Date(value)
      setDate(newDate)
      setMonth(newDate)
      setInputValue(formatDateLong(newDate))
    }
  }, [value, date])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setInputValue(formatDateLong(selectedDate))
    if (selectedDate) {
      onChange(selectedDate.toISOString().split('T')[0])
    }
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    const parsedDate = new Date(newValue)
    if (isValidDate(parsedDate)) {
      setDate(parsedDate)
      setMonth(parsedDate)
      onChange(parsedDate.toISOString().split('T')[0])
    }
  }

  return (
    <FormItem>
      <FormLabel htmlFor="since-date" className="px-1">
        Since
      </FormLabel>
      <FormControl>
        <div className="relative flex gap-2">
          <Input
            id="since-date"
            value={inputValue}
            placeholder="Select start date"
            className="bg-background pr-10"
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setOpen(true)
              }
            }}
          />
          <Popover open={open} onOpenChange={setOpen}>
            {open && (
              <div
                className="fixed inset-0 z-40 backdrop-blur-[2px]"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
            )}
            <PopoverTrigger asChild>
              <Button
                type="button"
                id="date-picker"
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                aria-label="Select date"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Select date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                className="w-[75vw]"
                month={month}
                onMonthChange={setMonth}
                onSelect={handleDateSelect}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}


