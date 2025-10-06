'use client'

import { SessionProvider } from "next-auth/react"
import ReactQueryProvider from "./reactQueryProvider"
import { AppDateProvider } from "./appDateProvider"
import { LanguageProvider } from "@/contexts/languageContext"
import { CurrencyProvider } from "@/contexts/currencyProvider"
import { CurrentAccountProvider } from "@/contexts/currentAccountContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <ReactQueryProvider>
            <CurrentAccountProvider>
              <AppDateProvider>
                {children}
              </AppDateProvider>
            </CurrentAccountProvider>
          </ReactQueryProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </SessionProvider>
  )
}
