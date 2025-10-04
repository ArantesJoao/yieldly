"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import CreateAccountForm from "./createAccountForm"
import { useTranslation } from "react-i18next"

const NewAccountButton = () => {
  const { t } = useTranslation('accounts')
  const [open, setOpen] = useState(false)

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      trigger={<Button className="w-full max-w-3xs">+ {t('createForm.title')}</Button>}
      title={t('createForm.title')}
      description={t('createForm.description')}
    >
      <CreateAccountForm onClose={() => setOpen(false)} />
    </ResponsiveModal>
  )
}

export default NewAccountButton
