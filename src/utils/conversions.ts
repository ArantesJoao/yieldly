export function convertToMinor(amount: number) {
  return Math.round(amount * 100)
}

export function convertToMajor(amount: number) {
  return amount / 100
}

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

export const formatCurrencyFromMajor = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR')}`;
};

export const formatCurrencyFromMajorDetailed = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

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

import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'

export function getDateFnsLocale(locale: string = 'pt-BR') {
  return locale === 'pt-BR' ? ptBR : enUS
}

export function getLocalDateString(date: Date = new Date()): string {
  date.setHours(12, 0, 0, 0)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateShort(dateStr: string, locale: string = 'pt-BR'): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dateFnsLocale = getDateFnsLocale(locale)

  return format(date, locale === 'pt-BR' ? 'd MMM' : 'MMM d', { locale: dateFnsLocale })
}

export function formatDateLong(date: Date | undefined, locale: string = 'pt-BR'): string {
  if (!date) {
    return ""
  }

  const dateFnsLocale = getDateFnsLocale(locale)

  return format(date, locale === 'pt-BR' ? "dd 'de' MMMM 'de' yyyy" : 'MMMM dd, yyyy', {
    locale: dateFnsLocale
  })
}

export function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0]
}
