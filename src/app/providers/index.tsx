'use client'

import { SessionProvider } from "next-auth/react"
import ReactQueryProvider from "./reactQueryProvider"
import { AppDateProvider } from "./appDateProvider"
import { CurrentAccountProvider } from "@/contexts/currentAccountContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <CurrentAccountProvider>
          <AppDateProvider>
            {children}
          </AppDateProvider>
        </CurrentAccountProvider>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
