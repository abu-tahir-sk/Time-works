import { getFinancialAnalytics } from "@/actions/analytics"
import { FinancialAnalyticsView } from "@/components/analytics/financial-analytics-view"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Financial Analytics & Cash Flow | Times Works",
  description: "Executive Financial Dashboard: Cash Flow, Operating Margin, Receivables Aging, and Revenue Performance.",
}

export default async function FinancialAnalyticsPage() {
  const res = await getFinancialAnalytics("1Y")

  if (!res.success || !res.data) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Failed to load financial analytics. Please refresh or try again later.
      </div>
    )
  }

  return <FinancialAnalyticsView initialData={res.data} />
}
