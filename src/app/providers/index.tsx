'use client'

import { SessionProvider } from "next-auth/react"
import ReactQueryProvider from "./reactQueryProvider"
import { AppDateProvider } from "./appDateProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <AppDateProvider>
          {children}
        </AppDateProvider>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
