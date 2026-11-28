"use client"

import React, { useState, useMemo } from "react"
import {
  CreditCard,
  Plus,
  Search,
  Link as LinkIcon,
  QrCode,
  Copy,
  ExternalLink,
  DollarSign,
  Calendar,
  Building2,
  FolderGit2,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { recordProjectPayment, createPaymentLink } from "@/actions/project-payments"
import { useRouter } from "next/navigation"
import { ReceiptPrintableSheet } from "@/components/payments/receipt-printable-sheet"

interface PaymentsHubClientProps {
  initialPayments: any[]
  initialPaymentLinks: any[]
  projects: any[]
  company: any
}

export function PaymentsHubClient({
  initialPayments = [],
  initialPaymentLinks = [],
  projects = [],
  company,
}: PaymentsHubClientProps) {
  const router = useRouter()
  const [payments, setPayments] = useState<any[]>(initialPayments)
  const [paymentLinks, setPaymentLinks] = useState<any[]>(initialPaymentLinks)
  const [activeTab, setActiveTab] = useState<"payments" | "links">("payments")
  const [search, setSearch] = useState("")

  // Record Payment Dialog
  const [isRecordPayOpen, setIsRecordPayOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [payAmount, setPayAmount] = useState<string>("")
  const [payMethod, setPayMethod] = useState("BANK_TRANSFER")
  const [payRemark, setPayRemark] = useState("")
  const [payTxnId, setPayTxnId] = useState("")
  const [isSavingPay, setIsSavingPay] = useState(false)

  // Create Payment Link Dialog
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false)
  const [linkProjectId, setLinkProjectId] = useState<string>("")
  const [linkTitle, setLinkTitle] = useState("")
  const [linkType, setLinkType] = useState<"FIXED" | "OPEN">("FIXED")
  const [linkAmount, setLinkAmount] = useState<string>("")
  const [linkDescription, setLinkDescription] = useState("")
  const [isSavingLink, setIsSavingLink] = useState(false)

  // QR Modal
  const [activeQrLink, setActiveQrLink] = useState<any | null>(null)

  // Receipt Voucher Sheet
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<any | null>(null)

  // Stats
  const stats = useMemo(() => {
    let totalCollected = 0
    payments.forEach((p) => {
      totalCollected += p.amount || 0
    })

    let totalBudgets = 0
    let totalDue = 0
    projects.forEach((p) => {
      totalBudgets += p.budget || 0
      const paid = p.paidAmount || 0
      if (p.budget > paid) {
        totalDue += p.budget - paid
      }
    })

    return {
      totalCollected,
      totalBudgets,
      totalDue,
      paymentCount: payments.length,
      linksCount: paymentLinks.length,
    }
  }, [payments, projects, paymentLinks])

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    if (!search.trim()) return payments
    const q = search.toLowerCase()
    return payments.filter(
      (p) =>
        (p.remark && p.remark.toLowerCase().includes(q)) ||
        (p.project?.name && p.project.name.toLowerCase().includes(q)) ||
        (p.client?.name && p.client.name.toLowerCase().includes(q)) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(q))
    )
  }, [payments, search])

  // Filtered Links
  const filteredLinks = useMemo(() => {
    if (!search.trim()) return paymentLinks
    const q = search.toLowerCase()
    return paymentLinks.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.project?.name && l.project.name.toLowerCase().includes(q)) ||
        (l.client?.name && l.client.name.toLowerCase().includes(q))
    )
  }, [paymentLinks, search])

  // Handlers
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payAmount || Number(payAmount) <= 0) {
      toast.error("Please enter a valid positive payment amount")
      return
    }
    if (!payRemark.trim()) {
      toast.error("Payment Remark is strictly required")
      return
    }

    setIsSavingPay(true)
    try {
      const res = await recordProjectPayment({
        projectId: selectedProjectId || undefined,
        amount: Number(payAmount),
        currency: "USD",
        method: payMethod,
        remark: payRemark.trim(),
        transactionId: payTxnId.trim() || undefined,
      })

      if (res.success && res.payment) {
        toast.success("Payment recorded and deducted from project due balance!")
        setIsRecordPayOpen(false)
        setSelectedProjectId("")
        setPayAmount("")
        setPayRemark("")
        setPayTxnId("")
        router.refresh()
      } else {
        toast.error(res.error || "Failed to record payment")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSavingPay(false)
    }
  }

  const handleCreatePaymentLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkTitle.trim()) {
      toast.error("Link title is required")
      return
    }
    if (linkType === "FIXED" && (!linkAmount || Number(linkAmount) <= 0)) {
      toast.error("Please enter a valid fixed amount")
      return
    }

    setIsSavingLink(true)
    try {
      const res = await createPaymentLink({
        projectId: linkProjectId || undefined,
        title: linkTitle.trim(),
        type: linkType,
        amount: linkType === "FIXED" ? Number(linkAmount) : undefined,
        currency: "USD",
        description: linkDescription.trim() || undefined,
      })

      if (res.success && res.link) {
        toast.success("Payment link generated!")
        setIsCreateLinkOpen(false)
        setLinkProjectId("")
        setLinkTitle("")
        setLinkAmount("")
        setLinkDescription("")
        router.refresh()
      } else {
        toast.error(res.error || "Failed to create link")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSavingLink(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Payment link copied to clipboard!")
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden font-sans pb-20">
      <div className={`space-y-6 ${activeReceiptPayment ? "print:hidden" : ""}`}>
        {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Payments & Gateway Links
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log received payments with remarks, track client remittances, and generate Fixed or Open amount payment links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCreateLinkOpen(true)}
            className="text-xs font-semibold gap-1.5 border-[#c82020]/30 text-[#c82020] hover:bg-[#c82020]/10"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            Generate Pay Link
          </Button>

          <Button
            size="sm"
            onClick={() => setIsRecordPayOpen(true)}
            className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Total Remitted / Collected
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              ${stats.totalCollected.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">{stats.paymentCount} payments recorded</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c82020]">
              Pending Due Balance
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight text-[#c82020]">
              ${stats.totalDue.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">Uncollected project amounts</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Active Payment Links & QR
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {stats.linksCount}
            </div>
            <p className="text-[10px] text-muted-foreground">Direct online client checkout links</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Segmented Navigation & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "payments"
                ? "bg-background text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            Received Payments ({payments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("links")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "links"
                ? "bg-background text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            Payment Links & QR Gateway ({paymentLinks.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search payments or remarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8.5 h-8.5 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* TAB 1: Received Payments */}
      {activeTab === "payments" && (
        <Card className="border border-border/80 rounded-xl shadow-xs overflow-hidden">
          {filteredPayments.length > 0 ? (
            <div className="divide-y divide-border/60">
              {filteredPayments.map((pm) => (
                <div
                  key={pm.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold font-mono text-emerald-600">
                        +${Number(pm.amount).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                        {pm.method}
                      </span>
                      {pm.project && (
                        <span className="text-xs font-medium text-foreground bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                          {pm.project.name}
                        </span>
                      )}
                      {pm.client && (
                        <span className="text-xs text-muted-foreground">• {pm.client.name}</span>
                      )}
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-foreground">
                      <MessageSquare className="h-3.5 w-3.5 text-[#c82020] shrink-0 mt-0.5" />
                      <span className="font-medium">{pm.remark}</span>
                    </div>

                    {pm.transactionId && (
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Txn ID: {pm.transactionId}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right text-xs text-muted-foreground hidden sm:block">
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" />
                        {new Date(pm.paidAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveReceiptPayment(pm)}
                      className="h-8 text-xs font-semibold gap-1.5 shadow-2xs hover:bg-muted"
                      title="Print or view official payment voucher"
                    >
                      <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                      Receipt Voucher
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <CreditCard className="h-10 w-10 mx-auto text-muted-foreground/60" />
              <h3 className="text-sm font-bold text-foreground">No Payments Recorded</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Record received payments against projects or ad-hoc retainers with mandatory remarks.
              </p>
              <Button
                size="sm"
                onClick={() => setIsRecordPayOpen(true)}
                className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold mt-2"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Record First Payment
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: Payment Links */}
      {activeTab === "links" && (
        <div className="space-y-3">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((pl) => {
              const payUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${pl.token}`
              return (
                <Card
                  key={pl.id}
                  className="border border-border/80 hover:border-border transition-all rounded-xl shadow-xs"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-foreground">{pl.title}</h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            pl.type === "FIXED"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200"
                          }`}
                        >
                          {pl.type === "FIXED"
                            ? `Fixed Amount: $${Number(pl.amount).toLocaleString()}`
                            : "Open / Free Custom Amount"}
                        </span>
                        {pl.project && (
                          <span className="text-xs text-muted-foreground">
                            • Project: <strong>{pl.project.name}</strong>
                          </span>
                        )}
                      </div>

                      {pl.description && (
                        <p className="text-xs text-muted-foreground">{pl.description}</p>
                      )}

                      <p className="text-xs font-mono text-[#c82020] break-all max-w-lg">
                        {payUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(payUrl)}
                        className="h-8 text-xs gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Link
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveQrLink(pl)}
                        className="h-8 text-xs gap-1"
                      >
                        <QrCode className="h-3 w-3" />
                        QR Code
                      </Button>

                      <a href={`/pay/${pl.token}`} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          className="h-8 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold gap-1"
                        >
                          Open Gateway
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="border border-dashed border-border/80 rounded-xl p-12 text-center space-y-3 bg-muted/10">
              <LinkIcon className="h-10 w-10 mx-auto text-muted-foreground/60" />
              <h3 className="text-sm font-bold text-foreground">No Payment Links Generated</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Generate your first online payment link with Fixed or Open amounts for client checkout.
              </p>
              <Button
                size="sm"
                onClick={() => setIsCreateLinkOpen(true)}
                className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold mt-2"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Generate First Link
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* DIALOG 1: Record Payment */}
      <Dialog open={isRecordPayOpen} onOpenChange={setIsRecordPayOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleRecordPayment}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Record Client Payment</DialogTitle>
              <DialogDescription className="text-xs">
                Log a payment received. If linked to a project, it will automatically deduct from remaining due balance.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Link to Project (Optional)</Label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border/80 bg-background px-3 py-1 text-xs"
                >
                  <option value="">No Project (General / Ad-hoc Retainer)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Due: ${p.dueAmount?.toLocaleString() || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Amount (USD) *</Label>
                <Input
                  required
                  type="number"
                  placeholder="e.g. 15000"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="h-9 text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Payment Method</Label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border/80 bg-background px-3 py-1 text-xs"
                >
                  <option value="BANK_TRANSFER">Bank Wire / ACH Transfer</option>
                  <option value="BKASH">bKash Merchant</option>
                  <option value="NAGAD">Nagad</option>
                  <option value="CARD">Credit / Corporate Card</option>
                  <option value="CASH">Cash / Cheque</option>
                  <option value="ONLINE">Online Payment Gateway</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Mandatory Remark / Reference *
                </Label>
                <Textarea
                  required
                  rows={2}
                  placeholder="e.g. Milestone settlement, client invoice clearance, or advance..."
                  value={payRemark}
                  onChange={(e) => setPayRemark(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Transaction Reference ID (Optional)</Label>
                <Input
                  placeholder="e.g. TXN-WIRE-982310"
                  value={payTxnId}
                  onChange={(e) => setPayTxnId(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsRecordPayOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSavingPay}
                className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold"
              >
                {isSavingPay ? "Saving..." : "Save Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Create Payment Link */}
      <Dialog open={isCreateLinkOpen} onOpenChange={setIsCreateLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreatePaymentLink}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Generate Payment Link</DialogTitle>
              <DialogDescription className="text-xs">
                Create a shareable link for clients. Choose Fixed Amount or Open / Free Amount.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Select Project (Optional)</Label>
                <select
                  value={linkProjectId}
                  onChange={(e) => {
                    setLinkProjectId(e.target.value)
                    const p = projects.find((prj) => prj.id === e.target.value)
                    if (p) {
                      setLinkTitle(`Payment for ${p.name}`)
                      if (p.dueAmount && p.dueAmount > 0) {
                        setLinkAmount(String(p.dueAmount))
                      }
                    }
                  }}
                  className="flex h-9 w-full rounded-xl border border-border/80 bg-background px-3 py-1 text-xs"
                >
                  <option value="">No Project (General Payment)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Link Title *</Label>
                <Input
                  required
                  placeholder="e.g. Milestone 1 Settlement"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Link Type *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkType("FIXED")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      linkType === "FIXED"
                        ? "border-[#c82020] bg-[#c82020]/10 text-foreground font-semibold"
                        : "border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-bold">Fixed Amount</div>
                    <div className="text-[10px] text-muted-foreground">Locks exact amount</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLinkType("OPEN")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      linkType === "OPEN"
                        ? "border-[#c82020] bg-[#c82020]/10 text-foreground font-semibold"
                        : "border-border/80 text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-bold">Open / Free Amount</div>
                    <div className="text-[10px] text-muted-foreground">Client inputs amount</div>
                  </button>
                </div>
              </div>

              {linkType === "FIXED" && (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Fixed Amount (USD) *</Label>
                  <Input
                    required
                    type="number"
                    placeholder="e.g. 50000"
                    value={linkAmount}
                    onChange={(e) => setLinkAmount(e.target.value)}
                    className="h-9 text-xs font-mono font-bold"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Client Description / Instructions</Label>
                <Textarea
                  rows={2}
                  placeholder="e.g. Please complete payment using ACH transfer or card."
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateLinkOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSavingLink}
                className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold"
              >
                {isSavingLink ? "Generating..." : "Generate Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: QR Code Viewer */}
      {activeQrLink && (
        <Dialog open={!!activeQrLink} onOpenChange={() => setActiveQrLink(null)}>
          <DialogContent className="sm:max-w-sm text-center">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">{activeQrLink.title}</DialogTitle>
              <DialogDescription className="text-xs">
                Scan with any mobile camera to remit payment.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-border">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${activeQrLink.token}`
                  )}`}
                  alt="Payment QR"
                  className="w-44 h-44 rounded-lg"
                />
              </div>
              <p className="text-xs font-bold text-foreground">
                {activeQrLink.type === "FIXED"
                  ? `Fixed Amount: $${Number(activeQrLink.amount).toLocaleString()}`
                  : "Open / Free Custom Amount"}
              </p>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                className="w-full bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold"
                onClick={() =>
                  copyToClipboard(
                    `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${activeQrLink.token}`
                  )
                }
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy Payment Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      </div>

      {/* Official Printable Money Receipt Voucher Sheet */}
      {activeReceiptPayment && (
        <ReceiptPrintableSheet
          payment={activeReceiptPayment}
          project={activeReceiptPayment.project}
          client={activeReceiptPayment.client}
          company={company}
          onClose={() => setActiveReceiptPayment(null)}
        />
      )}
    </div>
  )
}
