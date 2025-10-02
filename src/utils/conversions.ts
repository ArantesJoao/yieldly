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
