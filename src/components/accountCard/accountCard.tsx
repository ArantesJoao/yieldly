// components/accountCard.tsx
import Image from "next/image"
import * as React from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { Account } from "@/types/api"
import { formatCurrency } from "@/utils/conversions"
import DepositButton from "./depositButton"
import AccountControls from "./accountControls"
import { getInstitutionLogoPath, getInstitutionColors } from "@/utils/institutionData"

interface AccountCardProps {
  account: Account
  className?: string
  showActions?: boolean
  showControls?: boolean
}

const AccountCard = ({ account, className, showActions = false, showControls = false }: AccountCardProps) => {
  const { t } = useTranslation('accounts')
  const backgroundColor = getInstitutionColors(account.institution ?? "")
  const institutionLogo = getInstitutionLogoPath(account.institution ?? "")

  return (
    <div
      className={cn(
        "flex flex-col justify-between group relative w-full overflow-hidden rounded-2xl p-5 hover:scale-[1.01] focus-within:scale-[1.01] text-linen-50",
        className
      )}
      style={{ backgroundColor }}
      role="button"
      tabIndex={0}
      aria-label={`Conta ${account?.label ?? ""}`}
    >
      {/* Texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.20), rgba(0,0,0,0.00) 60%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm/5 opacity-90">{t('accountCard.account')}</div>
          <div className="truncate text-xl font-semibold tracking-[-0.01em]">
            {account.label}
          </div>
        </div>

        {/* Brand chip (optional, subtle) */}
        {institutionLogo && (
          <div className="h-8 w-8 shrink-0">
            <Image src={institutionLogo} alt={account.institution} width={32} height={32} />
          </div>
        )}
      </div>

      <div className="relative flex justify-between mt-4">
        <div className="flex flex-col gap-0.5">
          <div className="text-sm/5 opacity-90">{t('accountCard.balance')}</div>
          <div className="text-2xl font-bold tabular-nums">
            {formatCurrency(account.currentBalanceMinor ?? 0, "BRL")}
          </div>
        </div>
        {showActions && (
          <DepositButton
            accountId={account.id}
            label={account.label}
            currentBalanceMinor={account.currentBalanceMinor ?? 0}
          />
        )}
        {showControls && (
          <div className="relative flex items-end z-10">
            <AccountControls account={account} />
          </div>
        )}
      </div>


    </div>
  )
}

export default AccountCard
