import { useIsMutating } from '@tanstack/react-query'
import { useCreateLedgerEntry, useSpreadYields } from '@/services/ledger/mutations'
import { convertToMinor } from '@/utils/conversions'
import { DepositFormValues } from './useDepositFormState'
import { useAppDate } from '@/app/providers/appDateProvider'

interface UseDepositSubmitProps {
  accountId: string
  toggleDialog: () => void
  isYieldsType: boolean
}

export function useDepositSubmit({ accountId, toggleDialog, isYieldsType }: UseDepositSubmitProps) {
  const { mutateAsync: createLedgerEntry } = useCreateLedgerEntry()
  const { mutateAsync: spreadYields } = useSpreadYields()
  const isCreatingEntry = useIsMutating({ mutationKey: ['createLedgerEntry'] }) > 0
  const isSpreadingYields = useIsMutating({ mutationKey: ['spreadYields'] }) > 0
  const isMutating = isCreatingEntry || isSpreadingYields
  const { getCurrentDateString } = useAppDate()

  const onSubmit = async (values: DepositFormValues) => {
    const amountMinor = convertToMinor(values.amount)
    const today = getCurrentDateString()

    if (isYieldsType && values.sinceDate) {
      // Use spread endpoint for Yields type
      await spreadYields({
        accountId,
        increaseTypeId: values.increaseTypeId,
        totalAmountMinor: amountMinor,
        startDate: values.sinceDate,
        endDate: today,
        roundingMode: "lastDayGetsRemainder",
      }, {
        onSuccess: () => {
          toggleDialog()
        }
      })
    } else {
      // Use regular ledger entry for other types
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
  }

  return {
    onSubmit,
    isMutating,
  }
}

