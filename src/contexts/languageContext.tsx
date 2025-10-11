"use client"

import '@/lib/i18n'
import { useTranslation } from 'react-i18next'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Locale = 'pt-BR' | 'en-US'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation()
  const [locale, setLocaleState] = useState<Locale>('pt-BR')

  // Initialize locale from localStorage or default to pt-BR
  useEffect(() => {
    const savedLocale = localStorage.getItem('yieldly-language') as Locale
    if (savedLocale && (savedLocale === 'pt-BR' || savedLocale === 'en-US')) {
      setLocaleState(savedLocale)
      i18n.changeLanguage(savedLocale)
    } else {
      // Set default locale
      setLocaleState('pt-BR')
      i18n.changeLanguage('pt-BR')
    }
  }, [i18n])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    i18n.changeLanguage(newLocale)
    localStorage.setItem('yieldly-language', newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

