"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import {
  CreditCard,
  Building2,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Copy,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
  Lock,
  Layers,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { submitClientPayment } from "@/actions/project-payments"
import { ReceiptPdf } from "@/components/payments/receipt-pdf"
import { ReceiptPrintableSheet } from "@/components/payments/receipt-printable-sheet"

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

interface PayGatewayClientProps {
  linkData: any
}

export function PayGatewayClient({ linkData }: PayGatewayClientProps) {
  const { company, project, client } = linkData
  const isFixed = linkData.type === "FIXED" && linkData.amount

  const [amount, setAmount] = useState<string>(isFixed ? String(linkData.amount) : "")
  const [method, setMethod] = useState("BANK_TRANSFER")
  const [payerName, setPayerName] = useState("")
  const [txnId, setTxnId] = useState("")
  const [clientNote, setClientNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null)
  const [isReceiptSheetOpen, setIsReceiptSheetOpen] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payAmt = isFixed ? Number(linkData.amount) : Number(amount)
    if (!payAmt || payAmt <= 0) {
      toast.error("Please enter a valid positive payment amount")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitClientPayment(linkData.token, {
        amount: payAmt,
        method,
        transactionId: txnId.trim() || undefined,
        payerName: payerName.trim() || undefined,
        clientNote: clientNote.trim() || undefined,
      })

      if (res.success) {
        setPaymentSuccess({
          amount: payAmt,
          method,
          transactionId: txnId || `TXN-${Date.now().toString(36).toUpperCase()}`,
          date: new Date().toLocaleString(),
          payerName: payerName || client?.name || "Valued Client",
        })
        toast.success("Payment recorded successfully!")
      } else {
        toast.error(res.error || "Failed to process payment")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  )}`

  return (
    <div className="min-h-screen bg-[#faf9f8] dark:bg-[#121212] font-sans antialiased text-foreground py-10 px-4 sm:px-6">
      <div className={`max-w-3xl mx-auto space-y-6 ${isReceiptSheetOpen ? "print:hidden" : ""}`}>
        {/* 1. Header with Company Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div className="flex items-center gap-3">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="Logo"
                className="w-10 h-10 rounded-xl object-contain border border-border/80 shadow-2xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#c82020] text-white flex items-center justify-center font-bold">
                TW
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-foreground">{company?.name || "Times Works"}</h2>
              <p className="text-xs text-muted-foreground">Official Client Remittance & Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-muted/60 px-3 py-1.5 rounded-xl border border-border/60">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            256-Bit Encrypted Checkout
          </div>
        </div>

        {paymentSuccess ? (
          /* SUCCESS RECEIPT */
          <Card className="border border-emerald-500/30 dark:border-emerald-500/20 rounded-2xl shadow-md p-6 sm:p-8 text-center space-y-6 bg-background">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Remittance Confirmed!</h3>
              <p className="text-xs text-muted-foreground">
                Thank you! Your payment has been credited against the project account and logged.
              </p>
            </div>

            <div className="bg-muted/30 border border-border/70 rounded-xl p-4 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Remitted:</span>
                <strong className="text-emerald-600 text-sm">
                  ${Number(paymentSuccess.amount).toLocaleString()} {linkData.currency}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>{paymentSuccess.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span>{paymentSuccess.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payer:</span>
                <span>{paymentSuccess.payerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{paymentSuccess.date}</span>
              </div>
              {project && (
                <div className="flex justify-between border-t border-border/60 pt-2 text-[11px]">
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-semibold text-foreground">{project.name}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReceiptSheetOpen(true)}
                className="text-xs font-semibold gap-1.5 shadow-2xs hover:bg-muted"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Money Receipt (A4)
              </Button>

              <PDFDownloadLink
                document={
                  <ReceiptPdf
                    payment={{
                      amount: paymentSuccess.amount,
                      currency: linkData.currency,
                      method: paymentSuccess.method,
                      transactionId: paymentSuccess.transactionId,
                      remarks: clientNote || `Remittance via payment link "${linkData.title}"`,
                      paidAt: new Date().toISOString(),
                    }}
                    project={project}
                    client={client || { name: paymentSuccess.payerName }}
                    company={company}
                  />
                }
                fileName={`Receipt-${paymentSuccess.transactionId || "Remittance"}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className="text-xs font-semibold gap-1.5 shadow-2xs hover:bg-muted"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-600" />
                    {loading ? "Generating Receipt..." : "Download Receipt PDF"}
                  </Button>
                )}
              </PDFDownloadLink>

              <Button
                size="sm"
                onClick={() => window.location.reload()}
                className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold"
              >
                Make Another Payment
              </Button>
            </div>
          </Card>
        ) : (
          /* PAYMENT CHECKOUT FORM */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border border-border/80 rounded-2xl shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isFixed
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200"
                      }`}
                    >
                      {isFixed ? "Fixed Remittance Link" : "Open / Free Custom Amount"}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground mt-1">
                    {linkData.title}
                  </CardTitle>
                  {linkData.description && (
                    <CardDescription className="text-xs leading-relaxed">
                      {linkData.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Amount Field */}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Payment Amount ({linkData.currency}) *</Label>
                      {isFixed ? (
                        <div className="h-11 rounded-xl bg-muted/40 border border-border/80 px-3 flex items-center justify-between font-mono font-bold text-base text-foreground">
                          <span>${Number(linkData.amount).toLocaleString()}</span>
                          <span className="text-[11px] font-normal text-muted-foreground flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Exact Fixed Amount
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-foreground">
                            $
                          </span>
                          <Input
                            required
                            type="number"
                            placeholder="Enter amount to pay (e.g. 50000)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-7 h-11 text-base font-mono font-bold rounded-xl"
                          />
                        </div>
                      )}
                    </div>

                    {/* Method Selection */}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Choose Payment Channel *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "BANK_TRANSFER", title: "Bank Wire / ACH", desc: "Corporate Bank Transfer" },
                          { id: "CARD", title: "Credit / Debit Card", desc: "Visa, Mastercard, Amex" },
                          { id: "BKASH", title: "bKash / Mobile Wallet", desc: "Scan QR or Merchant" },
                          { id: "ONLINE", title: "Online Transfer", desc: "Instant Gateway" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setMethod(m.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              method === m.id
                                ? "border-[#c82020] bg-[#c82020]/10 text-foreground font-semibold shadow-2xs"
                                : "border-border/80 text-muted-foreground hover:bg-muted/40"
                            }`}
                          >
                            <div className="text-xs font-bold">{m.title}</div>
                            <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payer & Transaction Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Your Name / Organization</Label>
                        <Input
                          placeholder="e.g. Acme Global Corporation / John Doe"
                          value={payerName}
                          onChange={(e) => setPayerName(e.target.value)}
                          className="h-9 text-xs rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Transaction Reference / UTR</Label>
                        <Input
                          placeholder="e.g. ACH-982142 or Card Auth Code"
                          value={txnId}
                          onChange={(e) => setTxnId(e.target.value)}
                          className="h-9 text-xs rounded-xl font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Remittance Note / Remark</Label>
                      <Textarea
                        rows={2}
                        placeholder="e.g. Authorizing payment against Project Milestone 1."
                        value={clientNote}
                        onChange={(e) => setClientNote(e.target.value)}
                        className="text-xs rounded-xl"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-[#c82020] hover:bg-[#a81a1a] text-white font-semibold text-sm rounded-xl shadow-xs"
                    >
                      {isSubmitting ? (
                        "Processing Remittance..."
                      ) : (
                        <>
                          Authorize & Remit ${isFixed ? Number(linkData.amount).toLocaleString() : Number(amount || 0).toLocaleString()}
                          <ArrowRight className="h-4 w-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Project & Bank Info */}
            <div className="space-y-6">
              {/* Linked Project Summary */}
              {project && (
                <Card className="border border-border/80 rounded-2xl shadow-xs">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Linked Project
                    </CardTitle>
                    <div className="text-sm font-bold text-foreground mt-0.5 line-clamp-1">
                      {project.name}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-border/60 pb-1.5">
                      <span className="text-muted-foreground">Total Budget:</span>
                      <span className="font-bold">${Number(project.budget).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-1.5">
                      <span className="text-muted-foreground">Paid to Date:</span>
                      <span className="font-bold text-emerald-600">${Number(project.paidAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-muted-foreground">Remaining Due:</span>
                      <span className="font-bold text-[#c82020]">${Number(linkData.dueAmount || 0).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* QR Code Scan */}
              <Card className="border border-border/80 rounded-2xl p-4 shadow-xs text-center space-y-2.5">
                <p className="text-xs font-bold text-foreground">Scan with Mobile to Pay</p>
                <div className="p-2 bg-white rounded-xl border border-border inline-block shadow-2xs">
                  <img src={qrUrl} alt="Payment QR" className="w-36 h-36 mx-auto" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Works with mobile cameras and banking apps.
                </p>
              </Card>

              {/* Company Bank Wire Details */}
              <Card className="border border-border/80 rounded-2xl shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[#c82020]" />
                    Company Banking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs font-mono">
                  {company?.bankName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-bold">{company.bankName}</span>
                    </div>
                  )}
                  {company?.accountName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Beneficiary:</span>
                      <span>{company.accountName}</span>
                    </div>
                  )}
                  {company?.accountNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Account #:</span>
                      <span className="font-bold flex items-center gap-1">
                        {company.accountNumber}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(company.accountNumber, "Account number")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    </div>
                  )}
                  {company?.ifsc && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SWIFT / Routing:</span>
                      <span>{company.ifsc}</span>
                    </div>
                  )}
                  {company?.paymentInstructions && (
                    <div className="border-t border-border/60 pt-2 text-[10px] text-muted-foreground font-sans leading-relaxed">
                      {company.paymentInstructions}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Official Printable Money Receipt Voucher Sheet */}
      {isReceiptSheetOpen && paymentSuccess && (
        <ReceiptPrintableSheet
          payment={{
            amount: paymentSuccess.amount,
            currency: linkData.currency,
            method: paymentSuccess.method,
            transactionId: paymentSuccess.transactionId,
            remarks: clientNote || `Remittance via payment link "${linkData.title}"`,
            paidAt: new Date().toISOString(),
          }}
          project={project}
          client={client || { name: paymentSuccess.payerName }}
          company={company}
          onClose={() => setIsReceiptSheetOpen(false)}
        />
      )}
    </div>
  )
}
