"use client"

import { Wallet } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAccounts } from "@/services/accounts/queries"

import { cn } from "@/lib/utils"
import AccountCard from "../../../components/accountCard/accountCard"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import NewAccountButton from "./newAccountButton"

interface AccountsListProps {
  className?: string
}

const AccountsList = ({ className }: AccountsListProps) => {
  const { data: accounts, isLoading, isError } = useAccounts()
  const { t } = useTranslation('accounts')

  if (isLoading && !accounts) {
    return <div>{t('common:common.loading')}</div>
  }

  if (isError) {
    return <div>{t('common:common.error')}</div>
  }

  if (accounts && accounts.length === 0) {
    return (
      <Empty className={cn("mx-auto max-w-md md:max-w-2xl", className)}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wallet className="size-6" />
          </EmptyMedia>
          <EmptyTitle>{t('empty.title')}</EmptyTitle>
          <EmptyDescription>
            {t('empty.description')}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <NewAccountButton />
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className={cn("flex flex-col w-full gap-1 py-3 max-w-md md:max-w-full mx-auto", className)}>
      {accounts?.map((account) => (
        <AccountCard key={account.id} account={account} showControls />
      ))}
    </div>
  )
}

export default AccountsList
