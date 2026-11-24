export { cn } from "cn"

export function formatMoney(amount: number, currency = "USD"): string {
  const symbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    CAD: "CA$",
    AUD: "A$",
    SGD: "S$",
    AED: "AED ",
    BDT: "৳",
    JPY: "¥",
  }
  const symbol = symbolMap[currency] || `${currency} `
  return `${symbol}${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(date: string | Date): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

