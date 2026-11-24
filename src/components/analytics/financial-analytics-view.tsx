"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  FileSpreadsheet,
  FileSignature,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  Download,
  Printer,
  Sparkles,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Plus,
  Percent,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatMoney } from "@/lib/utils"
import {
  FinancialAnalyticsData,
  AnalyticsPeriod,
  getFinancialAnalytics,
} from "@/actions/analytics"

interface FinancialAnalyticsViewProps {
  initialData: FinancialAnalyticsData
}

export function FinancialAnalyticsView({ initialData }: FinancialAnalyticsViewProps) {
  const [data, setData] = useState<FinancialAnalyticsData>(initialData)
  const [period, setPeriod] = useState<AnalyticsPeriod>(initialData.period || "1Y")
  const [isPending, startTransition] = useTransition()
  const [activeMetric, setActiveMetric] = useState<"invoiced" | "collected" | "expenses">("collected")

  const handlePeriodChange = (newPeriod: AnalyticsPeriod) => {
    setPeriod(newPeriod)
    startTransition(async () => {
      const res = await getFinancialAnalytics(newPeriod)
      if (res.success && res.data) {
        setData(res.data)
      }
    })
  }

  const { currency, kpis, monthlyTrends, expenseCategories, agingReceivables, topClients, quotationPipeline } = data

  // Find max value for monthly chart scaling
  const maxMonthlyVal = Math.max(
    ...monthlyTrends.map((m) => Math.max(m.invoiced, m.collected, m.expenses)),
    1000
  )

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 pb-12 font-sans select-none print:p-0 print:space-y-4">
      {/* 1. Executive Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Financial Analytics & Cash Flow
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0078D4]/10 text-[#0078D4] border border-[#0078D4]/20">
              {data.companyName}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enterprise Financial Intelligence: Revenue velocity, cash collections, operating expenses, and aging receivables.
          </p>
        </div>

        {/* Filter Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Pills */}
          <div className="inline-flex rounded-md border border-border/80 bg-background/80 p-0.5 text-xs shadow-2xs">
            {(["30D", "6M", "1Y", "ALL"] as AnalyticsPeriod[]).map((p) => {
              const labels: Record<AnalyticsPeriod, string> = {
                "30D": "30 Days",
                "6M": "6 Months",
                "1Y": "1 Year",
                ALL: "All Time",
              }
              const active = period === p
              return (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  disabled={isPending}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                    active
                      ? "bg-[#0078D4] text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {labels[p]}
                </button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs border-border/80 shadow-2xs hover:bg-muted font-medium print:hidden"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Print Report
          </Button>

          <Link href="/dashboard/invoices/new" className="print:hidden">
            <Button size="sm" className="h-8 text-xs bg-[#0078D4] hover:bg-[#106EBE] text-white shadow-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading Overlay */}
      {isPending && (
        <div className="flex items-center justify-center p-2 text-xs text-[#0078D4] bg-[#0078D4]/5 rounded-md border border-[#0078D4]/20">
          <RefreshCw className="h-3.5 w-3.5 animate-spin mr-2" />
          <span>Refreshing financial analytics...</span>
        </div>
      )}

      {/* 2. Primary KPI Tiles (Microsoft Fluent 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Invoiced */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Gross Invoiced
            </span>
            <div className="h-7 w-7 rounded-md bg-[#0078D4]/10 flex items-center justify-center text-[#0078D4]">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatMoney(kpis.totalInvoiced, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>{kpis.totalInvoicesCount} invoices issued</span>
              <span className="text-muted-foreground/80 font-mono">
                Avg: {formatMoney(kpis.avgInvoiceValue, currency)}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Cash Collected */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Cash Inflow (Paid)
            </span>
            <div className="h-7 w-7 rounded-md bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatMoney(kpis.totalCollected, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>{kpis.paidInvoicesCount} fully paid</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {kpis.collectionRate}% collected
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Outstanding Receivables */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Receivables
            </span>
            <div className="h-7 w-7 rounded-md bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatMoney(kpis.pendingReceivables, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>Uncollected volume</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {kpis.totalInvoiced > 0
                  ? Math.round((kpis.pendingReceivables / kpis.totalInvoiced) * 100)
                  : 0}
                % of billed
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Operating Burn */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Operating Burn
            </span>
            <div className="h-7 w-7 rounded-md bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              {formatMoney(kpis.totalExpenses, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>{expenseCategories.length} cost centers</span>
              <span className="text-rose-600 dark:text-rose-400 font-medium">Outflow</span>
            </p>
          </CardContent>
        </Card>

        {/* Net Profit & Margin */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Net Operating Profit
            </span>
            <div className="h-7 w-7 rounded-md bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div
              className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${
                kpis.netProfit >= 0
                  ? "text-foreground"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatMoney(kpis.netProfit, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>Margin: {kpis.operatingMargin}%</span>
              <span
                className={`font-semibold ${
                  kpis.netProfit >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {kpis.netProfit >= 0 ? "Profitable" : "Deficit"}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Monthly Financial Velocity Trend (Bar & Trend Overview) */}
      <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
          <div>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#0078D4]" />
              <span>Monthly Cash Inflow vs Operating Expenses</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Historical cash receipts, invoices issued, and operational outflow by calendar month.
            </CardDescription>
          </div>

          {/* Metric Selector Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-[#0078D4]" />
              <span className="text-muted-foreground">Invoiced</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span className="text-muted-foreground">Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-rose-500" />
              <span className="text-muted-foreground">Expenses</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-6">
          {monthlyTrends.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-xs text-muted-foreground">
              <BarChart3 className="h-8 w-8 text-muted-foreground/40 mb-2" />
              No financial activity recorded in this period.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Responsive Bar Grid */}
              <div className="h-64 w-full flex items-end gap-2 sm:gap-4 px-2 pt-6 border-b border-border/60">
                {monthlyTrends.map((m, idx) => {
                  const invoicedHeight = Math.max(4, Math.round((m.invoiced / maxMonthlyVal) * 100))
                  const collectedHeight = Math.max(4, Math.round((m.collected / maxMonthlyVal) * 100))
                  const expensesHeight = Math.max(4, Math.round((m.expenses / maxMonthlyVal) * 100))

                  return (
                    <div
                      key={idx}
                      className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                    >
                      {/* Hover Tooltip Card */}
                      <div className="absolute -top-28 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-popover text-popover-foreground text-[10px] p-2 rounded-md shadow-lg border border-border z-30 pointer-events-none whitespace-nowrap min-w-[130px]">
                        <span className="font-bold border-b border-border pb-1 mb-1">{m.fullLabel}</span>
                        <div className="flex justify-between text-[#0078D4]">
                          <span>Invoiced:</span>
                          <span className="font-mono font-medium">{formatMoney(m.invoiced, currency)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600">
                          <span>Collected:</span>
                          <span className="font-mono font-medium">{formatMoney(m.collected, currency)}</span>
                        </div>
                        <div className="flex justify-between text-rose-600">
                          <span>Expenses:</span>
                          <span className="font-mono font-medium">{formatMoney(m.expenses, currency)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-foreground border-t border-border pt-1 mt-1">
                          <span>Net Profit:</span>
                          <span className="font-mono">{formatMoney(m.netProfit, currency)}</span>
                        </div>
                      </div>

                      {/* Grouped Bar Columns */}
                      <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full pb-1">
                        {/* Invoiced Bar */}
                        <div
                          className="flex-1 max-w-[12px] bg-[#0078D4]/40 hover:bg-[#0078D4] rounded-t-xs transition-all"
                          style={{ height: `${m.invoiced > 0 ? invoicedHeight : 2}%` }}
                        />
                        {/* Collected Bar */}
                        <div
                          className="flex-1 max-w-[12px] bg-emerald-500/80 hover:bg-emerald-500 rounded-t-xs transition-all"
                          style={{ height: `${m.collected > 0 ? collectedHeight : 2}%` }}
                        />
                        {/* Expenses Bar */}
                        <div
                          className="flex-1 max-w-[12px] bg-rose-500/80 hover:bg-rose-500 rounded-t-xs transition-all"
                          style={{ height: `${m.expenses > 0 ? expensesHeight : 2}%` }}
                        />
                      </div>

                      {/* Month Label */}
                      <span className="text-[10px] font-semibold text-muted-foreground text-center truncate w-full mt-2 group-hover:text-foreground">
                        {m.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Bottom Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-md bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground text-[11px]">Net Margin Rate</span>
                  <div className="text-base font-bold font-mono text-foreground mt-0.5">
                    {kpis.operatingMargin}%
                  </div>
                </div>
                <div className="p-3 rounded-md bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground text-[11px]">Collection Efficiency</span>
                  <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {kpis.collectionRate}%
                  </div>
                </div>
                <div className="p-3 rounded-md bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground text-[11px]">Monthly Average Inflow</span>
                  <div className="text-base font-bold font-mono text-foreground mt-0.5">
                    {formatMoney(
                      monthlyTrends.length > 0
                        ? Math.round(kpis.totalCollected / monthlyTrends.length)
                        : 0,
                      currency
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-md bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground text-[11px]">Average Invoice Size</span>
                  <div className="text-base font-bold font-mono text-foreground mt-0.5">
                    {formatMoney(kpis.avgInvoiceValue, currency)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Second Row: Accounts Receivable Aging & Expense Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Accounts Receivable Aging Analysis */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Accounts Receivable Aging</span>
              </CardTitle>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {formatMoney(agingReceivables.totalOutstanding, currency)}
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Classification of unpaid client invoices based on payment due dates.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            {/* Visual Aging Multi-Segment Bar */}
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex shadow-2xs">
              {agingReceivables.totalOutstanding > 0 ? (
                <>
                  <div
                    title="Current (Due Soon)"
                    className="bg-emerald-500 transition-all"
                    style={{
                      width: `${(agingReceivables.current.amount / agingReceivables.totalOutstanding) * 100}%`,
                    }}
                  />
                  <div
                    title="1-30 Days Overdue"
                    className="bg-amber-400 transition-all"
                    style={{
                      width: `${(agingReceivables.overdue1_30.amount / agingReceivables.totalOutstanding) * 100}%`,
                    }}
                  />
                  <div
                    title="31-60 Days Overdue"
                    className="bg-orange-500 transition-all"
                    style={{
                      width: `${(agingReceivables.overdue31_60.amount / agingReceivables.totalOutstanding) * 100}%`,
                    }}
                  />
                  <div
                    title="60+ Days Overdue"
                    className="bg-red-500 transition-all"
                    style={{
                      width: `${(agingReceivables.overdue60_plus.amount / agingReceivables.totalOutstanding) * 100}%`,
                    }}
                  />
                </>
              ) : (
                <div className="w-full bg-emerald-500/20" />
              )}
            </div>

            {/* Aging Bracket Details Table */}
            <div className="divide-y divide-border/60 text-xs">
              {/* Bracket 1: Current */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">Current (Not Yet Due)</span>
                    <span className="text-[11px] text-muted-foreground block">
                      {agingReceivables.current.count} active invoices
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-foreground">
                    {formatMoney(agingReceivables.current.amount, currency)}
                  </span>
                  <span className="text-[10px] text-emerald-600 block">Healthy</span>
                </div>
              </div>

              {/* Bracket 2: 1-30 Days Overdue */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">1 – 30 Days Overdue</span>
                    <span className="text-[11px] text-muted-foreground block">
                      {agingReceivables.overdue1_30.count} invoices past due
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-600">
                    {formatMoney(agingReceivables.overdue1_30.amount, currency)}
                  </span>
                  <span className="text-[10px] text-amber-600 block">Follow Up Needed</span>
                </div>
              </div>

              {/* Bracket 3: 31-60 Days Overdue */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">31 – 60 Days Overdue</span>
                    <span className="text-[11px] text-muted-foreground block">
                      {agingReceivables.overdue31_60.count} invoices aging
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-orange-600">
                    {formatMoney(agingReceivables.overdue31_60.amount, currency)}
                  </span>
                  <span className="text-[10px] text-orange-600 block">Elevated Risk</span>
                </div>
              </div>

              {/* Bracket 4: 60+ Days Overdue */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">60+ Days Overdue</span>
                    <span className="text-[11px] text-muted-foreground block">
                      {agingReceivables.overdue60_plus.count} critical overdue
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-red-600">
                    {formatMoney(agingReceivables.overdue60_plus.amount, currency)}
                  </span>
                  <span className="text-[10px] text-red-600 font-bold block">Critical Action</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/dashboard/invoices?status=OVERDUE">
                <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border/80 hover:bg-muted font-medium">
                  Review Overdue Invoices
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Right: Operating Expense Breakdown by Category */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <PieChart className="h-4 w-4 text-rose-500" />
                <span>Operating Expense Breakdown</span>
              </CardTitle>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                {formatMoney(kpis.totalExpenses, currency)}
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Allocation of company expenditure across operational cost centers.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            {expenseCategories.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Receipt className="h-8 w-8 text-muted-foreground/40 mb-2" />
                No expenses recorded for this period.
                <Link href="/dashboard/expenses" className="mt-2 text-[#0078D4] hover:underline font-semibold">
                  Record an expense in Ledger
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {expenseCategories.slice(0, 6).map((cat, idx) => {
                  const colors = [
                    "bg-[#0078D4]",
                    "bg-purple-500",
                    "bg-amber-500",
                    "bg-emerald-500",
                    "bg-rose-500",
                    "bg-indigo-500",
                  ]
                  const barColor = colors[idx % colors.length]

                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground capitalize">
                            {cat.category.toLowerCase().replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-muted-foreground">({cat.count} records)</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-foreground">{formatMoney(cat.amount, currency)}</span>
                          <span className="text-[10px] text-muted-foreground w-11 text-right">
                            {cat.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor} transition-all`}
                          style={{ width: `${Math.min(100, Math.max(3, cat.percentage))}%` }}
                        />
                      </div>
                    </div>
                  )
                })}

                <div className="pt-2">
                  <Link href="/dashboard/expenses">
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border/80 hover:bg-muted font-medium">
                      Manage Company Ledger
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 5. Third Row: Client Revenue Concentration & Quotation Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Client Revenue Contribution */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-[#0078D4]" />
                <span>Client Revenue Leaderboard</span>
              </CardTitle>
              <span className="text-xs font-semibold text-muted-foreground">
                {kpis.activeClients} Active Clients
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Key enterprise accounts ranked by total billed value and cash receipts.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-1">
            {topClients.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-xs text-muted-foreground">
                <Users className="h-8 w-8 text-muted-foreground/40 mb-2" />
                No client transaction records found.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {topClients.map((client) => {
                  const shareOfRevenue =
                    kpis.totalInvoiced > 0
                      ? Math.round((client.totalInvoiced / kpis.totalInvoiced) * 100)
                      : 0

                  return (
                    <div key={client.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 max-w-[200px] sm:max-w-xs">
                        <span className="font-semibold text-foreground truncate block">
                          {client.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate block">
                          {client.companyName || client.email || "Individual Account"} • {client.invoiceCount} invoices
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-foreground">
                          {formatMoney(client.totalInvoiced, currency)}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-1.5 mt-0.5">
                          <span className="text-emerald-600 font-medium">
                            Paid: {formatMoney(client.totalPaid, currency)}
                          </span>
                          {client.outstanding > 0 && (
                            <span className="text-amber-600 font-medium">
                              • Due: {formatMoney(client.outstanding, currency)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Quotation & Proposal Pipeline */}
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileSignature className="h-4 w-4 text-indigo-500" />
                <span>Quotation Pipeline & Win Rate</span>
              </CardTitle>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {quotationPipeline.conversionRate}% Conversion
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Sales quote pipeline conversion to finalized billable client engagements.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            {/* Pipeline Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-md bg-muted/30 border border-border/60">
                <span className="text-[11px] text-muted-foreground">Total Quotes</span>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                  {quotationPipeline.totalCount}
                </div>
                <span className="text-[10px] text-muted-foreground block truncate">
                  {formatMoney(quotationPipeline.totalValue, currency)}
                </span>
              </div>

              <div className="p-3 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Accepted</span>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {quotationPipeline.acceptedCount}
                </div>
                <span className="text-[10px] text-emerald-600/80 block truncate">
                  {formatMoney(quotationPipeline.acceptedValue, currency)}
                </span>
              </div>

              <div className="p-3 rounded-md bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50">
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">In Negotiation</span>
                <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                  {quotationPipeline.pendingCount}
                </div>
                <span className="text-[10px] text-amber-600/80 block truncate">
                  {formatMoney(quotationPipeline.pendingValue, currency)}
                </span>
              </div>
            </div>

            {/* Pipeline Funnel Progress */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Proposal to Agreement Velocity</span>
                <span className="font-semibold text-foreground">{quotationPipeline.conversionRate}% Win Rate</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${Math.min(100, Math.max(3, quotationPipeline.conversionRate))}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Link href="/dashboard/quotations/new" className="flex-1">
                <Button size="sm" className="w-full text-xs h-8 bg-[#0078D4] hover:bg-[#106EBE] text-white font-semibold">
                  <Plus className="h-3 w-3 mr-1" /> Create Quotation
                </Button>
              </Link>
              <Link href="/dashboard/quotations" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border/80 hover:bg-muted font-medium">
                  View All Quotes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
