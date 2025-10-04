"use client"

import * as React from "react"

interface CurrentAccountContextValue {
  currentAccountId: string | null
  setCurrentAccountId: (accountId: string | null) => void
}

const CurrentAccountContext = React.createContext<CurrentAccountContextValue | undefined>(undefined)

export const CurrentAccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAccountId, setCurrentAccountId] = React.useState<string | null>(null)

  const value = React.useMemo(
    () => ({ currentAccountId, setCurrentAccountId }),
    [currentAccountId]
  )

  return (
    <CurrentAccountContext.Provider value={value}>
      {children}
    </CurrentAccountContext.Provider>
  )
}

export const useCurrentAccount = () => {
  const context = React.useContext(CurrentAccountContext)
  if (context === undefined) {
    throw new Error("useCurrentAccount must be used within CurrentAccountProvider")
  }
  return context
}

