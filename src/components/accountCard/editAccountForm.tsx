"use client"

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIsMutating } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useUpdateAccount } from '@/services/accounts/mutations'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Account } from '@/types/api'

interface EditAccountFormProps {
  account: Account
  onClose: () => void
}

const accountSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  label: z.string().min(1, "Account name is required"),
})

const EditAccountForm = ({ account, onClose }: EditAccountFormProps) => {
  const { t } = useTranslation('accounts')
  const { mutateAsync: updateAccount } = useUpdateAccount()
  const isMutating = useIsMutating({ mutationKey: ['updateAccount'] }) > 0

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      institution: account.institution,
      label: account.label,
    },
  })

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    await updateAccount({
      id: account.id,
      data: values
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
              <FormLabel>{t('editForm.fields.institution')}</FormLabel>
              <FormControl>
                <Input placeholder={t('editForm.fields.institutionPlaceholder')} {...field} />
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
              <FormLabel>{t('editForm.fields.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('editForm.fields.namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isMutating} className='w-full'>
          {isMutating ? <Spinner /> : t('editForm.submit')}
        </Button>
      </form>
    </Form>
  )
}

export default EditAccountForm

