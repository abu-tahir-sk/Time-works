"use client"

import React from "react"
import { format } from "date-fns"
import { Sparkles, ShieldCheck, CheckCircle2, Lock, Building2 } from "lucide-react"
import { formatMoney } from "@/lib/utils"

interface LivePaperCanvasProps {
  form: any
  company: any
  clients: any[]
}

export function LivePaperCanvas({ form, company, clients }: LivePaperCanvasProps) {
  const values = form.watch()
  const watchedItems = values.items || []
  const currency = values.currency || "USD"
  const discountType = values.discountType || "PERCENTAGE"
  const discountValue = Number(values.discountValue || 0)

  // Calculations
  let subtotal = 0
  let taxTotal = 0

  watchedItems.forEach((item: any) => {
    const qty = Number(item.quantity || 0)
    const rate = Number(item.unitPrice || 0)
    const taxRate = Number(item.taxRate || 0)
    const lineTotal = qty * rate
    subtotal += lineTotal
    taxTotal += lineTotal * (taxRate / 100)
  })

  let discountAmount = 0
  if (discountType === "PERCENTAGE") {
    discountAmount = subtotal * (discountValue / 100)
  } else {
    discountAmount = discountValue
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + taxTotal)

  const selectedClientId = values.clientId
  const selectedClient = clients.find((c) => c.id === selectedClientId)
  const clientName = selectedClient?.name || "Client Name"
  const clientCompany = selectedClient?.clientCompany || ""
  const clientEmail = values.clientEmail || selectedClient?.email || "billing@client.com"
  const clientAddress = values.clientAddress || selectedClient?.address || "Client Business Address\nCity, State 12345"

  const companyDetails = values.companyDetails || company || {}
  const companyName = companyDetails.name || "Times Works"
  const companyAddress = companyDetails.address || "Times Works Tower, Suite 400\nRedmond, WA 98052, USA"
  const companyEmail = companyDetails.email || "billing@timesworks.com"

  const watermark = values.designSettings?.watermark
  const isWatermarkActive = watermark && watermark.enabled !== false && watermark.mode && watermark.mode !== "NONE"

  return (
    <div className="relative w-full max-w-[850px] mx-auto bg-white dark:bg-[#181a20] rounded-2xl shadow-xl border border-border/70 p-6 sm:p-10 text-foreground overflow-hidden print:p-0 print:border-none print:shadow-none">
      
      {/* Background Watermark Layer if active */}
      {isWatermarkActive && (
        <div 
          className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center"
          style={{ opacity: watermark.opacity ?? 0.06 }}
        >
          {watermark.mode === "SINGLE_TEXT" && (
            <div 
              className="text-center font-bold tracking-widest uppercase"
              style={{
                fontSize: `${watermark.size || 72}px`,
                color: watermark.text?.color || "#0f172a",
                transform: `rotate(${watermark.rotation ?? -30}deg)`
              }}
            >
              {watermark.text?.content || companyName}
            </div>
          )}
          {watermark.mode === "TEXT_TILING" && (
            <div 
              className="w-[200%] h-[200%] flex flex-wrap gap-16 items-center justify-center -rotate-12 select-none"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <span 
                  key={i} 
                  className="font-bold tracking-wider text-xl uppercase"
                  style={{ color: watermark.text?.color || "#0f172a" }}
                >
                  {watermark.text?.content || companyName}
                </span>
              ))}
            </div>
          )}
          {watermark.mode === "SINGLE_LOGO" && (
            <img 
              src={watermark.logo?.url || companyDetails.logoUrl || "/logo-v3.jpg"} 
              alt="watermark"
              className="object-contain"
              style={{
                width: `${watermark.size || 220}px`,
                height: `${watermark.size || 220}px`,
                transform: `rotate(${watermark.rotation ?? 0}deg)`
              }}
            />
          )}
          {watermark.mode === "LOGO_TILING" && (
            <div 
              className="w-[200%] h-[200%] flex flex-wrap gap-20 items-center justify-center -rotate-12 select-none"
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <img 
                  key={i}
                  src={watermark.logo?.url || companyDetails.logoUrl || "/logo-v3.jpg"} 
                  alt="tiled-watermark"
                  className="object-contain"
                  style={{ width: "90px", height: "90px" }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Foreground Document Content */}
      <div className="relative z-10 space-y-8">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-border/60 pb-8">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#c82020] to-[#e11d48] text-white shadow-sm ring-1 ring-white/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
                {companyName}
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
              {values.invoiceNumber || "INV-2026"}
            </div>
          </div>
        </div>

        {/* 4-Column Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          {/* FROM */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              FROM
            </span>
            <div className="font-semibold text-foreground text-xs leading-snug">
              {companyName}
            </div>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[11px]">
              {companyAddress}
            </div>
            <div className="text-[#c82020] text-[11px] font-medium pt-0.5">
              {companyEmail}
            </div>
          </div>

          {/* BILL TO */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              BILL TO
            </span>
            <div className="font-semibold text-foreground text-xs leading-snug">
              {clientName}
            </div>
            {clientCompany && (
              <div className="text-muted-foreground text-[11px] font-medium">
                {clientCompany}
              </div>
            )}
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[11px]">
              {clientAddress}
            </div>
            {clientEmail && (
              <div className="text-muted-foreground text-[11px] pt-0.5">
                {clientEmail}
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
                {values.issueDate ? format(new Date(values.issueDate), "MMMM d, yyyy") : "Today"}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                DUE
              </span>
              <span className="font-semibold text-foreground text-xs">
                {values.dueDate ? format(new Date(values.dueDate), "MMMM d, yyyy") : "Due in 15 days"}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                {values.paymentTerms || "NET 15 days"}
              </span>
            </div>
          </div>

          {/* P.O. & PROJECT */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                P.O. NUMBER
              </span>
              <span className="font-mono text-foreground text-xs font-medium">
                {values.notes ? values.notes.split("\n")?.[0]?.slice(0, 16) : `PO-${values.invoiceNumber || "2026"}`}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                STATUS
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {values.status || "DRAFT"}
              </span>
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
                {taxTotal > 0 && <th className="py-3 px-3 text-right">TAX</th>}
                <th className="py-3 px-4 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {watchedItems.map((item: any, idx: number) => {
                const qty = Number(item.quantity || 0)
                const rate = Number(item.unitPrice || 0)
                const rowTotal = qty * rate
                return (
                  <tr key={idx} className="hover:bg-muted/15 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {item.description || "Service or item description"}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-muted-foreground">
                      {qty} {item.unit || ""}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-muted-foreground">
                      {formatMoney(rate, currency)}
                    </td>
                    {taxTotal > 0 && (
                      <td className="py-3.5 px-3 text-right font-mono text-muted-foreground">
                        {item.taxRate ? `${item.taxRate}%` : "—"}
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      {formatMoney(rowTotal, currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Summary & Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
          {/* Notes & Security Guarantee */}
          <div className="sm:max-w-xs space-y-3">
            {values.notes && (
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-3 rounded-xl border border-border/50">
                <span className="font-semibold text-foreground block text-[10px] uppercase tracking-wider mb-1">
                  Client Notes
                </span>
                {values.notes}
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Times Works Anti-Counterfeit Protected</span>
            </div>
          </div>

          {/* Calculation Ledger */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40 text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono font-medium text-foreground">{formatMoney(subtotal, currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between py-1 border-b border-border/40 text-emerald-600 dark:text-emerald-400">
                <span>Discount {discountType === "PERCENTAGE" ? `(${discountValue}%)` : ""}</span>
                <span className="font-mono font-medium">-{formatMoney(discountAmount, currency)}</span>
              </div>
            )}
            {taxTotal > 0 && (
              <div className="flex justify-between py-1 border-b border-border/40 text-muted-foreground">
                <span>Tax</span>
                <span className="font-mono font-medium text-foreground">+{formatMoney(taxTotal, currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-base font-extrabold text-foreground border-t-2 border-foreground">
              <span>TOTAL DUE</span>
              <span className="font-mono text-[#c82020]">{formatMoney(grandTotal, currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Remittance Terms */}
        {values.terms && (
          <div className="border-t border-border/60 pt-6 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Payment Instructions & Terms
            </span>
            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
              {values.terms}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
