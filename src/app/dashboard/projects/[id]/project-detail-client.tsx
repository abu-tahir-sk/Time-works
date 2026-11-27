"use client"

import React, { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  Layers,
  CreditCard,
  Link as LinkIcon,
  Plus,
  QrCode,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Edit,
  Trash2,
  AlertCircle,
  Printer,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { recordProjectPayment, createPaymentLink } from "@/actions/project-payments"
import { deleteProject } from "@/actions/projects"
import { ProjectPdf } from "@/components/projects/project-pdf"
import { ProjectPrintableSheet } from "@/components/projects/project-printable-sheet"

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

interface ProjectDetailClientProps {
  project: any
}

export function ProjectDetailClient({ project: initialProject }: ProjectDetailClientProps) {
  const router = useRouter()
  const [project, setProject] = useState<any>(initialProject)
  const [activeTab, setActiveTab] = useState<"features" | "payments" | "links">("features")

  // Record Payment Dialog
  const [isRecordPayOpen, setIsRecordPayOpen] = useState(false)
  const [payAmount, setPayAmount] = useState<string>("")
  const [payMethod, setPayMethod] = useState("BANK_TRANSFER")
  const [payRemark, setPayRemark] = useState("")
  const [payTxnId, setPayTxnId] = useState("")
  const [isSavingPay, setIsSavingPay] = useState(false)

  // Create Payment Link Dialog
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false)
  const [linkTitle, setLinkTitle] = useState("")
  const [linkType, setLinkType] = useState<"FIXED" | "OPEN">("FIXED")
  const [linkAmount, setLinkAmount] = useState<string>("")
  const [linkDescription, setLinkDescription] = useState("")
  const [isSavingLink, setIsSavingLink] = useState(false)

  // QR Code Preview Dialog
  const [activeQrLink, setActiveQrLink] = useState<any | null>(null)

  // Official Printable Sheet Dialog
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false)

  // Calculations
  const budget = project.budget || 0
  const paid = project.paidAmount || 0
  const due = Math.max(0, budget - paid)
  const pct = budget > 0 ? Math.min(100, Math.round((paid / budget) * 100)) : 0

  // 1. Record Payment Handler
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payAmount || Number(payAmount) <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }
    if (!payRemark.trim()) {
      toast.error("Remark is strictly required")
      return
    }

    setIsSavingPay(true)
    try {
      const res = await recordProjectPayment({
        projectId: project.id,
        clientId: project.clientId,
        amount: Number(payAmount),
        currency: project.currency,
        method: payMethod,
        remark: payRemark.trim(),
        transactionId: payTxnId.trim() || undefined,
      })

      if (res.success && res.payment) {
        toast.success("Payment recorded and deducted from due balance!")
        setIsRecordPayOpen(false)
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

  // 2. Create Payment Link Handler
  const handleCreatePaymentLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkTitle.trim()) {
      toast.error("Please enter a title for the payment link")
      return
    }
    if (linkType === "FIXED" && (!linkAmount || Number(linkAmount) <= 0)) {
      toast.error("Please enter a valid fixed amount")
      return
    }

    setIsSavingLink(true)
    try {
      const res = await createPaymentLink({
        projectId: project.id,
        clientId: project.clientId,
        title: linkTitle.trim(),
        type: linkType,
        amount: linkType === "FIXED" ? Number(linkAmount) : undefined,
        currency: project.currency,
        description: linkDescription.trim() || undefined,
      })

      if (res.success && res.link) {
        toast.success("Payment link generated successfully!")
        setIsCreateLinkOpen(false)
        setLinkTitle("")
        setLinkAmount("")
        setLinkDescription("")
        router.refresh()
      } else {
        toast.error(res.error || "Failed to create payment link")
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return
    const res = await deleteProject(project.id)
    if (res.success) {
      toast.success("Project deleted")
      router.push("/dashboard/projects")
    } else {
      toast.error(res.error || "Failed to delete project")
    }
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden font-sans space-y-6 pb-20">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {project.code || "PRJ"}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground line-clamp-1">
                {project.name}
              </h1>
            </div>
            {project.client && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Building2 className="h-3 w-3" />
                <span className="font-semibold text-foreground">{project.client.name}</span>
                {project.client.clientCompany && <span>• {project.client.clientCompany}</span>}
                {project.client.email && <span>• {project.client.email}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Official Document Print / Download Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPrintSheetOpen(true)}
            className="text-xs font-semibold gap-1.5 shadow-2xs hover:bg-muted"
            title="Print Official Scope & Specifications Document"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            Print Scope (A4)
          </Button>

          <PDFDownloadLink
            document={<ProjectPdf project={project} />}
            fileName={`${project.code || "Project"}-Scope-Proposal.pdf`}
          >
            {({ loading }) => (
              <Button
                size="sm"
                variant="outline"
                disabled={loading}
                className="text-xs font-semibold gap-1.5 shadow-2xs hover:bg-muted"
                title="Download Official PDF Document"
              >
                <Download className="h-3.5 w-3.5 text-[#c82020]" />
                {loading ? "Generating PDF..." : "Download Scope PDF"}
              </Button>
            )}
          </PDFDownloadLink>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setLinkTitle(`Payment for ${project.name}`)
              setLinkAmount(due > 0 ? String(due) : "")
              setIsCreateLinkOpen(true)
            }}
            className="text-xs font-semibold gap-1.5 border-[#c82020]/30 text-[#c82020] hover:bg-[#c82020]/10"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            Generate Pay Link
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setPayAmount(due > 0 ? String(due) : "")
              setIsRecordPayOpen(true)
            }}
            className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Record Payment
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-muted-foreground hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 2. Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Contract Budget
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              ${budget.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">Total agreed fee</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Total Remitted / Paid
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              ${paid.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">{pct}% collected of budget</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c82020]">
              Remaining Due Balance
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight text-[#c82020]">
              ${due.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {due === 0 ? "Fully Paid & Settled" : "Auto-deducts when payments arrive"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Progress Bar */}
      <Card className="border border-border/80 rounded-xl p-4 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Project Payment Progress</span>
            <span className="font-mono">{pct}% Settled</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </Card>

      {/* 4. Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("features")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "features"
              ? "bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Feature Breakdown & Costs ({Array.isArray(project.featureBreakdown) ? project.featureBreakdown.length : 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "payments"
              ? "bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          Payment History ({Array.isArray(project.payments) ? project.payments.length : 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("links")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "links"
              ? "bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Payment Links & QR ({Array.isArray(project.paymentLinks) ? project.paymentLinks.length : 0})
        </button>
      </div>

      {/* TAB 1: Feature Breakdown */}
      {activeTab === "features" && (
        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#c82020]" />
              Granular Milestone Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Itemized features dividing the project budget into discrete deliverables (no lazy lump sums).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.isArray(project.featureBreakdown) && project.featureBreakdown.length > 0 ? (
              <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden">
                {project.featureBreakdown.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-background hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-muted-foreground">#{idx + 1}</span>
                        <h4 className="text-xs font-bold text-foreground">{item.feature}</h4>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-muted-foreground pl-5">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right pl-5 sm:pl-0">
                      <span className="text-xs font-mono font-bold text-foreground">
                        ${Number(item.cost || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No granular features added yet.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 2: Payment History (With Mandatory Remark) */}
      {activeTab === "payments" && (
        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                Payments Remitted & Received
              </CardTitle>
              <CardDescription className="text-xs">
                Every transaction logged with timestamp and mandatory remark.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setPayAmount(due > 0 ? String(due) : "")
                setIsRecordPayOpen(true)
              }}
              className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold gap-1"
            >
              <Plus className="h-3 w-3" />
              Record Payment
            </Button>
          </CardHeader>
          <CardContent>
            {Array.isArray(project.payments) && project.payments.length > 0 ? (
              <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden">
                {project.payments.map((pm: any) => (
                  <div
                    key={pm.id}
                    className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-background hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-emerald-600">
                          +${Number(pm.amount).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {pm.method}
                        </span>
                        {pm.transactionId && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Txn: {pm.transactionId}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="font-medium">{pm.remark}</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-muted-foreground">
                      {new Date(pm.paidAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No payments recorded yet for this project.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Payment Links & QR */}
      {activeTab === "links" && (
        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-[#c82020]" />
                Client Payment Links & QR Codes
              </CardTitle>
              <CardDescription className="text-xs">
                Shareable links (Fixed or Open amount) allowing clients to remit directly online.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setLinkTitle(`Payment for ${project.name}`)
                setLinkAmount(due > 0 ? String(due) : "")
                setIsCreateLinkOpen(true)
              }}
              className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold gap-1"
            >
              <Plus className="h-3 w-3" />
              Generate New Link
            </Button>
          </CardHeader>
          <CardContent>
            {Array.isArray(project.paymentLinks) && project.paymentLinks.length > 0 ? (
              <div className="space-y-3">
                {project.paymentLinks.map((pl: any) => {
                  const payUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${pl.token}`
                  return (
                    <div
                      key={pl.id}
                      className="p-3.5 rounded-xl border border-border/80 bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-border transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-foreground">{pl.title}</h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              pl.type === "FIXED"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            }`}
                          >
                            {pl.type === "FIXED" ? `Fixed: $${Number(pl.amount).toLocaleString()}` : "Open / Free Amount"}
                          </span>
                        </div>
                        {pl.description && (
                          <p className="text-[11px] text-muted-foreground">{pl.description}</p>
                        )}
                        <p className="text-[10px] font-mono text-muted-foreground truncate max-w-md">
                          {payUrl}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No payment links generated for this project yet.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* DIALOG 1: Record Payment */}
      <Dialog open={isRecordPayOpen} onOpenChange={setIsRecordPayOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleRecordPayment}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Record Project Payment</DialogTitle>
              <DialogDescription className="text-xs">
                Log a received client payment. Remaining project due balance will auto-deduct.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Payment Amount ({project.currency}) *</Label>
                <Input
                  required
                  type="number"
                  placeholder="e.g. 50000"
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
                  placeholder="e.g. Milestone 1 settlement authorized by client director."
                  value={payRemark}
                  onChange={(e) => setPayRemark(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Transaction Reference / ID</Label>
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
              <DialogTitle className="text-base font-bold">Generate Client Payment Link</DialogTitle>
              <DialogDescription className="text-xs">
                Create a secure payment link or QR code to share with the client.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Link Title *</Label>
                <Input
                  required
                  placeholder="e.g. Milestone 1 Advance"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Payment Link Type *</Label>
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
                  <Label className="text-xs font-semibold">Fixed Amount ({project.currency}) *</Label>
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
                <Label className="text-xs font-semibold">Instructions / Note for Client</Label>
                <Textarea
                  rows={2}
                  placeholder="e.g. Please remit payment against Milestone 1 deliverables."
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
                Scan with any mobile camera or payment app to remit funds.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex flex-col items-center justify-center space-y-3">
              {/* Generated QR Code via Google Charts / QuickChart API */}
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
                  ? `Amount: $${Number(activeQrLink.amount).toLocaleString()}`
                  : "Amount: Open / Any Amount"}
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

      {/* Printable Sheet View */}
      {isPrintSheetOpen && (
        <ProjectPrintableSheet
          project={project}
          onClose={() => setIsPrintSheetOpen(false)}
        />
      )}
    </div>
  )
}
