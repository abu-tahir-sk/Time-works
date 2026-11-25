"use client"

import React, { useState, useTransition, useMemo, useCallback } from "react"
import {
  Receipt,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Search,
  Trash2,
  Calendar,
  Wallet,
  Building,
  Tag,
  Download,
  CheckCircle2,
  AlertCircle,
  Printer,
  Clock,
  MoreHorizontal,
  Pencil,
  FileText,
  ShieldCheck,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createExpense, deleteExpense } from "@/actions/expenses"
import { toast } from "sonner"
import { formatMoney } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const CATEGORIES = [
  { value: "SALARIES", label: "Salaries & Payroll", color: "bg-blue-500/10 text-blue-600 border-blue-100" },
  { value: "RENT", label: "Office Rent", color: "bg-purple-500/10 text-purple-600 border-purple-100" },
  { value: "SOFTWARE", label: "Software & Cloud", color: "bg-cyan-500/10 text-cyan-600 border-cyan-100" },
  { value: "MARKETING", label: "Marketing & Ads", color: "bg-pink-500/10 text-pink-600 border-pink-100" },
  { value: "UTILITIES", label: "Utilities & Electricity", color: "bg-amber-500/10 text-amber-600 border-amber-100" },
  { value: "HARDWARE", label: "Hardware & Equipment", color: "bg-indigo-500/10 text-indigo-600 border-indigo-100" },
  { value: "TRAVEL", label: "Travel & Fuel", color: "bg-emerald-500/10 text-emerald-600 border-emerald-100" },
  { value: "TAX", label: "Taxes & Legal Fees", color: "bg-rose-500/10 text-rose-600 border-rose-100" },
  { value: "OPERATIONS", label: "Operations & Misc", color: "bg-slate-500/10 text-slate-600 border-slate-100" },
  { value: "OTHER", label: "Other Expenses", color: "bg-gray-500/10 text-gray-600 border-gray-100" },
]

const PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Debit / Credit Card" },
  { value: "UPI", label: "UPI / Mobile Wallet" },
  { value: "OTHER", label: "Other" },
]

const DATE_RANGES = [
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_30D", label: "Last 30 Days" },
  { value: "LAST_90D", label: "Last 90 Days" },
  { value: "CUSTOM", label: "Custom Range" },
]

interface ExpensesClientProps {
  initialExpenses: any[]
  financialSummary: {
    totalInvoiced: number
    totalCollected: number
    pendingReceivables: number
    totalExpenses: number
    netProfit: number
    profitMargin: number
    invoiceCount: number
    expenseCount: number
  }
  categoryTotals: Record<string, number>
  currency: string
}

function formatDateShort(date: string | Date) {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function formatDateFull(date: string | Date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function ExpensesClient({
  initialExpenses,
  financialSummary,
  categoryTotals,
  currency,
}: ExpensesClientProps) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [dateRange, setDateRange] = useState("THIS_MONTH")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "OPERATIONS",
    amount: "",
    paymentMethod: "BANK_TRANSFER",
    expenseDate: new Date().toISOString().split("T")[0],
    notes: "",
  })

  // --- Date range filtering ---
  const now = new Date()
  const getRangeDates = () => {
    const end = new Date()
    let start = new Date()
    if (dateRange === "THIS_MONTH") {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (dateRange === "LAST_30D") {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else if (dateRange === "LAST_90D") {
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    }
    return { start, end }
  }

  const { start: rangeStart, end: rangeEnd } = getRangeDates()

  // --- Filtered & paginated expenses ---
  const filteredExpenses = useMemo(() => {
    let list = expenses.filter((exp) => {
      const expDate = new Date(exp.expenseDate)
      const inRange = expDate >= rangeStart && expDate <= rangeEnd
      const matchesSearch =
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        (exp.notes && exp.notes.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = categoryFilter === "ALL" || exp.category === categoryFilter
      return inRange && matchesSearch && matchesCategory
    })
    list.sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
    return list
  }, [expenses, search, categoryFilter, dateRange, rangeStart, rangeEnd])

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / pageSize))
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // --- Stats ---
  const rangeTotal = paginatedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const rangeCount = paginatedExpenses.length

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid expense title and amount.")
      return
    }

    startTransition(async () => {
      const res = await createExpense({
        title: formData.title,
        category: formData.category,
        amount: Number(formData.amount),
        currency,
        expenseDate: formData.expenseDate,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      })

      if (res.success && res.expense) {
        toast.success("Expense recorded successfully!")
        setExpenses([res.expense, ...expenses])
        setIsDialogOpen(false)
        setCurrentPage(1)
        setFormData({
          title: "",
          category: "OPERATIONS",
          amount: "",
          paymentMethod: "BANK_TRANSFER",
          expenseDate: new Date().toISOString().split("T")[0],
          notes: "",
        })
      } else {
        toast.error(res.error || "Failed to record expense.")
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this expense entry?")) return

    startTransition(async () => {
      const res = await deleteExpense(id)
      if (res.success) {
        toast.success("Expense deleted.")
        setExpenses(expenses.filter((e) => e.id !== id))
        if (paginatedExpenses.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } else {
        toast.error(res.error || "Failed to delete expense.")
      }
    })
  }

  const exportCSV = () => {
    if (expenses.length === 0) {
      toast.error("No expenses to export.")
      return
    }

    const headers = ["Title", "Category", "Amount", "Currency", "Date", "Payment Method", "Notes"]
    const rows = expenses.map((e) => [
      `"${e.title.replace(/"/g, '""')}"`,
      e.category,
      e.amount,
      e.currency || currency,
      new Date(e.expenseDate).toLocaleDateString(),
      e.paymentMethod,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `company-expenses-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Expenses exported to CSV.")
  }

  const handlePrint = () => {
    window.print()
  }

  const catObj = (value: string) =>
    CATEGORIES.find((c) => c.value === value) || { value, label: value, color: "" }

  return (
    <div className="space-y-6 pb-20 font-sans select-none print:p-0 print:space-y-4">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Company Accounts & Ledger
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
              General Ledger
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Track company expenses, cash flow, profit margins, and transaction history.
            <span className="ml-2 text-muted-foreground/80">
              Currency: {currency}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Pills */}
          <div className="inline-flex rounded-md border border-border/80 bg-background/80 p-0.5 text-xs shadow-2xs">
            {DATE_RANGES.map((d) => {
              const active = dateRange === d.value
              return (
                <button
                  key={d.value}
                  onClick={() => {
                    setDateRange(d.value)
                    if (d.value !== "CUSTOM") {
                      setCustomStart("")
                      setCustomEnd("")
                    }
                  }}
                  disabled={dateRange === "CUSTOM" && d.value !== "CUSTOM"}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                    active
                      ? "bg-[#c82020] text-white shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {d.label}
                </button>
              )
            })}
          </div>

          {dateRange === "CUSTOM" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>From</span>
              </div>
              <Input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="h-8 text-xs w-32 border-border/80"
              />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>To</span>
              </div>
              <Input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="h-8 text-xs w-32 border-border/80"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs border-border/80 shadow-2xs hover:bg-muted font-medium print:hidden"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Print Report
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="h-8 text-xs border-border/80 shadow-2xs hover:bg-muted font-medium print:hidden"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Export CSV
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  className="h-8 px-3 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs"
                />
              }
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Record Expense
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] p-0">
              <div className="px-6 pb-4 pt-6">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-[#c82020]" />
                    Record Business Expense
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Enter expense details to maintain accurate company profit and loss records.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Expense Title / Description *</Label>
                  <Input
                    placeholder="e.g. AWS Cloud Hosting, Team Lunch, Office Rent"
                    className="h-9 text-xs"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Amount ({currency}) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="h-9 text-xs font-mono font-medium"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val || "OPERATIONS" })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="text-xs">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Payment Method</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(val) =>
                        setFormData({ ...formData, paymentMethod: val || "BANK_TRANSFER" })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((pm) => (
                          <SelectItem key={pm.value} value={pm.value} className="text-xs">
                            {pm.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Expense Date</Label>
                    <Input
                      type="date"
                      className="h-9 text-xs"
                      value={formData.expenseDate}
                      onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Notes / Bill Reference (Optional)</Label>
                  <Textarea
                    placeholder="Invoice #, vendor name, or transaction notes..."
                    rows={2}
                    className="text-xs resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-8.5 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isPending}
                    className="h-8.5 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white"
                  >
                    {isPending ? "Saving..." : "Save Expense"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 2. Financial Health Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className={`border border-border/80 bg-card rounded-lg shadow-xs ${
          financialSummary.netProfit >= 0
            ? "border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/20"
            : "border-rose-200/60 bg-rose-50/40 dark:border-rose-900/30 dark:bg-rose-950/20"
        }`}>
          <CardContent className="px-4 py-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Financial Health Score
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {Math.round(Math.max(0, Math.min(100, financialSummary.profitMargin + 50)))}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {financialSummary.netProfit >= 0 ? "Profitable" : "Deficit"}
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg opacity-90">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
          <CardContent className="px-4 py-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Current Period Spend
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                    {formatMoney(rangeTotal, currency)}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {rangeCount} entries
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
          <CardContent className="px-4 py-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Net Margin Rate
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {financialSummary.profitMargin}%
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">of revenue</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg">
                <Activity className="h-5 w-5 text-[#c82020]" />
              </div>
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, financialSummary.profitMargin + 50))}%`,
                  backgroundColor:
                    financialSummary.profitMargin >= 0 ? "#10b981" : "#ef4444",
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Collected Revenue
            </span>
            <div className="h-7 w-7 rounded-md bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatMoney(financialSummary.totalCollected, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span className="font-medium text-emerald-600">
                {financialSummary.invoiceCount} invoices
              </span>{" "}
              paid & recorded
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="h-7 w-7 rounded-md bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              {formatMoney(financialSummary.totalExpenses, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              {financialSummary.expenseCount} entries logged
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Net Profit / Loss
            </span>
            <div
              className={`h-7 w-7 rounded-md flex items-center justify-center ${
                financialSummary.netProfit >= 0
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
              }`}
            >
              {financialSummary.netProfit >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div
              className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${
                financialSummary.netProfit >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatMoney(financialSummary.netProfit, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Net margin:
              <span className="font-semibold">
                {financialSummary.profitMargin}%
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card rounded-lg shadow-xs hover:shadow-sm transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Receivables
            </span>
            <div className="h-7 w-7 rounded-md bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatMoney(financialSummary.pendingReceivables, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Awaiting client clearance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Category Breakdown */}
      <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-border/60">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Expenses Breakdown by Category</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Total {formatMoney(financialSummary.totalExpenses, currency)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {Object.keys(categoryTotals).length === 0 || financialSummary.totalExpenses === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-xs text-muted-foreground space-y-2">
              <Receipt className="h-8 w-8 text-muted-foreground/40" />
              <p>No expenses recorded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const total = categoryTotals[cat.value] || 0
                const percent =
                  financialSummary.totalExpenses > 0
                    ? Math.round((total / financialSummary.totalExpenses) * 1000) / 10
                    : 0
                return (
                  <div
                    key={cat.value}
                    className="p-3 rounded-md border border-border/70 bg-muted/20 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="truncate">{cat.label}</span>
                      <span className="text-[10px] text-muted-foreground">{percent}%</span>
                    </div>
                    <div className="text-sm font-bold font-mono text-foreground">
                      {formatMoney(total, currency)}
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${cat.color.split("/")[0]}`}
                        style={{ width: `${Math.min(100, Math.max(3, percent))}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Transaction Ledger */}
      <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
        <CardHeader className="py-3.5 px-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Transaction Ledger
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                History of all company expenses, payroll, and operating costs.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-8.5 w-full sm:w-48 text-xs pl-8"
                />
              </div>

              <Select
                value={categoryFilter}
                onValueChange={(val) => {
                  setCategoryFilter(val || "ALL")
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-8.5 w-full sm:w-40 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">
                    All Categories
                  </SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-xs">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <div className="py-14 text-center text-xs text-muted-foreground space-y-2">
              <Receipt className="h-8 w-8 mx-auto text-muted-foreground/40 stroke-[1.5]" />
              <p>No expense entries found matching your criteria.</p>
              {filteredExpenses.length === 0 && expenses.length > 0 && (
                <p className="text-[10px] text-muted-foreground">Try adjusting the date range or filters.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 border-b border-border/80 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <TableHead className="py-3 px-4">Title / Item</TableHead>
                    <TableHead className="py-3 px-3">Category</TableHead>
                    <TableHead className="py-3 px-3">Date</TableHead>
                    <TableHead className="py-3 px-3">Method</TableHead>
                    <TableHead className="py-3 px-3">Reference</TableHead>
                    <TableHead className="py-3 px-4 text-right">Amount</TableHead>
                    <TableHead className="py-3 px-3 text-center">Status</TableHead>
                    <TableHead className="py-3 px-3 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/60">
                  {paginatedExpenses.map((exp) => {
                    const c = catObj(exp.category)
                    const method = PAYMENT_METHODS.find((m) => m.value === exp.paymentMethod)
                    return (
                      <TableRow
                        key={exp.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <TableCell className="py-3.5 px-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-muted-foreground/50" />
                            <span className="truncate">{exp.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold border ${c.color}`}>
                            {c.label}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 px-3 text-muted-foreground whitespace-nowrap">
                          {formatDateShort(exp.expenseDate)}
                        </TableCell>
                        <TableCell className="py-3.5 px-3 text-muted-foreground">
                          {method?.label || exp.paymentMethod}
                        </TableCell>
                        <TableCell className="py-3.5 px-3 text-muted-foreground max-w-[160px] truncate">
                          {exp.notes || <span className="text-muted-foreground/50">—</span>}
                        </TableCell>
                        <TableCell className="py-3.5 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                          - {formatMoney(exp.amount, exp.currency || currency)}
                        </TableCell>
                        <TableCell className="py-3.5 px-3 text-center">
                          <Badge variant="secondary" className="text-[10px] px-2 py-1">
                            Paid
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:bg-[#c82020]/10 hover:text-[#c82020] rounded"
                              title="View details"
                            >
                              <Clock className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:bg-amber-50 hover:text-amber-600 rounded"
                              onClick={() => {
                                setEditingId(exp.id)
                                setFormData({
                                  title: exp.title || "",
                                  category: exp.category || "OPERATIONS",
                                  amount: String(exp.amount || ""),
                                  paymentMethod: exp.paymentMethod || "BANK_TRANSFER",
                                  expenseDate: new Date(exp.expenseDate).toISOString().split("T")[0],
                                  notes: exp.notes || "",
                                })
                                setIsDialogOpen(true)
                              }}
                              title="Edit expense"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(exp.id)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-border/60 bg-background/40 px-4 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      Showing{" "}
                      <span className="font-medium text-foreground">
                        {(currentPage - 1) * pageSize + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-foreground">
                        {Math.min(currentPage * pageSize, filteredExpenses.length)}
                      </span>{" "}
                      of <span className="font-medium text-foreground">{filteredExpenses.length}</span> entries
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="h-7 px-2 text-xs"
                      >
                        <TrendingUp className="h-3 w-3 rotate-180" />
                      </Button>
                      <span className="px-2 text-muted-foreground">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="h-7 px-2 text-xs"
                      >
                        <TrendingDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Recent Activity Feed */}
      <Card className="border border-border/80 bg-card rounded-lg shadow-xs">
        <CardHeader className="pb-3 px-4 border-b border-border/60">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {[...expenses]
            .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
            .slice(0, 5)
            .map((exp) => (
              <div key={exp.id} className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c82020]/10 text-[#c82020] shrink-0">
                  <Receipt className="h-3 w-3" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{exp.title}</span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDateFull(exp.expenseDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{catObj(exp.category).label}</span>
                    <span className="h-1 w-1 rounded-full bg-muted" />
                    <span>- {formatMoney(exp.amount, exp.currency || currency)}</span>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
