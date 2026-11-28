"use client"

import React from "react"
import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReceiptPrintableSheetProps {
  payment: any
  project?: any
  client?: any
  company?: any
  onClose?: () => void
}

export function ReceiptPrintableSheet({
  payment,
  project,
  client,
  company,
  onClose,
}: ReceiptPrintableSheetProps) {
  const currency = payment.currency || project?.currency || "USD"
  const amount = Number(payment.amount) || 0

  const companyName = company?.name || "Times Works"
  const companyEmail = company?.email || "billing@timesworks.com"
  const companyPhone = company?.phone || "+1 (800) 555-0199"
  const companyAddress = company?.address || "Times Works Tower, Suite 400, Redmond, WA 98052, USA"

  const clientName = client?.name || payment.client?.name || "Valued Client"
  const clientCompany = client?.company || payment.client?.company || ""
  const clientEmail = client?.email || payment.client?.email || ""

  const projectTitle = project?.name || payment.project?.name || "Direct Account Remittance"
  const projectCode = project?.code || payment.project?.code || "PRJ-GEN"

  const fmt = (amt: number) => {
    return `${currency} ${Number(amt || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const receiptNumber =
    payment.receiptNumber ||
    `RCT-${new Date().getFullYear()}-${String(payment.id || "101").slice(-6).toUpperCase()}`
  const paidDate = payment.paidAt
    ? new Date(payment.paidAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-US")

  const budget = Number(project?.budget) || 0
  const paidTotal = Number(project?.paidAmount) || amount
  const dueRemaining = Math.max(0, budget - paidTotal)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm print:bg-white print:p-0 print:static print:inset-auto">
      {/* Top action toolbar (Hidden when printing) */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/80 bg-background/95 px-6 py-3 shadow-sm backdrop-blur-md print:hidden">
        <div className="flex items-center gap-3">
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Close Receipt
            </Button>
          )}
          <span className="text-xs font-semibold text-muted-foreground">
            Official Payment Receipt Voucher (A4 Printable)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Receipt Voucher (A4)
          </Button>
        </div>
      </div>

      {/* Printable Sheet Canvas: A4 Format */}
      <div className="py-8 px-4 flex justify-center print:p-0 print:m-0 print:block">
        <div className="w-full max-w-[800px] bg-white text-slate-900 rounded-xl shadow-2xl p-10 sm:p-12 border border-slate-200 print:border-none print:shadow-none print:p-0 print:w-full print:max-w-none print:rounded-none">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-5 mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">{companyName}</h1>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                Official Remittance & Money Voucher
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {companyAddress}
                <br />
                Email: {companyEmail} | Phone: {companyPhone}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                Official Money Receipt
              </span>
              <p className="text-sm font-black font-mono text-slate-900 mt-2">{receiptNumber}</p>
              <p className="text-xs text-slate-500 mt-1">Date: {paidDate}</p>
            </div>
          </div>

          {/* Amount Received Callout Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-6 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Total Amount Received
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Payment Status: Confirmed & Completed</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono text-emerald-700">{fmt(amount)}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Received From (Payer):
              </p>
              <p className="text-sm font-bold text-slate-900">{clientName}</p>
              {clientCompany && <p className="text-slate-600 mt-0.5">{clientCompany}</p>}
              {clientEmail && <p className="text-slate-600 mt-0.5">Email: {clientEmail}</p>}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Remittance Allocation & Method:
              </p>
              <p className="text-sm font-bold text-slate-900">{projectTitle}</p>
              <p className="text-slate-600 mt-0.5 font-mono">Project Ref: {projectCode}</p>
              <p className="text-slate-600 mt-0.5">
                Method: <span className="font-semibold">{payment.method?.replace(/_/g, " ") || "Bank Transfer"}</span>
                {payment.transactionId ? ` (Txn: ${payment.transactionId})` : ""}
              </p>
            </div>
          </div>

          {/* Mandatory Remark Callout */}
          <div className="bg-slate-50 border-l-4 border-[#c82020] rounded-r-lg p-4 mb-6 text-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#c82020] mb-1">
              Official Payment Remark / Purpose:
            </p>
            <p className="text-slate-900 font-medium italic text-sm">
              "{payment.remarks || payment.remark || "Payment credited against agreed project milestones and deliverables."}"
            </p>
          </div>

          {/* Remaining Project Balance Status */}
          {budget > 0 && (
            <div className="border border-slate-200 rounded-lg p-4 mb-8 bg-white grid grid-cols-3 gap-3 text-xs text-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Project Budget</p>
                <p className="text-xs font-bold font-mono text-slate-900 mt-0.5">{fmt(budget)}</p>
              </div>
              <div className="border-x border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase">Total Paid to Date</p>
                <p className="text-xs font-bold font-mono text-emerald-600 mt-0.5">{fmt(paidTotal)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Remaining Due Balance</p>
                <p className="text-xs font-bold font-mono text-[#c82020] mt-0.5">{fmt(dueRemaining)}</p>
              </div>
            </div>
          )}

          {/* Signature & Seal Block */}
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200 text-xs">
            <div>
              <div className="h-16 border-b border-slate-400 mb-2" />
              <p className="font-bold text-slate-900">Authorized Accounts Officer</p>
              <p className="text-[11px] text-slate-500">Times Works Finance Department</p>
            </div>
            <div>
              <div className="h-16 border-b border-slate-400 mb-2" />
              <p className="font-bold text-slate-900">Payer Acknowledgment</p>
              <p className="text-[11px] text-slate-500">{clientName}</p>
            </div>
          </div>

          {/* Bottom notice */}
          <p className="text-[10px] text-center text-slate-400 mt-10 border-t border-slate-100 pt-4">
            Official Money Receipt • Times Works Accounts Department • Retain this document for official tax & audit reconciliation.
          </p>
        </div>
      </div>
    </div>
  )
}
