import { getCompanyExpenses, getCompanyFinancialOverview } from "@/actions/expenses"
import { ExpensesClient } from "./expenses-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Company Accounts & Ledger | DocuFlow",
  description: "Manage business expenses, profit and loss, cashflow, and company financial accounts.",
}

export default async function ExpensesPage() {
  let expensesRes: any
  let overviewRes: any

  try {
    ;[expensesRes, overviewRes] = await Promise.all([
      getCompanyExpenses(),
      getCompanyFinancialOverview(),
    ])
  } catch (error: any) {
    // User is not authenticated — redirect to login
    if (error?.message === "Unauthorized" || error?.message === "User not found") {
      redirect("/login")
    }
    // Fallback: render empty state so the page doesn't crash
    expensesRes = { expenses: [] }
    overviewRes = {
      summary: {
        totalInvoiced: 0,
        totalCollected: 0,
        pendingReceivables: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        invoiceCount: 0,
        expenseCount: 0,
      },
      categoryTotals: {},
      currency: "INR",
    }
  }

  return (
    <ExpensesClient
      initialExpenses={expensesRes.expenses || []}
      financialSummary={overviewRes.summary}
      categoryTotals={overviewRes.categoryTotals}
      currency={overviewRes.currency}
    />
  )
}
