"use client"

import { useTranslation } from 'react-i18next'

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
import { formatCurrency } from '@/utils/conversions'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import {
  useDepositFormState,
  useBalanceCalculations,
  useYieldsBalanceSync,
  useDepositSubmit,
  useLastDateWithoutYields,
} from './hooks'
import { SinceDatePicker } from './sinceDatePicker'

interface DepositFormProps {
  accountId: string
  currentBalanceMinor: number
  toggleDialog: () => void
}

const DepositForm = ({ accountId, currentBalanceMinor, toggleDialog }: DepositFormProps) => {
  const {
    form,
    transactionTypes,
    isLoadingTransactionTypes,
    watchAmount,
    watchNewBalanceInput,
    isYieldsType,
  } = useDepositFormState()

  const { t } = useTranslation('accounts')
  const { t: tCommon } = useTranslation('common')

  const { newBalance } = useBalanceCalculations({
    currentBalanceMinor,
    watchAmount,
    watchNewBalanceInput,
    isYieldsType,
  })

  useYieldsBalanceSync({
    isYieldsType,
    watchAmount,
    watchNewBalanceInput,
    currentBalanceMinor,
    form,
  })

  const { lastDateWithoutYields } = useLastDateWithoutYields({
    accountId,
    isYieldsType,
    form,
  })

  const { onSubmit, isMutating } = useDepositSubmit({
    accountId,
    toggleDialog,
    isYieldsType,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4 p-4 rounded-lg border border-border/50 bg-muted/50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{t('depositForm.currentBalance')}</span>
            <span className="text-lg font-semibold">{formatCurrency(currentBalanceMinor, "BRL")}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('depositForm.newBalance')}</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(newBalance, "BRL")}</span>
          </div>
        </div>

        {isYieldsType && (
          <FormField
            control={form.control}
            name="newBalanceInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('depositForm.newBalance')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isYieldsType ? t('depositForm.yieldAmount') : t('depositForm.depositAmount')}</FormLabel>
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
          name="transactionTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('depositForm.transactionType')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoadingTransactionTypes}>
                    <SelectValue placeholder={t('depositForm.selectTransactionType')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionTypes?.filter(type => type.direction === 'inflow').map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name === 'Yields' ? tCommon('common.yields') :
                        type.name === 'Deposit' ? tCommon('common.deposit') :
                          type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isYieldsType && (
          <FormField
            control={form.control}
            name="sinceDate"
            render={({ field }) => (
              <SinceDatePicker
                value={field.value || ""}
                onChange={field.onChange}
                defaultValue={lastDateWithoutYields}
              />
            )}
          />
        )}

        {!isYieldsType && (
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('depositForm.note')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('depositForm.addNote')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isMutating} className='w-full mt-4'>
          {isMutating ? <Spinner /> : isYieldsType ? t('depositForm.spreadYields') : t('depositForm.makeDeposit')}
        </Button>
      </form>
    </Form>
  )
}

export default DepositForm

