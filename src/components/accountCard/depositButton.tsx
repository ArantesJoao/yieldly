"use client"

import { useState } from "react"
import { BanknoteArrowUp } from "lucide-react"
import { useTranslation } from "react-i18next"

import DepositForm from "./depositForm"
import { Button } from "@/components/ui/button"
import { ResponsiveModal } from "@/components/ui/responsive-modal"

interface DepositButtonProps {
  accountId: string
  label: string
  currentBalanceMinor: number
}

export default function DepositButton({ accountId, label, currentBalanceMinor }: DepositButtonProps) {
  const { t } = useTranslation('accounts')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-white/10 border-white/20 text-linen-50 hover:bg-white/20 hover:text-white backdrop-blur-sm h-full flex flex-col gap-1"
        aria-label={`${t('accountCard.deposit')} ${label}`}
      >
        <BanknoteArrowUp className="w-4 h-4" />
        {t('accountCard.deposit')}
      </Button>

      <ResponsiveModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={`${t('accountCard.depositTo')} ${label}`}
        dialogClassName="backdrop-blur-2xl bg-background/90 border-border/50"
      >
        <DepositForm
          accountId={accountId}
          currentBalanceMinor={currentBalanceMinor}
          toggleDialog={() => setIsOpen(false)}
        />
      </ResponsiveModal>
    </>
  )
}
