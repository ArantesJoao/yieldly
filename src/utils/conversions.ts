export function convertToMinor(amount: number) {
  return amount * 100
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
