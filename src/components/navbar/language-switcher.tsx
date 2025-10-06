"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/contexts/languageContext"
import { useTranslation } from "react-i18next"

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage()
  const { t } = useTranslation('common')

  const toggleLanguage = () => {
    const newLocale = locale === 'pt-BR' ? 'en-US' : 'pt-BR'
    setLocale(newLocale)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-card/60 hover:bg-card/80 active:scale-95 backdrop-blur-xl border border-border/50 hover:border-border transition-all duration-200 ease-out shadow-md hover:shadow-lg"
      aria-label={t('language.select')}
    >
      <Languages className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
      <span className="text-xs font-semibold text-foreground">
        {locale === 'pt-BR' ? 'PT' : 'EN'}
      </span>
    </button>
  )
}

export default LanguageSwitcher

