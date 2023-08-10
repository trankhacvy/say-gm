export function formatNumber(number: number, locale?: string, options?: Intl.NumberFormatOptions) {
  return Intl.NumberFormat(locale, options).format(number)
}

export function formatCurrency(amount: number): string {
  return formatNumber(amount, "en-US", {
    style: "currency",
    currency: "USD",
  })
}
