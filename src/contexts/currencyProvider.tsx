"use client"

import { useExchangeRate } from '@/services/exchange-rate/queries'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Currency = 'BRL' | 'USD'

interface CurrencyProviderType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convertBRLToUSD: (amount: number) => number
  convertUSDToBRL: (amount: number) => number
}

const CurrencyContext = createContext<CurrencyProviderType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>('BRL')

  const { data: exchangeRate, isLoading: isLoadingExchangeRate } = useExchangeRate()

  // Initialize currency from localStorage or default to BRL
  useEffect(() => {
    const savedCurrency = localStorage.getItem('yieldly-currency') as Currency
    if (savedCurrency && (savedCurrency === 'BRL' || savedCurrency === 'USD')) {
      setCurrencyState(savedCurrency)
    } else {
      // Set default currency
      setCurrencyState('BRL')
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('yieldly-currency', newCurrency)
  }

  // TODO: Improve this, if loading add skeleton to amounts, define a default FX rate etc.
  const convertBRLToUSD = (amount: number): number => {
    if (!exchangeRate || isLoadingExchangeRate) return amount
    return amount * exchangeRate
  }

  // TODO: Improve this, if loading add skeleton to amounts, define a default FX rate etc.
  const convertUSDToBRL = (amount: number): number => {
    if (!exchangeRate || isLoadingExchangeRate) return amount
    return amount / exchangeRate
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertBRLToUSD,
        convertUSDToBRL
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

