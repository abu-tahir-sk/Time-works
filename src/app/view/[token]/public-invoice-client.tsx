"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import {
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building2,
  CreditCard,
  Copy,
  Check,
  Sparkles,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatMoney } from "@/lib/utils"

interface PublicInvoiceClientProps {
  invoice: any
  company: any
  client: any
}

export function PublicInvoiceClient({ invoice, company, client }: PublicInvoiceClientProps) {
  const [copiedBank, setCopiedBank] = useState(false)
  const isPaid = invoice.status === "PAID"
  const isOverdue = invoice.status === "OVERDUE"
  const currency = invoice.currency || "USD"

  const handlePrint = () => {
    window.print()
  }

  const handleCopyBankDetails = () => {
    const text = `Pay to: ${company.accountName || company.name}\nBank: ${company.bankName || "Business Bank"}\nAccount: ${company.accountNumber || "N/A"}\nRouting/IFSC: ${company.ifsc || "N/A"}\nReference: ${invoice.invoiceNumber}`
    navigator.clipboard.writeText(text)
    setCopiedBank(true)
    toast.success("Bank remittance details copied to clipboard")
    setTimeout(() => setCopiedBank(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] dark:bg-[#121212] text-foreground font-sans select-none flex flex-col">
      {/* Top Client Portal Bar (Matching Wave / Stripe Invoicing) */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#c82020] to-[#e11d48] text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">{company.name || "Times Works"}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Lock className="w-2.5 h-2.5" /> Verified Document
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {isPaid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              PAID IN FULL
            </span>
          ) : isOverdue ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              OVERDUE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              AWAITING PAYMENT
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8.5 px-3 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Print / PDF
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Responsive Paper Document (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#181a20] rounded-2xl shadow-xl border border-border/70 p-6 sm:p-10 space-y-8 print:p-0 print:border-none print:shadow-none print:rounded-none">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-border/60 pb-8">
              <div className="flex items-center gap-3.5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#c82020] to-[#e11d48] text-white shadow-sm ring-1 ring-white/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
                    {company.name || "Times Works"}
                  </h2>
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                    Professional Services & Invoicing
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-0.5">
                <span className="font-serif text-3xl sm:text-4xl font-normal tracking-wide text-foreground">
                  INVOICE
                </span>
                <div className="text-xs font-bold font-mono text-[#c82020] tracking-wider">
                  {invoice.invoiceNumber}
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">FROM</span>
                <div className="font-semibold text-foreground text-xs leading-snug">{company.name}</div>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[11px]">{company.address}</div>
                {company.email && <div className="text-[#c82020] text-[11px] font-medium pt-0.5">{company.email}</div>}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">BILL TO</span>
                <div className="font-semibold text-foreground text-xs leading-snug">{client.name}</div>
                {client.clientCompany && <div className="text-muted-foreground text-[11px] font-medium">{client.clientCompany}</div>}
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[11px]">{client.address || "Client Address"}</div>
                {client.email && <div className="text-muted-foreground text-[11px] pt-0.5">{client.email}</div>}
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">ISSUED</span>
                  <span className="font-medium text-foreground text-xs">{format(new Date(invoice.issueDate), "MMM dd, yyyy")}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">DUE</span>
                  <span className="font-semibold text-foreground text-xs">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
                  <span className="text-[10px] text-muted-foreground block">{invoice.paymentTerms || "NET 15 days"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">P.O. NUMBER</span>
                  <span className="font-mono text-foreground text-xs font-medium">PO-{invoice.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">STATUS</span>
                  <span className="text-xs font-bold text-[#c82020]">{invoice.status}</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto w-full border border-border/60 rounded-xl shadow-2xs">
              <table className="w-full min-w-[500px] text-left text-xs">
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
                    <tr key={idx} className="hover:bg-muted/15 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-foreground">{item.description}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-muted-foreground">{item.quantity} {item.unit || ""}</td>
                      <td className="py-3.5 px-3 text-right font-mono text-muted-foreground">{formatMoney(item.unitPrice, currency)}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                        {formatMoney(Number(item.quantity || 0) * Number(item.unitPrice || 0), currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal and Total */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
              <div className="sm:max-w-xs space-y-2">
                {invoice.notes && (
                  <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-3 rounded-xl border border-border/50">
                    <span className="font-semibold text-foreground block text-[10px] uppercase tracking-wider mb-1">Notes</span>
                    {invoice.notes}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Times Works Anti-Fraud Certified</span>
                </div>
              </div>

              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40 text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-foreground">{formatMoney(invoice.subtotal, currency)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between py-1 border-b border-border/40 text-emerald-600">
                    <span>Discount</span>
                    <span className="font-mono font-medium">-{formatMoney(invoice.discountAmount, currency)}</span>
                  </div>
                )}
                {invoice.taxTotal > 0 && (
                  <div className="flex justify-between py-1 border-b border-border/40 text-muted-foreground">
                    <span>Tax</span>
                    <span className="font-mono font-medium text-foreground">+{formatMoney(invoice.taxTotal, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-base font-extrabold text-foreground border-t-2 border-foreground">
                  <span>TOTAL DUE</span>
                  <span className="font-mono text-[#c82020]">{formatMoney(invoice.total, currency)}</span>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            {invoice.terms && (
              <div className="border-t border-border/60 pt-6 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Payment Instructions & Terms
                </span>
                <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                  {invoice.terms}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Payment Remittance Box (4 cols) print:hidden */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            {/* Payment Remittance Card */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/70 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#c82020]" />
                  <h3 className="text-sm font-bold text-foreground">Payment Remittance</h3>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Direct Settlement
                </span>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Beneficiary Name</span>
                  <span className="font-semibold text-foreground">{company.accountName || company.name}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Bank Name</span>
                  <span className="font-medium text-foreground">{company.bankName || "Commercial Business Bank"}</span>
                </div>
                {company.accountNumber && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Account Number</span>
                    <span className="font-mono font-medium text-foreground">{company.accountNumber}</span>
                  </div>
                )}
                {company.ifsc && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Routing / Swift / IFSC</span>
                    <span className="font-mono font-medium text-foreground">{company.ifsc}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground pt-1 border-t border-border/40">
                  <span>Payment Reference</span>
                  <span className="font-mono font-bold text-[#c82020]">{invoice.invoiceNumber}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyBankDetails}
                className="w-full h-9 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted"
              >
                {copiedBank ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 stroke-[3]" />
                    <span>Details Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    <span>Copy Remittance Details</span>
                  </>
                )}
              </Button>

              <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Transactions are verified by Times Works Security.</span>
                </p>
                <p>For questions or remittance slips, email: <strong className="text-foreground">{company.email || "billing@timesworks.com"}</strong></p>
              </div>
            </div>

            {/* Document Lifecycle Card */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/70 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Document Timeline
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Invoice Issued</span>
                    <p className="text-[10px] text-muted-foreground">{format(new Date(invoice.issueDate), "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Sent to Client Portal</span>
                    <p className="text-[10px] text-muted-foreground">Delivered via Times Works Secure Link</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {isPaid ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Payment Due</span>
                    <p className="text-[10px] text-muted-foreground">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}
