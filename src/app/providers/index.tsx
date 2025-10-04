'use client'

import { SessionProvider } from "next-auth/react"
import ReactQueryProvider from "./reactQueryProvider"
import { AppDateProvider } from "./appDateProvider"
import { CurrentAccountProvider } from "@/contexts/currentAccountContext"
import { LanguageProvider } from "@/contexts/languageContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ReactQueryProvider>
          <CurrentAccountProvider>
            <AppDateProvider>
              {children}
            </AppDateProvider>
          </CurrentAccountProvider>
        </ReactQueryProvider>
      </LanguageProvider>
    </SessionProvider>
  )
}
