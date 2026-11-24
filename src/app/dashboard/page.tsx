import Link from "next/link"
import {
  FileSpreadsheet,
  FileSignature,
  Handshake,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  TrendingUp,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCompanyFinancialOverview } from "@/actions/expenses"
import { requireUser, getUserCompany } from "@/lib/auth/utils"
import { formatMoney } from "@/lib/utils"
import { getUserDocumentUsage } from "@/lib/subscriptions/limits"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Executive Dashboard | Times Works",
  description: "Company Financial Overview, Ledger, Invoices, and Business Analytics.",
}

export default async function DashboardPage() {
  const user = await requireUser()
  const [company, financialData, quota] = await Promise.all([
    getUserCompany(),
    getCompanyFinancialOverview(),
    getUserDocumentUsage(user.id),
  ])

  const { summary, currency, recentInvoices, recentExpenses, categoryTotals } = financialData

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {user.name || "Business Leader"}
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
              {company.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enterprise Financial Hub: Real-time company accounting, invoices, profit & loss, and document workflows.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/invoices/new">
            <Button size="sm" className="h-8.5 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Invoice
            </Button>
          </Link>
          <Link href="/dashboard/expenses">
            <Button size="sm" variant="outline" className="h-8.5 text-xs border-border/80 shadow-2xs hover:bg-muted font-medium">
              <Receipt className="h-3.5 w-3.5 mr-1 text-amber-500" />
              Record Expense
            </Button>
          </Link>
          <Link href="/dashboard/quotations/new">
            <Button size="sm" variant="outline" className="h-8.5 text-xs border-border/80 shadow-2xs hover:bg-muted font-medium">
              <FileSignature className="h-3.5 w-3.5 mr-1 text-indigo-500" />
              Quotation
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button size="sm" variant="outline" className="h-8.5 text-xs border-border/80 shadow-2xs hover:bg-muted font-medium">
              <BarChart3 className="h-3.5 w-3.5 mr-1 text-[#c82020]" />
              Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Subscription & PDF Generation Quota Status Banner */}
      <div className="rounded-lg border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
              quota.isUnlimited
                ? "bg-[#c82020]/10 text-[#c82020]"
                : quota.canCreate
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400"
            }`}>
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  {quota.plan === "FREE" ? "Free Starter Plan" : quota.plan === "PRO" ? "Pro Business Subscription" : "Enterprise Suite"}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                  quota.isUnlimited
                    ? "bg-[#c82020]/15 text-[#c82020]"
                    : quota.canCreate
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                }`}>
                  {quota.isUnlimited ? "Unlimited PDFs" : `${quota.remaining} of 20 Left`}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {quota.isUnlimited ? (
                  "Your active subscription grants unlimited PDF document generation across Invoices, Quotations, and Agreements."
                ) : quota.canCreate ? (
                  `You have generated ${quota.totalDocuments} of ${quota.limit} PDF documents allowed on the Free tier (${quota.counts.invoices} invoices, ${quota.counts.quotations} quotes, ${quota.counts.agreements} agreements).`
                ) : (
                  `Free quota limit reached (20/20 documents used). Upgrade to Pro to continue creating invoices, quotes, and contracts.`
                )}
              </p>
            </div>
          </div>

          {!quota.isUnlimited && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Link href="/#pricing">
                <Button size="sm" className="h-8 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white font-semibold">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}
        </div>

        {!quota.isUnlimited && (
          <div className="mt-3 pt-3 border-t border-border/60">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
              <span>Usage Progress</span>
              <span className="font-mono font-medium text-foreground">{quota.totalDocuments} / {quota.limit} Documents</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  quota.totalDocuments >= 20 ? "bg-red-500" : quota.totalDocuments >= 15 ? "bg-amber-500" : "bg-[#c82020]"
                }`}
                style={{ width: `${Math.min(100, Math.round((quota.totalDocuments / quota.limit) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Primary Financial Metric Cards (Microsoft Fluent 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected Revenue */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Inflow (Paid)
            </span>
            <div className="h-7 w-7 rounded-md bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatMoney(summary.totalCollected, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>{summary.invoiceCount} invoices issued</span>
              <span className="text-emerald-600 font-semibold">Active Inflow</span>
            </p>
          </CardContent>
        </Card>

        {/* Company Expenses */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Outflow (Expenses)
            </span>
            <div className="h-7 w-7 rounded-md bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              {formatMoney(summary.totalExpenses, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>{summary.expenseCount} expenses recorded</span>
              <span className="text-rose-600 font-semibold">Operational Costs</span>
            </p>
          </CardContent>
        </Card>

        {/* Net Profit & Margin */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Net Profit / Margin
            </span>
            <div
              className={`h-7 w-7 rounded-md flex items-center justify-center ${
                summary.netProfit >= 0
                  ? "bg-rose-50 text-[#c82020] dark:bg-rose-950/50"
                  : "bg-red-50 text-red-600 dark:bg-red-950/50"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div
              className={`text-2xl font-bold font-mono tracking-tight ${
                summary.netProfit >= 0
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
              }`}
            >
              {formatMoney(summary.netProfit, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>Operating Margin</span>
              <span className="font-bold text-foreground">{summary.profitMargin}%</span>
            </p>
          </CardContent>
        </Card>

        {/* Outstanding Receivables */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Receivables
            </span>
            <div className="h-7 w-7 rounded-md bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatMoney(summary.pendingReceivables, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>Unpaid client invoices</span>
              <span className="text-amber-600 font-semibold">Action Due</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health & Cashflow Visual Overview */}
      <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] bg-card">
        <CardHeader className="py-3 px-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company Cash Flow Balance
              </CardTitle>
            </div>
            <Link
              href="/dashboard/expenses"
              className="text-xs text-[#c82020] hover:underline font-semibold flex items-center gap-1"
            >
              Open Full Ledger <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-600 dark:text-emerald-400">Revenue Inflow: {formatMoney(summary.totalCollected, currency)}</span>
              <span className="text-rose-600 dark:text-rose-400">Expenses Outflow: {formatMoney(summary.totalExpenses, currency)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{
                  width: `${
                    summary.totalCollected + summary.totalExpenses > 0
                      ? (summary.totalCollected / (summary.totalCollected + summary.totalExpenses)) * 100
                      : 50
                  }%`,
                }}
              />
              <div
                className="bg-rose-500 h-full transition-all"
                style={{
                  width: `${
                    summary.totalCollected + summary.totalExpenses > 0
                      ? (summary.totalExpenses / (summary.totalCollected + summary.totalExpenses)) * 100
                      : 50
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Split View: Recent Invoices & Recent Company Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Invoices Card */}
        <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-[#c82020]" />
                Recent Invoices
              </CardTitle>
              <CardDescription className="text-[11px]">Latest client billing and payment status</CardDescription>
            </div>
            <Link
              href="/dashboard/invoices"
              className="text-xs font-semibold text-[#c82020] hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentInvoices.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No invoices created yet. Click "New Invoice" to create one.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentInvoices.map((inv: any) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between py-2.5 px-4 hover:bg-muted/30 transition-colors text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{inv.invoiceNumber}</p>
                      <p className="text-[11px] text-muted-foreground">{inv.client?.name || "Client"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-foreground">
                        {formatMoney(inv.total, inv.currency || currency)}
                      </p>
                      <span
                        className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          inv.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : inv.status === "OVERDUE"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Company Expenses Card */}
        <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-amber-500" />
                Recent Company Expenses
              </CardTitle>
              <CardDescription className="text-[11px]">Latest operating costs and bills</CardDescription>
            </div>
            <Link
              href="/dashboard/expenses"
              className="text-xs font-semibold text-[#c82020] hover:underline"
            >
              View ledger
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentExpenses.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No company expenses recorded yet. Click "Record Expense" to add.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentExpenses.map((exp: any) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between py-2.5 px-4 hover:bg-muted/30 transition-colors text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{exp.title}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">
                        {exp.category.toLowerCase()} • {new Date(exp.expenseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-rose-600 dark:text-rose-400">
                        - {formatMoney(exp.amount, exp.currency || currency)}
                      </p>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {exp.paymentMethod?.replace(/_/g, " ").toLowerCase() || "Bank"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Super Admin Center Quick Banner */}
      <Card className="border-2 border-[#c82020]/20 bg-linear-to-r from-rose-50/50 via-background to-purple-50/50 dark:from-rose-950/20 dark:to-purple-950/20 p-4 rounded-lg shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#c82020] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Times Works Admin Governance Portal
              </p>
              <p className="text-xs text-muted-foreground">
                Super Admin governance: view premium users, upgrade accounts to Pro/Enterprise, and monitor platform health.
              </p>
            </div>
          </div>
          <Link href="/dashboard/admin" className="shrink-0">
            <Button size="sm" className="h-8.5 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white font-semibold">
              Open Admin Center
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
