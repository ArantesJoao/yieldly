import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import commonEN from '@/locales/en-US/common.json'
import commonPT from '@/locales/pt-BR/common.json'
import dashboardEN from '@/locales/en-US/dashboard.json'
import dashboardPT from '@/locales/pt-BR/dashboard.json'
import accountsEN from '@/locales/en-US/accounts.json'
import accountsPT from '@/locales/pt-BR/accounts.json'

const resources = {
  'en-US': {
    common: commonEN,
    dashboard: dashboardEN,
    accounts: accountsEN,
  },
  'pt-BR': {
    common: commonPT,
    dashboard: dashboardPT,
    accounts: accountsPT,
  },
}

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'pt-BR', // Default language
    defaultNS: 'common', // Default namespace
    ns: ['common', 'dashboard', 'accounts'],
    
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],
      // Keys to lookup language from localStorage
      caches: ['localStorage'],
      lookupLocalStorage: 'yieldly-language',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense for easier server-side rendering
    },
  })

export default i18n

