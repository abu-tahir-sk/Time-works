import Link from "next/link"
import {
  FolderKanban,
  Users,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  TrendingUp,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Link2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCompanyFinancialOverview } from "@/actions/expenses"
import { requireUser, getUserCompany } from "@/lib/auth/utils"
import { formatMoney } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Executive Dashboard | Times Works",
  description: "Company Financial Overview, Projects, Payments, and Ledger.",
}

export default async function DashboardPage() {
  const user = await requireUser()
  const [company, financialData] = await Promise.all([
    getUserCompany(),
    getCompanyFinancialOverview(),
  ])

  const { summary, currency, recentProjects, recentPayments, recentExpenses } = financialData

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
            Enterprise Financial Hub: Real-time project tracking, client payment gateway, and office ledger.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/dashboard/projects/new">
            <Button size="sm" className="h-8.5 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Project
            </Button>
          </Link>
          <Link href="/dashboard/payments">
            <Button size="sm" variant="outline" className="h-8.5 text-xs border-border/80 shadow-2xs hover:bg-muted font-medium">
              <CreditCard className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Record Payment
            </Button>
          </Link>
          <Link href="/dashboard/expenses">
            <Button size="sm" variant="outline" className="h-8.5 text-xs border-border/80 shadow-2xs hover:bg-muted font-medium">
              <Receipt className="h-3.5 w-3.5 mr-1 text-amber-500" />
              Office Expense
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

      {/* Primary Financial Metric Cards (Microsoft Fluent 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Project Contracted Value */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Project Contracts
            </span>
            <div className="h-7 w-7 rounded-md bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FolderKanban className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatMoney(summary.totalProjectBudgets, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>{summary.projectCount} active projects</span>
              <span className="text-blue-600 font-semibold">Total Value</span>
            </p>
          </CardContent>
        </Card>

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
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatMoney(summary.totalCollected, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
              <span>{summary.paymentCount} payments received</span>
              <span className="text-emerald-600 font-semibold">Collected</span>
            </p>
          </CardContent>
        </Card>

        {/* Company Expenses */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Office Outflow (Expenses)
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
              <span className="text-rose-600 font-semibold">Domain & Ops</span>
            </p>
          </CardContent>
        </Card>

        {/* Outstanding Receivables */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Due Balance
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
              <span>Unpaid project balance</span>
              <span className="text-amber-600 font-semibold">Remaining Due</span>
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
                Company Cash Flow & Net Profit Balance
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">
                Net Profit:{" "}
                <span className={summary.netProfit >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                  {formatMoney(summary.netProfit, currency)}
                </span>
                {" "}({summary.profitMargin}%)
              </span>
              <Link
                href="/dashboard/expenses"
                className="text-xs text-[#c82020] hover:underline font-semibold flex items-center gap-1"
              >
                Open Full Ledger <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
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

      {/* Split View: Recent Projects & Recent Payments with Mandatory Remarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Projects Card */}
        <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-[#c82020]" />
                Recent Projects
              </CardTitle>
              <CardDescription className="text-[11px]">Latest client contracts, budgets, and balance</CardDescription>
            </div>
            <Link
              href="/dashboard/projects"
              className="text-xs font-semibold text-[#c82020] hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No projects created yet. Click "New Project" to add your first client project.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentProjects.map((prj: any) => {
                  const paid = prj.paidAmount || 0
                  const due = Math.max(0, prj.budget - paid)
                  const percent = prj.budget > 0 ? Math.min(100, Math.round((paid / prj.budget) * 100)) : 0

                  return (
                    <Link
                      key={prj.id}
                      href={`/dashboard/projects/${prj.id}`}
                      className="flex items-center justify-between py-3 px-4 hover:bg-muted/30 transition-colors text-xs block group"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold text-[#c82020] bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                            {prj.code}
                          </span>
                          <p className="font-semibold text-foreground truncate group-hover:text-[#c82020] transition-colors">
                            {prj.name}
                          </p>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {prj.client?.name || "Unassigned"} • {percent}% paid
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-foreground">
                          {formatMoney(prj.budget, prj.currency || currency)}
                        </p>
                        <p className={`text-[10px] font-semibold ${due > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                          {due > 0 ? `Due: ${formatMoney(due, prj.currency || currency)}` : "Fully Paid"}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Client Payments Card (Mandatory Remark) */}
        <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                Recent Payments & Remittance
              </CardTitle>
              <CardDescription className="text-[11px]">Direct collections with mandatory remark notes</CardDescription>
            </div>
            <Link
              href="/dashboard/payments"
              className="text-xs font-semibold text-[#c82020] hover:underline"
            >
              View payments
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentPayments.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No payments recorded yet. Click "Record Payment" to log remittance.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentPayments.map((pmt: any) => (
                  <div
                    key={pmt.id}
                    className="flex items-start justify-between py-2.5 px-4 hover:bg-muted/30 transition-colors text-xs"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {pmt.client?.name || "Client"}
                        </p>
                        {pmt.project && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ({pmt.project.code})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-foreground/80 italic mt-0.5 truncate max-w-xs">
                        "{pmt.remarks}"
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(pmt.paidAt).toLocaleDateString()} • {pmt.paymentMethod?.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        + {formatMoney(pmt.amount, pmt.currency || currency)}
                      </p>
                      <span className="inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Office Expenses Row */}
      <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Receipt className="h-4 w-4 text-amber-500" />
              Recent Office Expenses (Domains, Hosting & Operations)
            </CardTitle>
            <CardDescription className="text-[11px]">Track company outflows to measure net profit</CardDescription>
          </div>
          <Link
            href="/dashboard/expenses"
            className="text-xs font-semibold text-[#c82020] hover:underline"
          >
            Manage Expenses
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentExpenses.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No office expenses recorded yet. Click "Office Expense" to log bills.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
              {recentExpenses.slice(0, 3).map((exp: any) => (
                <div key={exp.id} className="p-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                      {exp.category}
                    </span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      - {formatMoney(exp.amount, exp.currency || currency)}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground text-sm pt-1">{exp.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(exp.expenseDate).toLocaleDateString()} • {exp.paymentMethod?.replace(/_/g, " ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
