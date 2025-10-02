"use client"

import AccountCard from "./accountCard"
import { useAccounts } from "@/services/accounts/queries"

const AccountsList = () => {
  const { data: accounts, isFetching, isError } = useAccounts()

  if (isFetching) {
    return <div>Loading...</div>
  }

  if (isError && !isFetching) {
    return <div>Error loading accounts</div>
  }

  return (
    <div className="flex flex-col gap-1 py-3 max-w-md md:max-w-full mx-auto">
      {accounts?.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}

export default AccountsList
