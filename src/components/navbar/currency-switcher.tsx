"use client"

import { DollarSign } from "lucide-react"
import { useCurrency } from "@/contexts/currencyProvider"

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency()

  const toggleLanguage = () => {
    const newLocale = currency === 'BRL' ? 'USD' : 'BRL'
    setCurrency(newLocale)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="group w-16 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-card/60 hover:bg-card/80 active:scale-95 backdrop-blur-xl border border-border/50 hover:border-border transition-all duration-200 ease-out shadow-md hover:shadow-lg"
      aria-label={`${currency === 'BRL' ? 'BRL' : 'USD'}`}
    >
      <DollarSign className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
      <span className="text-xs font-semibold text-foreground">
        {currency === 'BRL' ? 'BRL' : 'USD'}
      </span>
    </button>
  )
}

export default CurrencySwitcher

