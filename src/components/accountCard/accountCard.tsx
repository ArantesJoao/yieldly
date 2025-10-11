// components/accountCard.tsx
import Image from "next/image"
import * as React from "react"
import { Wallet } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/conversions"

import DepositButton from "./depositButton"
import AccountControls from "./accountControls"
import { getInstitutionLogoPath, getInstitutionColors } from "@/utils/institutionData"

export interface SimpleAccountProps {
  id: string
  label: string
  institution: string
  currentBalanceMinor: number
}

export interface AccountCardProps {
  account: SimpleAccountProps
  className?: string
  showActions?: boolean
  showControls?: boolean
  accountCount?: number
}

const AccountCard = ({ account, className, showActions = false, showControls = false, accountCount = 0 }: AccountCardProps) => {
  const { t } = useTranslation('accounts')
  const backgroundColor = getInstitutionColors(account.institution ?? "")
  const institutionLogo = getInstitutionLogoPath(account.institution ?? "")

  const isTotalCard = account.id === "total"

  return (
    <div
      className={cn(
        "flex flex-col justify-between group relative w-full overflow-hidden rounded-2xl p-5 md:hover:shadow-md md:hover:shadow-black/20 transition-all duration-200 text-linen-50",
        className
      )}
      style={{ background: isTotalCard ? "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)" : backgroundColor }}
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
          <div className="text-md/5 font-medium opacity-90">{
            isTotalCard ? t('accountCard.totalPortfolio') : t('accountCard.account')
          }</div>
          <div className="truncate text-2xl font-bold tracking-[-0.01em]">
            {isTotalCard ? t('accountCard.allAccounts') : account.label}
          </div>
          {accountCount > 1 && (
            <div className="text-sm/5 font opacity-90">{accountCount} {t('accountCard.accounts')}</div>
          )}
        </div>

        {/* Brand chip (optional, subtle) */}
        {institutionLogo && !isTotalCard && (
          <div className="h-8 w-8 shrink-0">
            <Image src={institutionLogo} alt={account.institution} width={32} height={32} />
          </div>
        )}
        {isTotalCard && (
          <div className="h-10 w-10 shrink-0 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" strokeWidth={2.5} />
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
