import { useEffect, useMemo } from 'react'
import { getAccountSummary } from '@/services/summary/api'
import { useQuery } from '@tanstack/react-query'
import { UseFormReturn } from 'react-hook-form'
import { DepositFormValues } from './useDepositFormState'
import { useAppDate } from '@/app/providers/appDateProvider'

interface UseLastDateWithoutYieldsProps {
  accountId: string
  isYieldsType: boolean
  form: UseFormReturn<DepositFormValues>
}

export function useLastDateWithoutYields({
  accountId,
  isYieldsType,
  form,
}: UseLastDateWithoutYieldsProps) {
  const { getCurrentDateString } = useAppDate()
  const today = getCurrentDateString()

  // Query summaries from a year ago to today to find the last date without yields
  const oneYearAgo = useMemo(() => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 1)
    return date.toISOString().split('T')[0]
  }, [])

  const { data: summaries } = useQuery({
    queryKey: ['accountSummary', accountId, oneYearAgo, today],
    queryFn: () => getAccountSummary(accountId, oneYearAgo, today),
    enabled: !!accountId,
  })

  const lastDateWithoutYields = useMemo(() => {
    if (!summaries || summaries.length === 0) {
      return today
    }

    // Find the last summary with yields > 0
    let lastYieldDate: string | null = null
    for (let i = summaries.length - 1; i >= 0; i--) {
      if (summaries[i].yieldsMinor > 0) {
        lastYieldDate = summaries[i].date
        break
      }
    }

    if (!lastYieldDate) {
      // No yields found, return the first summary date or today
      return summaries[0]?.date || today
    }

    // Return the day after the last yield date
    const lastDate = new Date(lastYieldDate)
    lastDate.setDate(lastDate.getDate() + 1)
    return lastDate.toISOString().split('T')[0]
  }, [summaries, today])

  // Set default value when Yields type is selected
  useEffect(() => {
    if (isYieldsType && lastDateWithoutYields) {
      const currentSinceDate = form.getValues("sinceDate")
      if (!currentSinceDate) {
        form.setValue("sinceDate", lastDateWithoutYields)
      }
    }
  }, [isYieldsType, lastDateWithoutYields, form])

  return {
    lastDateWithoutYields,
  }
}

