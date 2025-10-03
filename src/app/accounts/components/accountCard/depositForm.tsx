"use client"

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIsMutating } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogClose } from '@/components/ui/dialog'
import { useCreateLedgerEntry } from '@/services/ledger/mutations'
import { useIncreaseTypes } from '@/services/increase-types/queries'
import { convertToMinor, formatCurrency } from '@/utils/conversions'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { useMemo } from 'react'

interface DepositFormProps {
  accountId: string
  currentBalanceMinor: number
  toggleDialog: () => void
}

const depositSchema = z.object({
  amount: z.number().positive("Amount must be positive").multipleOf(0.01, "Amount must have at most 2 decimal places"),
  increaseTypeId: z.string().min(1, "Please select a deposit type"),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
})

const DepositForm = ({ accountId, currentBalanceMinor, toggleDialog }: DepositFormProps) => {
  const { mutateAsync: createLedgerEntry } = useCreateLedgerEntry()
  const { data: increaseTypes, isLoading: isLoadingIncreaseTypes } = useIncreaseTypes()
  const isMutating = useIsMutating({ mutationKey: ['createLedgerEntry'] }) > 0

  const form = useForm<z.infer<typeof depositSchema>>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
      increaseTypeId: "",
      note: "",
    },
  })

  const watchAmount = form.watch("amount")

  const newBalance = useMemo(() => {
    const amountMinor = watchAmount ? convertToMinor(watchAmount) : 0
    return currentBalanceMinor + amountMinor
  }, [watchAmount, currentBalanceMinor])

  async function onSubmit(values: z.infer<typeof depositSchema>) {
    const amountMinor = convertToMinor(values.amount)
    const today = new Date().toISOString().split('T')[0]

    await createLedgerEntry({
      accountId,
      date: today,
      increaseTypeId: values.increaseTypeId,
      amountMinor,
      note: values.note || undefined,
    }, {
      onSuccess: () => {
        toggleDialog()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4 p-4 rounded-lg border border-border/50 bg-muted/50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <span className="text-lg font-semibold">{formatCurrency(currentBalanceMinor, "BRL")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">New Balance</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(newBalance, "BRL")}</span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deposit Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="100.00"
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="increaseTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deposit Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoadingIncreaseTypes}>
                    <SelectValue placeholder="Select a deposit type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {increaseTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add a note..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isMutating} className='w-40'>
            {isMutating ? <Spinner /> : 'Make Deposit'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default DepositForm

