"use client"

import React, { useState, useTransition } from "react"
import {
  Receipt,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
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

const CATEGORIES = [
  { value: "SALARIES", label: "Salaries & Payroll", color: "bg-blue-500" },
  { value: "RENT", label: "Office Rent", color: "bg-purple-500" },
  { value: "SOFTWARE", label: "Software & Cloud", color: "bg-cyan-500" },
  { value: "MARKETING", label: "Marketing & Ads", color: "bg-pink-500" },
  { value: "UTILITIES", label: "Utilities & Electricity", color: "bg-amber-500" },
  { value: "HARDWARE", label: "Hardware & Equipment", color: "bg-indigo-500" },
  { value: "TRAVEL", label: "Travel & Fuel", color: "bg-emerald-500" },
  { value: "TAX", label: "Taxes & Legal Fees", color: "bg-rose-500" },
  { value: "OPERATIONS", label: "Operations & Misc", color: "bg-slate-500" },
  { value: "OTHER", label: "Other Expenses", color: "bg-gray-500" },
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

export function ExpensesClient({
  initialExpenses,
  financialSummary,
  categoryTotals,
  currency,
}: ExpensesClientProps) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "OPERATIONS",
    amount: "",
    paymentMethod: "BANK_TRANSFER",
    expenseDate: new Date().toISOString().split("T")[0],
    notes: "",
  })

  // Filtered expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = categoryFilter === "ALL" || exp.category === categoryFilter
    return matchesSearch && matchesCategory
  })

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

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Company Accounts & Ledger
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
              General Ledger
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete business financials: Track revenue, cash flow, company expenses, and net profit margins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="h-9 text-xs border-border/80 shadow-2xs hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Export CSV
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  className="h-9 px-3.5 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs"
                />
              }
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Record Expense
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-[#c82020]" />
                  Record Business Expense
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Enter expense details to maintain accurate company profit and loss records.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-3.5 py-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Expense Title / Description *</Label>
                  <Input
                    placeholder="e.g. AWS Cloud Hosting, Team Lunch, Office Rent"
                    className="h-9 text-xs"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Amount ({currency}) *</Label>
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

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Category</Label>
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Payment Method</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(val) => setFormData({ ...formData, paymentMethod: val || "BANK_TRANSFER" })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BANK_TRANSFER" className="text-xs">Bank Transfer</SelectItem>
                        <SelectItem value="CASH" className="text-xs">Cash</SelectItem>
                        <SelectItem value="CARD" className="text-xs">Debit / Credit Card</SelectItem>
                        <SelectItem value="UPI" className="text-xs">UPI / Mobile Wallet</SelectItem>
                        <SelectItem value="OTHER" className="text-xs">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Expense Date</Label>
                    <Input
                      type="date"
                      className="h-9 text-xs"
                      value={formData.expenseDate}
                      onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Notes / Bill Reference (Optional)</Label>
                  <Textarea
                    placeholder="Invoice #, vendor name, or transaction notes..."
                    rows={2}
                    className="text-xs resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <DialogFooter className="pt-2">
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

      {/* Microsoft Fluent Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected Revenue */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Collected Revenue
            </span>
            <div className="h-7 w-7 rounded-md bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatMoney(financialSummary.totalCollected, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="font-medium text-emerald-600">
                {financialSummary.invoiceCount} invoices
              </span>{" "}
              paid & recorded
            </p>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Expenses
            </span>
            <div className="h-7 w-7 rounded-md bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              {formatMoney(financialSummary.totalExpenses, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {expenses.length} operating expenses logged
            </p>
          </CardContent>
        </Card>

        {/* Net Profit / Margin */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Net Profit / Loss
            </span>
            <div
              className={`h-7 w-7 rounded-md flex items-center justify-center ${
                financialSummary.netProfit >= 0
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
                financialSummary.netProfit >= 0
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
              }`}
            >
              {formatMoney(financialSummary.netProfit, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Net margin: <span className="font-semibold text-foreground">{financialSummary.profitMargin}%</span>
            </p>
          </CardContent>
        </Card>

        {/* Pending Receivables */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pending Receivables
            </span>
            <div className="h-7 w-7 rounded-md bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatMoney(financialSummary.pendingReceivables, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Awaiting client clearance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Cost Breakdown Widget */}
      <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <CardHeader className="py-3 px-4 border-b border-border/60">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Expenses Breakdown by Category</span>
            <span className="text-[11px] font-normal text-muted-foreground lowercase">
              total {formatMoney(financialSummary.totalExpenses, currency)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">
              No expenses recorded yet. Click "Record Expense" to start tracking company finances.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const total = categoryTotals[cat.value] || 0
                const percent =
                  financialSummary.totalExpenses > 0
                    ? Math.round((total / financialSummary.totalExpenses) * 100)
                    : 0
                return (
                  <div
                    key={cat.value}
                    className="p-3 rounded-md border border-border/70 bg-muted/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="truncate">{cat.label}</span>
                      <span className="text-[11px] text-muted-foreground">{percent}%</span>
                    </div>
                    <div className="text-sm font-bold font-mono text-foreground">
                      {formatMoney(total, currency)}
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${cat.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expenses Table Section */}
      <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <CardHeader className="py-3.5 px-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold">Transaction Ledger</CardTitle>
              <CardDescription className="text-xs">
                History of all company expenses, payroll, and operating costs.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter expenses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8.5 w-full sm:w-48 text-xs pl-8"
                />
              </div>

              <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "ALL")}>
                <SelectTrigger className="h-8.5 w-full sm:w-36 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">All Categories</SelectItem>
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
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <Receipt className="h-8 w-8 mx-auto text-muted-foreground/40 stroke-[1.5]" />
              <p>No expense entries found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Title / Item</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Notes</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-sans">
                  {filteredExpenses.map((exp) => {
                    const catObj = CATEGORIES.find((c) => c.value === exp.category)
                    return (
                      <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {exp.title}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground border border-border/70">
                            {catObj?.label || exp.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                          {new Date(exp.expenseDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">
                          <span className="capitalize">{exp.paymentMethod.replace(/_/g, " ").toLowerCase()}</span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground max-w-[180px] truncate">
                          {exp.notes || "—"}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                          - {formatMoney(exp.amount, exp.currency || currency)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(exp.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
