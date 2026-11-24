"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import {
  ArrowLeft,
  Copy,
  Edit,
  Trash,
  Send,
  MoreVertical,
  CheckCircle2,
  Clock,
  Eye,
  Link as LinkIcon,
  Download,
  Printer,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building2,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateInvoiceStatus, deleteInvoice, duplicateInvoice } from "@/actions/invoices"
import { toast } from "sonner"
import { formatMoney } from "@/lib/utils"

interface InvoiceDetailsClientProps {
  initialInvoice: any
  company: any
  clients: any[]
}

export function InvoiceDetailsClient({ initialInvoice, company, clients }: InvoiceDetailsClientProps) {
  const router = useRouter()
  const [invoice, setInvoice] = useState(initialInvoice)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleStatusChange = async (status: string) => {
    setIsUpdatingStatus(true)
    const res = await updateInvoiceStatus(invoice.id, status)
    if (res.success) {
      setInvoice({ ...invoice, status })
      toast.success(`Invoice marked as ${status}`)
    } else {
      toast.error(res.error || "Failed to update status")
    }
    setIsUpdatingStatus(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return
    setIsDeleting(true)
    const res = await deleteInvoice(invoice.id)
    if (res.success) {
      toast.success("Invoice deleted")
      router.push("/dashboard/invoices")
    } else {
      toast.error(res.error || "Failed to delete")
      setIsDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    toast.loading("Duplicating invoice...")
    const res = await duplicateInvoice(invoice.id)
    if (res.success) {
      toast.dismiss()
      toast.success("Invoice duplicated")
      router.push(`/dashboard/invoices/${res.id}`)
    } else {
      toast.dismiss()
      toast.error(res.error || "Failed to duplicate")
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/view/${invoice.token || invoice.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Public payment link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const isPaid = invoice.status === "PAID"
  const isOverdue = invoice.status === "OVERDUE"
  const isAwaiting = !isPaid && !isOverdue

  return (
    <div className="min-h-full flex flex-col font-sans select-none space-y-6 pb-16 print:p-0">
      {/* 1. Top Breadcrumb & Global Search Bar (CherryWorks Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3 print:hidden">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground font-medium">
            Times Works
          </Link>
          <span>/</span>
          <Link href="/dashboard/invoices" className="hover:text-foreground font-medium">
            Invoices
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">{invoice.invoiceNumber}</span>
        </div>

        {/* Global Search Bar Mockup */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              readOnly
              placeholder="Search clients, projects, invoices, contractors..."
              className="w-full h-8 rounded-lg bg-muted/40 text-xs pl-8 pr-8 border border-border/60 focus:outline-none cursor-default"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1 py-0.5 rounded bg-background border border-border text-muted-foreground">
              ⌘K
            </span>
          </div>
        </div>

        {/* User Context */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/invoices")}
            className="h-8 text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Invoices
          </Button>
        </div>
      </div>

      {/* 2. Invoice Title, Status Badge & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 print:hidden">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
              Invoice {invoice.invoiceNumber}
            </h1>

            {/* Glowing Pill Status Badge */}
            {isPaid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                PAID IN FULL
              </span>
            ) : isOverdue ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                OVERDUE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                AWAITING PAYMENT
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            {invoice.client?.name} {invoice.client?.clientCompany && `• ${invoice.client.clientCompany}`} {invoice.paymentTerms && `• ${invoice.paymentTerms}`}
          </p>
        </div>

        {/* Top Right Action Buttons (CherryWorks Style) */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/invoices/${invoice.id}/edit`)}
            className="h-9 px-4 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-9 px-4 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            PDF
          </Button>

          {invoice.status !== "PAID" ? (
            <Button
              size="sm"
              onClick={() => handleStatusChange("PAID")}
              disabled={isUpdatingStatus}
              className="h-9 px-5 text-xs font-bold bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-sm transition-all cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Mark as Paid
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleCopyLink}
              className="h-9 px-5 text-xs font-bold bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-sm transition-all cursor-pointer"
            >
              <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
              Share Receipt
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-9 w-9 p-0 border-border/80" />}>
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" /> Duplicate Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <LinkIcon className="mr-2 h-4 w-4" /> Copy Public Portal URL
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600" disabled={isDeleting}>
                <Trash className="mr-2 h-4 w-4" /> Delete Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 3. Main Two-Column View (CherryWorks Paper Invoice + Side Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Beautiful Paper Invoice Document Card (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 sm:p-10 space-y-8 relative print:border-none print:shadow-none print:p-0">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-border/60 pb-8">
            {/* Left Brand Identity */}
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#c82020] to-[#e11d48] text-white shadow-sm ring-1 ring-white/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
                  {company?.name || "Times Works"}
                </h2>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  Professional Services
                </p>
              </div>
            </div>

            {/* Right Classic Serif INVOICE heading */}
            <div className="text-left sm:text-right space-y-0.5">
              <span className="font-serif text-3xl sm:text-4xl font-normal tracking-wide text-foreground">
                INVOICE
              </span>
              <div className="text-xs font-bold font-mono text-[#c82020] tracking-wider">
                {invoice.invoiceNumber}
              </div>
            </div>
          </div>

          {/* 6-Field Metadata Grid (CherryWorks Layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            {/* FROM */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                FROM
              </span>
              <div className="font-semibold text-foreground text-xs leading-snug">
                {company?.name || "Times Works"}
              </div>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[11px]">
                {company?.address || "Times Works Tower, Suite 400\nRedmond, WA 98052, USA"}
              </div>
              <div className="text-[#c82020] text-[11px] font-medium pt-0.5">
                {company?.email || "billing@timesworks.com"}
              </div>
            </div>

            {/* BILL TO */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                BILL TO
              </span>
              <div className="font-semibold text-foreground text-xs leading-snug">
                {invoice.client?.name}
              </div>
              {invoice.client?.clientCompany && (
                <div className="text-muted-foreground text-[11px] font-medium">
                  {invoice.client.clientCompany}
                </div>
              )}
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[11px]">
                {invoice.client?.address || "Client Business Address"}
              </div>
              {invoice.client?.email && (
                <div className="text-muted-foreground text-[11px] pt-0.5">
                  {invoice.client.email}
                </div>
              )}
            </div>

            {/* ISSUED & DUE */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  ISSUED
                </span>
                <span className="font-medium text-foreground text-xs">
                  {format(new Date(invoice.issueDate), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  DUE
                </span>
                <span className="font-semibold text-foreground text-xs">
                  {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {invoice.paymentTerms || "Net 30"}
                </span>
              </div>
            </div>

            {/* P.O. & PROJECT */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  P.O.
                </span>
                <span className="font-mono text-foreground text-xs font-medium">
                  {invoice.notes?.split("\n")?.[0]?.slice(0, 16) || `PO-${invoice.invoiceNumber}`}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  PROJECT
                </span>
                <span className="font-medium text-foreground text-xs leading-tight block">
                  {invoice.notes?.split("\n")?.[1] || "Client Retainer & Deliverables"}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-border/60 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-3 text-center">HOURS / QTY</th>
                  <th className="py-3 px-3 text-right">RATE</th>
                  <th className="py-3 px-4 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {invoice.items?.map((item: any, idx: number) => (
                  <tr key={item.id || idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      <div className="font-semibold text-foreground text-xs">{item.description}</div>
                      {item.unit && item.unit !== "Piece" && (
                        <span className="text-[10px] text-muted-foreground font-normal">
                          Unit: {item.unit}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-muted-foreground text-xs">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-muted-foreground text-xs">
                      {formatMoney(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground text-xs">
                      {formatMoney(item.quantity * item.unitPrice, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-muted-foreground space-y-1 max-w-sm">
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
                PAYMENT TERMS & INSTRUCTIONS
              </span>
              <p className="leading-relaxed whitespace-pre-line text-[11px]">
                {invoice.terms || company?.paymentInstructions || "Please remit wire transfer or pay securely via Stripe within the specified payment terms."}
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatMoney(invoice.subtotal || invoice.total, invoice.currency)}
                </span>
              </div>

              {invoice.discountValue > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="font-mono text-emerald-600">
                    -{formatMoney(invoice.discountValue, invoice.currency)}
                  </span>
                </div>
              )}

              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-mono text-foreground">
                    +{formatMoney(invoice.taxAmount, invoice.currency)}
                  </span>
                </div>
              )}

              <div className="border-t border-border/80 pt-2 flex justify-between items-baseline">
                <span className="font-bold text-sm text-foreground uppercase tracking-wide">
                  TOTAL DUE
                </span>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
                  {formatMoney(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Big Crimson Payment CTA Button (Matching Screenshot) */}
          <div className="pt-2 print:hidden">
            <a
              href={`/view/${invoice.token || invoice.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button className="w-full h-12 bg-[#c82020] hover:bg-[#a81a1a] text-white rounded-xl shadow-md transition-all flex flex-col items-center justify-center py-2 cursor-pointer">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                  PAY SECURELY WITH STRIPE
                </span>
                <span className="text-[10px] text-white/80 font-medium">
                  ACH • Card • Apple Pay • Google Pay
                </span>
              </Button>
            </a>
          </div>

          {/* Document Footer Note */}
          <div className="border-t border-border/60 pt-6 text-center text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Thank you for your partnership.</p>
            <p className="text-[11px]">
              Questions about this invoice? Contact {company?.email || "billing@timesworks.com"} • {company?.phone || "+1 (800) 555-0199"}
            </p>
          </div>
        </div>

        {/* Right: Side Telemetry Panels (4 Cols - Timeline & Portal) */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Card 1: Invoice Timeline */}
          <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Invoice Timeline</h3>

            <div className="space-y-4 relative pl-5 border-l-2 border-border/70 ml-2 py-1 text-xs">
              {/* Step 1: Drafted */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-[#c82020] text-white flex items-center justify-center text-[10px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <div className="font-semibold text-foreground">Drafted</div>
                <div className="text-[11px] text-muted-foreground">
                  {format(new Date(invoice.createdAt), "MMM d • h:mm a")}
                </div>
              </div>

              {/* Step 2: Sent to client */}
              <div className="relative">
                <div className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  invoice.status !== "DRAFT"
                    ? "bg-[#c82020] text-white"
                    : "border-2 border-muted-foreground/40 bg-background"
                }`}>
                  {invoice.status !== "DRAFT" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div className="font-semibold text-foreground">Sent to client</div>
                <div className="text-[11px] text-muted-foreground">
                  {invoice.status !== "DRAFT" ? "Dispatched electronically" : "Pending send"}
                </div>
              </div>

              {/* Step 3: Viewed */}
              <div className="relative">
                <div className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  invoice.status === "VIEWED" || invoice.status === "PAID"
                    ? "bg-[#c82020] text-white"
                    : "border-2 border-muted-foreground/40 bg-background"
                }`}>
                  {(invoice.status === "VIEWED" || invoice.status === "PAID") && (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  )}
                </div>
                <div className="font-semibold text-foreground">Viewed</div>
                <div className="text-[11px] text-muted-foreground">
                  {invoice.status === "VIEWED" || invoice.status === "PAID"
                    ? "Client opened payment portal"
                    : "Awaiting recipient view"}
                </div>
              </div>

              {/* Step 4: Reminder sent */}
              <div className="relative">
                <div className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  invoice.status === "OVERDUE"
                    ? "bg-[#c82020] text-white"
                    : "border-2 border-muted-foreground/40 bg-background"
                }`}>
                  {invoice.status === "OVERDUE" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div className="font-semibold text-foreground">Reminder sent</div>
                <div className="text-[11px] text-muted-foreground">
                  {invoice.status === "OVERDUE" ? "Automated reminder issued" : "Scheduled if past due"}
                </div>
              </div>

              {/* Step 5: Payment due */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 border-muted-foreground/40 bg-background" />
                <div className="font-semibold text-foreground">Payment due</div>
                <div className="text-[11px] text-muted-foreground">
                  {format(new Date(invoice.dueDate), "MMM d • Net 30")}
                </div>
              </div>

              {/* Step 6: Paid */}
              <div className="relative">
                <div className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  invoice.status === "PAID"
                    ? "bg-emerald-500 text-white"
                    : "border-2 border-muted-foreground/40 bg-background"
                }`}>
                  {invoice.status === "PAID" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div className="font-semibold text-foreground">Paid</div>
                <div className="text-[11px] text-muted-foreground">
                  {invoice.status === "PAID" ? "Settled in full" : "Awaiting settlement"}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: PAYMENT METHODS */}
          <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              PAYMENT METHODS
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex justify-between items-center">
                <span className="font-semibold text-foreground">ACH</span>
                <span className="text-[10px] text-muted-foreground font-mono">0.8%</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex justify-between items-center">
                <span className="font-semibold text-foreground">Card</span>
                <span className="text-[10px] text-muted-foreground font-mono">2.9%</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex justify-between items-center">
                <span className="font-semibold text-foreground">Apple Pay</span>
                <span className="text-[10px] text-muted-foreground font-mono">2.9%</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex justify-between items-center">
                <span className="font-semibold text-foreground">Google Pay</span>
                <span className="text-[10px] text-muted-foreground font-mono">2.9%</span>
              </div>
            </div>
          </div>

          {/* Card 3: PUBLIC CLIENT PORTAL */}
          <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              PUBLIC CLIENT PORTAL
            </span>

            <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/60 space-y-1">
              <div className="font-mono text-xs font-semibold text-[#c82020] truncate">
                pay.timesworks.com/i/{invoice.token || invoice.invoiceNumber.toLowerCase()}
              </div>
              <p className="text-[10px] text-muted-foreground">
                No login required • auto-reconciled
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="w-full h-9 text-xs font-semibold border-border/80 hover:bg-muted"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  Copy invoice link
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
