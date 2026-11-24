"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  FileText,
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Copy,
  Trash,
  Download,
  FileSpreadsheet,
  ArrowDownRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Send,
  Eye,
  Check,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { duplicateInvoice, deleteInvoice, updateInvoiceStatus } from "@/actions/invoices"
import { toast } from "sonner"
import { formatMoney } from "@/lib/utils"

export function InvoiceListClient({ initialInvoices }: { initialInvoices: any[] }) {
  const router = useRouter()
  const [invoices, setInvoices] = useState(initialInvoices)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null)

  // Metrics
  const currency = invoices[0]?.currency || "USD"
  const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0)
  const totalPaid = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((acc, inv) => acc + (inv.total || 0), 0)
  const totalPending = invoices
    .filter((inv) => ["SENT", "VIEWED", "PARTIALLY_PAID"].includes(inv.status))
    .reduce((acc, inv) => acc + ((inv.total || 0) - (inv.amountPaid || 0)), 0)
  const totalOverdue = invoices
    .filter((inv) => inv.status === "OVERDUE")
    .reduce((acc, inv) => acc + ((inv.total || 0) - (inv.amountPaid || 0)), 0)

  // Tab counter breakdown (Wave style)
  const counts = {
    ALL: invoices.length,
    AWAITING: invoices.filter((i) => ["SENT", "VIEWED", "PARTIALLY_PAID"].includes(i.status)).length,
    PAID: invoices.filter((i) => i.status === "PAID").length,
    OVERDUE: invoices.filter((i) => i.status === "OVERDUE").length,
    DRAFT: invoices.filter((i) => i.status === "DRAFT").length,
  }

  // Filtering
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.client?.name.toLowerCase().includes(search.toLowerCase()) ||
      (inv.client?.clientCompany && inv.client.clientCompany.toLowerCase().includes(search.toLowerCase()))

    let matchesStatus = true
    if (statusFilter === "AWAITING") {
      matchesStatus = ["SENT", "VIEWED", "PARTIALLY_PAID"].includes(inv.status)
    } else if (statusFilter !== "ALL") {
      matchesStatus = inv.status === statusFilter
    }

    return matchesSearch && matchesStatus
  })

  const handleDuplicate = async (id: string) => {
    toast.loading("Duplicating invoice...")
    const res = await duplicateInvoice(id)
    if (res.success) {
      toast.dismiss()
      toast.success("Invoice duplicated")
      router.push(`/dashboard/invoices/${res.id}`)
    } else {
      toast.dismiss()
      toast.error(res.error || "Failed to duplicate")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return
    setIsDeleting(id)
    const res = await deleteInvoice(id)
    if (res.success) {
      setInvoices(invoices.filter((i) => i.id !== id))
      toast.success("Invoice deleted")
    } else {
      toast.error(res.error || "Failed to delete")
    }
    setIsDeleting(null)
  }

  const handleStatusChange = async (id: string, status: string) => {
    setIsUpdatingStatus(id)
    const res = await updateInvoiceStatus(id, status)
    if (res.success) {
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)))
      toast.success(`Invoice marked as ${status}`)
    } else {
      toast.error(res.error || "Failed to update status")
    }
    setIsUpdatingStatus(null)
  }

  const handleCopyLink = (tokenOrId: string) => {
    const url = `${window.location.origin}/view/${tokenOrId}`
    navigator.clipboard.writeText(url)
    toast.success("Public invoice link copied to clipboard")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
      case "SENT":
        return "bg-blue-50 text-[#0078D4] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
      case "VIEWED":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
      case "OVERDUE":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
      case "PARTIALLY_PAID":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
      case "DRAFT":
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Invoices</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25">
              Times Works Billing
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Wave & Invoice Ninja inspired billing: instant payment links, multi-currency ledger, and real-time status telemetry.
          </p>
        </div>

        <Link href="/dashboard/invoices/new">
          <Button size="sm" className="h-9 px-4 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs">
            <Plus className="mr-1.5 h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      {/* KPI Cards (Wave Financial Overview Style) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Invoiced
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatMoney(totalInvoiced, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{invoices.length} invoices generated</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Collected
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatMoney(totalPaid, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {totalInvoiced > 0 ? `${Math.round((totalPaid / totalInvoiced) * 100)}% recovery rate` : "Cleared in bank"}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Awaiting Payment
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatMoney(totalPending, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{counts.AWAITING} client receivables</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Past Due (Overdue)
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              {formatMoney(totalOverdue, currency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Requires client reminder</p>
          </CardContent>
        </Card>
      </div>

      {/* Wave-style Overdue Alert Banner if overdue items exist */}
      {counts.OVERDUE > 0 && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Action Required: {counts.OVERDUE} Overdue Invoice{counts.OVERDUE > 1 ? "s" : ""}
              </p>
              <p className="text-[11px] text-rose-700 dark:text-rose-300">
                Totaling {formatMoney(totalOverdue, currency)} past due date. Remind clients or copy public payment link.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter("OVERDUE")}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Review Overdue ({counts.OVERDUE})
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by invoice # or client..."
              className="h-8.5 text-xs pl-8 w-full rounded-xl bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Quick Status Filter Tabs with Counter Badges (Wave Style) */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 overflow-x-auto max-w-full">
            {[
              { id: "ALL", label: `All (${counts.ALL})` },
              { id: "AWAITING", label: `Unpaid (${counts.AWAITING})` },
              { id: "PAID", label: `Paid (${counts.PAID})` },
              { id: "OVERDUE", label: `Overdue (${counts.OVERDUE})` },
              { id: "DRAFT", label: `Draft (${counts.DRAFT})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-background text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <Card className="border border-border/80 shadow-xs overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[750px]">
              <TableHeader className="bg-muted/40 border-b border-border/80">
                <TableRow className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="py-2.5 px-4">Invoice #</TableHead>
                  <TableHead className="py-2.5 px-3">Client</TableHead>
                  <TableHead className="py-2.5 px-3">Issue Date</TableHead>
                  <TableHead className="py-2.5 px-3">Due Date</TableHead>
                  <TableHead className="py-2.5 px-3">Amount</TableHead>
                  <TableHead className="py-2.5 px-3">Status</TableHead>
                  <TableHead className="py-2.5 px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground space-y-1">
                        <FileSpreadsheet className="h-8 w-8 text-muted-foreground/30 stroke-[1.5]" />
                        <p>No invoices found matching your filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-3 px-4 font-bold text-foreground">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="hover:text-[#c82020] hover:underline flex items-center gap-1.5"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="py-3 px-3 font-medium text-foreground">
                        <div>
                          <span>{invoice.client?.name || "Client"}</span>
                          {invoice.client?.clientCompany && (
                            <span className="block text-[10px] text-muted-foreground">
                              {invoice.client.clientCompany}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="py-3 px-3 font-mono font-bold text-foreground">
                        {formatMoney(invoice.total, invoice.currency || currency)}
                      </TableCell>
                      <TableCell className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Quick Pay Action button (Wave inspiration) */}
                          {invoice.status !== "PAID" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(invoice.id, "PAID")}
                              disabled={isUpdatingStatus === invoice.id}
                              title="Quick Mark as Paid"
                              className="h-7 px-2 text-[11px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold"
                            >
                              <Check className="h-3 w-3 mr-1 stroke-[3]" />
                              Mark Paid
                            </Button>
                          )}

                          {/* Quick Copy Portal Link */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyLink(invoice.token || invoice.id)}
                            title="Copy Public Invoice Portal Link"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <LinkIcon className="h-3.5 w-3.5" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
                              disabled={isDeleting === invoice.id}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 text-xs">
                              <Link href={`/dashboard/invoices/${invoice.id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Eye className="mr-2 h-3.5 w-3.5 text-[#c82020]" /> View & Print
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="mr-2 h-3.5 w-3.5 text-blue-600" /> Edit Invoice
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => handleCopyLink(invoice.token || invoice.id)}
                                className="cursor-pointer"
                              >
                                <ExternalLink className="mr-2 h-3.5 w-3.5 text-indigo-600" /> Public Portal Link
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(invoice.id)} className="cursor-pointer">
                                <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/40"
                                onClick={() => handleDelete(invoice.id)}
                              >
                                <Trash className="mr-2 h-3.5 w-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
