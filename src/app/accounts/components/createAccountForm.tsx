import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIsMutating } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useCreateAccount } from '@/services/accounts/mutations'
import { convertToMinor } from '@/utils/conversions'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { useTranslation } from 'react-i18next'

interface CreateAccountFormProps {
  onClose: () => void
}

const accountSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  label: z.string().min(1, "Account name is required"),
  initialBalance: z.number().multipleOf(0.01, "Inform a valid initial balance or leave it empty").nullable(),
})

const CreateAccountForm = ({ onClose }: CreateAccountFormProps) => {
  const { mutateAsync: createAccount } = useCreateAccount()
  const isMutating = useIsMutating({ mutationKey: ['createAccount'] }) > 0
  const { t } = useTranslation('accounts')

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      institution: "",
      label: "",
      initialBalance: null,
    },
  })

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    const initialBalanceMinor =
      values.initialBalance !== null ? convertToMinor(values.initialBalance) : undefined

    await createAccount({
      institution: values.institution,
      label: values.label,
      initialBalanceMinor,
    }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createForm.fields.institution')}</FormLabel>
              <FormControl>
                <Input placeholder={t('createForm.fields.institutionPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createForm.fields.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('createForm.fields.namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="initialBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createForm.fields.balance')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createForm.fields.balancePlaceholder')}
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isMutating} className='w-full'>
          {isMutating ? <Spinner /> : t('createForm.submit')}
        </Button>
      </form>
    </Form>
  )
}

export default CreateAccountForm
