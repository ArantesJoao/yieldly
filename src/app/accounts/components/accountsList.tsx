"use client"

import { useAccounts } from "@/services/accounts/queries"

import { cn } from "@/lib/utils"
import AccountCard from "./accountCard"

interface AccountsListProps {
  className?: string
}

const AccountsList = ({ className }: AccountsListProps) => {
  const { data: accounts, isFetching, isError } = useAccounts()

  if (isFetching) {
    return <div>Loading...</div>
  }

  if (isError && !isFetching) {
    return <div>Error loading accounts</div>
  }

  return (
    <div className={cn("flex flex-col w-full gap-1 py-3 max-w-md md:max-w-full mx-auto", className)}>
      {accounts?.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}

export default AccountsList
