import { useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { DepositFormValues } from './useDepositFormState'
import { convertToMajor, convertToMinor } from '@/utils/conversions'

interface UseYieldsBalanceSyncProps {
  isYieldsType: boolean
  watchAmount: number
  watchNewBalanceInput: number | undefined
  currentBalanceMinor: number
  form: UseFormReturn<DepositFormValues>
}

export function useYieldsBalanceSync({
  isYieldsType,
  watchAmount,
  watchNewBalanceInput,
  currentBalanceMinor,
  form,
}: UseYieldsBalanceSyncProps) {
  const lastAmountRef = useRef<number>(watchAmount)
  const lastNewBalanceRef = useRef<number | undefined>(watchNewBalanceInput)
  const isInitializedRef = useRef(false)

  // Initialize on first mount when switching to Yields
  useEffect(() => {
    if (isYieldsType && !isInitializedRef.current) {
      const currentNewBalanceInput = form.getValues("newBalanceInput")
      if (currentNewBalanceInput === undefined) {
        // Set initial new balance from current balance + amount
        const initialNewBalance = convertToMajor(currentBalanceMinor + convertToMinor(watchAmount))
        form.setValue("newBalanceInput", initialNewBalance, { shouldValidate: false })
        lastNewBalanceRef.current = initialNewBalance
      }
      isInitializedRef.current = true
    }

    if (!isYieldsType) {
      // Reset when switching away from Yields
      form.setValue("newBalanceInput", undefined, { shouldValidate: false })
      isInitializedRef.current = false
    }
  }, [isYieldsType, form, watchAmount, currentBalanceMinor])

  // Sync: New Balance changed → update Amount
  useEffect(() => {
    if (!isYieldsType) return

    const newBalanceChanged = watchNewBalanceInput !== lastNewBalanceRef.current

    if (newBalanceChanged && watchNewBalanceInput !== undefined) {
      const newBalanceMinor = convertToMinor(watchNewBalanceInput)
      const calculatedAmount = convertToMajor(newBalanceMinor - currentBalanceMinor)

      if (calculatedAmount !== watchAmount) {
        form.setValue("amount", calculatedAmount, { shouldValidate: false })
        lastAmountRef.current = calculatedAmount
      }
    }

    lastNewBalanceRef.current = watchNewBalanceInput
  }, [isYieldsType, watchNewBalanceInput, currentBalanceMinor, watchAmount, form])

  // Sync: Amount changed → update New Balance
  useEffect(() => {
    if (!isYieldsType) return

    const amountChanged = watchAmount !== lastAmountRef.current

    if (amountChanged) {
      const newBalanceMinor = currentBalanceMinor + convertToMinor(watchAmount)
      const newBalance = convertToMajor(newBalanceMinor)

      if (newBalance !== watchNewBalanceInput) {
        form.setValue("newBalanceInput", newBalance, { shouldValidate: false })
        lastNewBalanceRef.current = newBalance
      }
    }

    lastAmountRef.current = watchAmount
  }, [isYieldsType, watchAmount, currentBalanceMinor, watchNewBalanceInput, form])
}

