import { getCompanyExpenses, getCompanyFinancialOverview } from "@/actions/expenses"
import { ExpensesClient } from "./expenses-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Company Accounts & Ledger | DocuFlow",
  description: "Manage business expenses, profit and loss, cashflow, and company financial accounts.",
}

export default async function ExpensesPage() {
  const [expensesRes, overviewRes] = await Promise.all([
    getCompanyExpenses(),
    getCompanyFinancialOverview(),
  ])

  return (
    <ExpensesClient
      initialExpenses={expensesRes.expenses || []}
      financialSummary={overviewRes.summary}
      categoryTotals={overviewRes.categoryTotals}
      currency={overviewRes.currency}
    />
  )
}
