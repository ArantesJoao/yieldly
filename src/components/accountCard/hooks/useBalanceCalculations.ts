import { useMemo } from 'react'
import { convertToMinor, convertToMajor } from '@/utils/conversions'

interface UseBalanceCalculationsProps {
  currentBalanceMinor: number
  watchAmount: number
  watchNewBalanceInput: number | undefined
  isYieldsType: boolean
}

export function useBalanceCalculations({
  currentBalanceMinor,
  watchAmount,
  watchNewBalanceInput,
  isYieldsType,
}: UseBalanceCalculationsProps) {
  const newBalance = useMemo(() => {
    if (isYieldsType && watchNewBalanceInput !== undefined) {
      return convertToMinor(watchNewBalanceInput)
    }
    const amountMinor = watchAmount ? convertToMinor(watchAmount) : 0
    return currentBalanceMinor + amountMinor
  }, [isYieldsType, watchNewBalanceInput, watchAmount, currentBalanceMinor])

  const calculatedDepositAmount = useMemo(() => {
    if (isYieldsType && watchNewBalanceInput !== undefined) {
      const newBalanceMinor = convertToMinor(watchNewBalanceInput)
      const depositAmount = convertToMajor(newBalanceMinor - currentBalanceMinor)
      return depositAmount
    }
    return watchAmount
  }, [isYieldsType, watchNewBalanceInput, currentBalanceMinor, watchAmount])

  const newBalanceInMajor = useMemo(() => {
    return convertToMajor(newBalance)
  }, [newBalance])

  return {
    newBalance,
    calculatedDepositAmount,
    newBalanceInMajor,
  }
}

