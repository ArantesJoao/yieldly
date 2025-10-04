"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/contexts/languageContext"
import { useTranslation } from "react-i18next"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const { t } = useTranslation('common')

  const toggleLanguage = () => {
    const newLocale = locale === 'pt-BR' ? 'en-US' : 'pt-BR'
    setLocale(newLocale)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="group w-full px-6 py-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 active:scale-[0.97] backdrop-blur-xl border border-primary/40 hover:border-primary/60 transition-all duration-300 ease-out shadow-lg hover:shadow-xl overflow-hidden"
      aria-label={t('language.select')}
    >
      {/* Button shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 ease-out pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-200">
            <Languages className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground font-medium">
              {t('language.select')}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {t(`language.${locale}`)}
            </span>
          </div>
        </div>

        {/* Language indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50">
          <span className="text-xs font-bold text-primary">
            {locale === 'pt-BR' ? 'PT' : 'EN'}
          </span>
        </div>
      </div>
    </button>
  )
}

