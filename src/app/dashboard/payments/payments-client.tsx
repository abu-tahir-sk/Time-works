"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Receipt,
  Building2,
  Calendar,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { formatMoney } from "@/lib/utils"
import { recordPayment, deletePayment } from "@/actions/payments"

interface PaymentsClientProps {
  initialPayments: any[]
  invoices: any[]
  company: any
}

export function PaymentsClient({ initialPayments, invoices, company }: PaymentsClientProps) {
  const router = useRouter()
  const [payments, setPayments] = useState(initialPayments)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Form states
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("")
  const [amount, setAmount] = useState<number | string>("")
  const [method, setMethod] = useState("BANK_TRANSFER")
  const [transactionId, setTransactionId] = useState("")
  const [notes, setNotes] = useState("")
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split("T")[0])

  // Calculated metrics
  const totalCollected = payments.reduce((acc, p) => acc + (p.amount || 0), 0)
  const paymentsCount = payments.length
  const averagePayment = paymentsCount > 0 ? totalCollected / paymentsCount : 0

  // Filtered payments list
  const filteredPayments = payments.filter((p) => {
    const query = search.toLowerCase()
    const matchesQuery =
      (p.transactionId && p.transactionId.toLowerCase().includes(query)) ||
      (p.method && p.method.toLowerCase().includes(query)) ||
      (p.invoice?.invoiceNumber && p.invoice.invoiceNumber.toLowerCase().includes(query)) ||
      (p.invoice?.client?.name && p.invoice.client.name.toLowerCase().includes(query)) ||
      (p.notes && p.notes.toLowerCase().includes(query))

    return matchesQuery
  })

  // Selected invoice helper
  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId)
  const balanceDue = selectedInvoice ? Math.max(0, (selectedInvoice.total || 0) - (selectedInvoice.amountPaid || 0)) : 0

  const handleInvoiceChange = (id: string) => {
    setSelectedInvoiceId(id)
    const inv = invoices.find((i) => i.id === id)
    if (inv) {
      const remaining = Math.max(0, (inv.total || 0) - (inv.amountPaid || 0))
      setAmount(remaining > 0 ? remaining : inv.total)
    }
  }

  const handleOpenRecordModal = () => {
    if (invoices.length > 0 && !selectedInvoiceId) {
      const firstUnpaid = invoices.find((i) => (i.total || 0) > (i.amountPaid || 0)) || invoices[0]
      if (firstUnpaid) {
        handleInvoiceChange(firstUnpaid.id)
      }
    }
    setIsModalOpen(true)
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoiceId) {
      toast.error("Please select an invoice")
      return
    }

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }

    startTransition(async () => {
      const res = await recordPayment({
        invoiceId: selectedInvoiceId,
        amount: numAmount,
        method,
        transactionId: transactionId.trim() || undefined,
        notes: notes.trim() || undefined,
        paidAt,
      })

      if (res.success && res.payment) {
        toast.success("Payment recorded successfully")
        setIsModalOpen(false)
        router.refresh()
      } else {
        toast.error(res.error || "Failed to record payment")
      }
    })
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this payment record? The invoice balance will be updated.")) return

    startTransition(async () => {
      const res = await deletePayment(paymentId)
      if (res.success) {
        toast.success("Payment record deleted and invoice updated")
        setPayments((prev) => prev.filter((p) => p.id !== paymentId))
        router.refresh()
      } else {
        toast.error(res.error || "Failed to delete payment")
      }
    })
  }

  const getMethodBadge = (m: string) => {
    switch (m) {
      case "UPI":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      case "CARD":
        return "bg-blue-50 text-[#0078D4] dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "CASH":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      case "CHEQUE":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
      case "BANK_TRANSFER":
      default:
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Payments & Collections</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25">
              Settlement Ledger
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time client remittance ledger: track incoming payments, partial clearances, and bank transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleOpenRecordModal}
            className="h-9 px-4 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Record Payment
          </Button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Collections
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatMoney(totalCollected, "USD")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{paymentsCount} payments logged</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg Payment
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatMoney(averagePayment, "USD")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Per transaction average</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Invoices Awaiting Pay
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Receipt className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {invoices.filter((i) => i.status !== "PAID").length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Pending client settlement</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bank Verification
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-base font-bold text-foreground truncate">
              {company.bankName || "Times Works Ledger"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Auto-reconciliation active</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by invoice #, client, reference, or method..."
            className="h-8.5 text-xs pl-8 w-full rounded-xl bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 4. Payments Table */}
      <Card className="border border-border/80 shadow-xs overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[750px]">
              <TableHeader className="bg-muted/40 border-b border-border/80">
                <TableRow className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="py-2.5 px-4">Date</TableHead>
                  <TableHead className="py-2.5 px-3">Invoice #</TableHead>
                  <TableHead className="py-2.5 px-3">Customer</TableHead>
                  <TableHead className="py-2.5 px-3">Method</TableHead>
                  <TableHead className="py-2.5 px-3">Transaction / Ref</TableHead>
                  <TableHead className="py-2.5 px-3 text-right">Amount Paid</TableHead>
                  <TableHead className="py-2.5 px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground space-y-1">
                        <CreditCard className="h-8 w-8 text-muted-foreground/30 stroke-[1.5]" />
                        <p>No payments recorded yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {format(new Date(payment.paidAt), "MMM dd, yyyy")}
                      </TableCell>

                      <TableCell className="py-3 px-3 font-bold">
                        <Link
                          href={`/dashboard/invoices/${payment.invoice?.id}`}
                          className="text-[#c82020] hover:underline flex items-center gap-1"
                        >
                          {payment.invoice?.invoiceNumber || "INV"}
                        </Link>
                      </TableCell>

                      <TableCell className="py-3 px-3 font-medium text-foreground">
                        <div>
                          <span>{payment.invoice?.client?.name || "Client"}</span>
                          {payment.invoice?.client?.clientCompany && (
                            <span className="block text-[10px] text-muted-foreground">
                              {payment.invoice.client.clientCompany}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getMethodBadge(payment.method)}`}>
                          {payment.method.replace(/_/g, " ")}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                        {payment.transactionId || "—"}
                      </TableCell>

                      <TableCell className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMoney(payment.amount, payment.invoice?.currency || "USD")}
                      </TableCell>

                      <TableCell className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePayment(payment.id)}
                          title="Delete Payment Record"
                          className="h-7 w-7 text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Record Payment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#c82020]" />
              <span>Record Client Payment</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleRecordPayment} className="space-y-4 pt-2">
            {/* Invoice Selector */}
            {invoices.length === 0 ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs space-y-2.5">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>No Invoices Available</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  You do not have any invoices in your workspace yet. Please create an invoice first to record client payments.
                </p>
                <div>
                  <Link href="/dashboard/invoices/new">
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white font-semibold rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Create New Invoice
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Select Invoice *</Label>
                <Select value={selectedInvoiceId || undefined} onValueChange={(val) => handleInvoiceChange(val || "")}>
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue placeholder="Choose an invoice..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 z-[100]">
                    {invoices.map((inv) => (
                      <SelectItem key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} — {inv.client?.name || "Client"} ({formatMoney(inv.total, inv.currency || "USD")}) {inv.status === "DRAFT" ? "• Draft" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedInvoice && (
              <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-xs space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Customer:</span>
                  <span className="font-semibold text-foreground">{selectedInvoice.client?.name}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Invoice Total:</span>
                  <span className="font-mono font-medium text-foreground">{formatMoney(selectedInvoice.total, selectedInvoice.currency || "USD")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Remaining Due:</span>
                  <span className="font-mono font-bold text-[#c82020]">{formatMoney(balanceDue, selectedInvoice.currency || "USD")}</span>
                </div>
              </div>
            )}

            {/* Amount */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Amount Received *</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-9 text-xs rounded-xl font-mono"
              />
            </div>

            {/* Method & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Payment Method</Label>
                <Select value={method} onValueChange={(val) => setMethod(val || "BANK_TRANSFER")}>
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Bank Wire / Transfer</SelectItem>
                    <SelectItem value="UPI">UPI Payment</SelectItem>
                    <SelectItem value="CARD">Credit / Debit Card</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CHEQUE">Cheque / Check</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Date Received</Label>
                <Input
                  type="date"
                  value={paidAt}
                  onChange={(e) => setPaidAt(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* Transaction Reference */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Transaction ID / Reference</Label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. UTR-987213456 / Cheque #004"
                className="h-9 text-xs rounded-xl font-mono"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Payment Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Remittance received via HDFC / Chase wire..."
                className="text-xs rounded-xl min-h-[50px]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="h-8.5 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || invoices.length === 0}
                className="h-8.5 text-xs rounded-xl bg-[#c82020] hover:bg-[#a81a1a] text-white font-semibold disabled:opacity-50"
              >
                {isPending ? "Recording..." : "Record Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
