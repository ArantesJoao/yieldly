import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMemo } from 'react'
import { useIncreaseTypes } from '@/services/increase-types/queries'

export const depositSchema = z.object({
  amount: z.number().positive("Amount must be positive").multipleOf(0.01, "Amount must have at most 2 decimal places"),
  increaseTypeId: z.string().min(1, "Please select a deposit type"),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
  newBalanceInput: z.number().optional(),
  sinceDate: z.string().optional(),
}).refine((data) => {
  // If increaseTypeId is for "Yields", sinceDate is required
  // We can't check the name here, so we'll validate in the component
  return true
}, {
  message: "Since date is required for Yields type",
  path: ["sinceDate"],
})

export type DepositFormValues = z.infer<typeof depositSchema>

export function useDepositFormState() {
  const { data: increaseTypes, isLoading: isLoadingIncreaseTypes } = useIncreaseTypes()

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
      increaseTypeId: "",
      note: "",
      newBalanceInput: undefined,
      sinceDate: "",
    },
  })

  const watchAmount = form.watch("amount")
  const watchIncreaseTypeId = form.watch("increaseTypeId")
  const watchNewBalanceInput = form.watch("newBalanceInput")
  const watchSinceDate = form.watch("sinceDate")

  const selectedIncreaseType = useMemo(() => {
    return increaseTypes?.find(type => type.id === watchIncreaseTypeId)
  }, [increaseTypes, watchIncreaseTypeId])

  const isYieldsType = selectedIncreaseType?.name === "Yields"

  return {
    form,
    increaseTypes,
    isLoadingIncreaseTypes,
    watchAmount,
    watchIncreaseTypeId,
    watchNewBalanceInput,
    watchSinceDate,
    selectedIncreaseType,
    isYieldsType,
  }
}

