import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMemo } from 'react'
import { useTransactionTypes } from '@/services/transaction-types/queries'

export const depositSchema = z.object({
  amount: z.number().positive("Amount must be positive").multipleOf(0.01, "Amount must have at most 2 decimal places"),
  transactionTypeId: z.string().min(1, "Please select a transaction type"),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
  newBalanceInput: z.number().optional(),
  sinceDate: z.string().optional(),
}).refine((data) => {
  // If transactionTypeId is for "Yields", sinceDate is required
  // We can't check the name here, so we'll validate in the component
  return true
}, {
  message: "Since date is required for Yields type",
  path: ["sinceDate"],
})

export type DepositFormValues = z.infer<typeof depositSchema>

export function useDepositFormState() {
  const { data: transactionTypes, isLoading: isLoadingTransactionTypes } = useTransactionTypes()

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
      transactionTypeId: "",
      note: "",
      newBalanceInput: undefined,
      sinceDate: "",
    },
  })

  const watchAmount = form.watch("amount")
  const watchTransactionTypeId = form.watch("transactionTypeId")
  const watchNewBalanceInput = form.watch("newBalanceInput")
  const watchSinceDate = form.watch("sinceDate")

  const selectedTransactionType = useMemo(() => {
    return transactionTypes?.find(type => type.id === watchTransactionTypeId)
  }, [transactionTypes, watchTransactionTypeId])

  const isYieldsType = selectedTransactionType?.name === "Yields"

  return {
    form,
    transactionTypes,
    isLoadingTransactionTypes,
    watchAmount,
    watchTransactionTypeId,
    watchNewBalanceInput,
    watchSinceDate,
    selectedTransactionType,
    isYieldsType,
  }
}

