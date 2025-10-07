// ============================================================================
// Amount Conversions
// ============================================================================

export function convertToMinor(amount: number) {
  return Math.round(amount * 100)
}

export function convertToMajor(amount: number) {
  return amount / 100
}

// ============================================================================
// Currency Formatting
// ============================================================================

/**
 * Format minor currency units to display currency
 * @param minor - Amount in minor units (cents)
 * @param currency - Currency code (BRL or USD)
 */
export const formatCurrency = (minor: number, currency: "BRL" | "USD" = "BRL") => {
  const value = (minor ?? 0) / 100
  const locale = currency === "BRL" ? "pt-BR" : "en-US"
  const symbol = currency === "BRL" ? "R$" : "$"

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${symbol} ${value.toFixed(2)}`
  }
}

/**
 * Format major currency units (already in reais/dollars)
 * @param value - Amount in major units (reais/dollars)
 */
export const formatCurrencyFromMajor = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR')}`;
};

/**
 * Format major currency units with 2 decimal places
 * @param value - Amount in major units (reais/dollars)
 */
export const formatCurrencyFromMajorDetailed = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Format minor currency units in compact form (k/m suffixes)
 * @param minor - Amount in minor units (cents)
 */
export const formatCurrencyCompact = (minor: number): string => {
  const value = (minor ?? 0) / 100;

  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `R$ ${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}m`;
  } else if (value >= 1_000) {
    const thousands = value / 1_000;
    return `R$ ${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
  }
  return `R$ ${value.toFixed(0)}`;
};

// ============================================================================
// Date Formatting
// ============================================================================

import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'

/**
 * Get date-fns locale object based on locale string
 */
export function getDateFnsLocale(locale: string = 'pt-BR') {
  return locale === 'pt-BR' ? ptBR : enUS
}

/**
 * Get the current local date in YYYY-MM-DD format
 * This avoids timezone conversion issues when using toISOString()
 */
export function getLocalDateString(date: Date = new Date()): string {
  date.setHours(12, 0, 0, 0)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format date string (YYYY-MM-DD) to short format (e.g., "Jan 5" or "5 jan")
 * @param dateStr - Date string in YYYY-MM-DD format
 * @param locale - Locale string (pt-BR or en-US)
 */
export function formatDateShort(dateStr: string, locale: string = 'pt-BR'): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dateFnsLocale = getDateFnsLocale(locale)

  // Format: "5 jan" for PT-BR, "Jan 5" for en-US
  return format(date, locale === 'pt-BR' ? 'd MMM' : 'MMM d', { locale: dateFnsLocale })
}

/**
 * Format Date object to long format (e.g., "05 de janeiro de 2024" or "January 05, 2024")
 * @param date - Date object
 * @param locale - Locale string (pt-BR or en-US)
 */
export function formatDateLong(date: Date | undefined, locale: string = 'pt-BR'): string {
  if (!date) {
    return ""
  }

  const dateFnsLocale = getDateFnsLocale(locale)

  // Format: "05 de janeiro de 2024" for PT-BR, "January 05, 2024" for en-US
  return format(date, locale === 'pt-BR' ? "dd 'de' MMMM 'de' yyyy" : 'MMMM dd, yyyy', {
    locale: dateFnsLocale
  })
}

/**
 * Convert Date object to YYYY-MM-DD string
 * @param date - Date object
 */
export function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0]
}
