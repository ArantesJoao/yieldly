"use client"

import { useAccounts } from "@/services/accounts/queries"

import { cn } from "@/lib/utils"
import AccountCard from "./accountCard/accountCard"

interface AccountsListProps {
  className?: string
}

const AccountsList = ({ className }: AccountsListProps) => {
  const { data: accounts, isLoading, isError } = useAccounts()

  if (isLoading && !accounts) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading accounts</div>
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
