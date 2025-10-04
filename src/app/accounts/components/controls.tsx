"use client"

import NewAccountButton from "./newAccountButton"
import { useAccounts } from "@/services/accounts/queries"

const Controls = () => {
  const { data: accounts } = useAccounts()
  const hasAccounts = accounts && accounts.length > 0

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-start justify-between">
      <div className="pb-3">
        <h1 className="text-2xl text-nowrap font-bold tracking-tight">My Accounts</h1>
        <p className="text-sm text-muted-foreground mt-1 w-full text-nowrap">
          Manage your accounts and investments
        </p>
      </div>
      {hasAccounts && <NewAccountButton />}
    </div>
  )
}

export default Controls
