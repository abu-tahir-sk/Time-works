"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import {
  ArrowLeft,
  LayoutTemplate,
  FileText,
  Save,
  Download,
  Check,
  Building2,
  Users,
  ShieldCheck,
  FileSignature,
  DollarSign,
  Sparkles,
  RefreshCw,
  Loader2,
} from "lucide-react"

import { AgreementPdf } from "./agreement-pdf"
import {
  AGREEMENT_TYPES,
  DEFAULT_CLAUSES_BY_TYPE,
  AgreementFormValues,
  AgreementType,
} from "@/lib/agreements/schema"
import { createOrUpdateAgreement } from "@/actions/agreements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Dynamic PDF Viewer & Download link for client-only rendering
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 w-full bg-white dark:bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

interface AgreementBuilderProps {
  clients: any[]
  company: any
}

type ViewMode = "studio" | "canvas"

export function AgreementBuilder({ clients, company }: AgreementBuilderProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("studio")

  const [data, setData] = useState<AgreementFormValues>(() => ({
    title: "Master Services Agreement (MSA)",
    agreementNumber: `AGR-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`,
    type: "SERVICE_AGREEMENT",
    clientId: clients[0]?.id || "",
    clientName: clients[0]?.name || "Acme Global Corporation",
    clientEmail: clients[0]?.email || "accounts@acmeglobal.com",
    clientAddress: clients[0]?.address || "750 7th Avenue, 18th Floor, New York, NY 10019, USA",
    clientCompany: clients[0]?.clientCompany || clients[0]?.company || "Acme Global Corporation",
    effectiveDate: new Date().toISOString().slice(0, 10),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    value: "6000",
    currency: "USD",
    paymentTerms: "Net 30",
    scope:
      "Times Works shall design, provision, configure, and maintain enterprise document workflows, custom billing synchronizers, and digital signature automation infrastructure under the agreed service level standards.",
    clauses: DEFAULT_CLAUSES_BY_TYPE.SERVICE_AGREEMENT,
    notes:
      "Governed by the standard commercial master service provisions of Times Works PRO.",
    companyDetails: {
      name: company?.name || "Times Works",
      address:
        company?.address ||
        "Times Works Tower, Suite 400, Redmond, WA 98052, USA",
      email: company?.email || "legal@timesworks.com",
      phone: company?.phone || "+1 (800) 555-0199",
      taxId: company?.taxId || "US-EIN-98-7654321",
      logoUrl: company?.logoUrl || "/logo-v3.jpg",
    },
  }))

  const set = <K extends keyof AgreementFormValues>(
    key: K,
    value: AgreementFormValues[K]
  ) => setData((prev) => ({ ...prev, [key]: value }))

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) {
      set("clientId", "")
      return
    }
    setData((prev) => ({
      ...prev,
      clientId,
      clientName: client.name || prev.clientName,
      clientEmail: client.email || prev.clientEmail,
      clientAddress: client.address || prev.clientAddress,
      clientCompany: client.clientCompany || client.company || prev.clientCompany,
    }))
  }

  const handleTypeChange = (type: AgreementType) => {
    set("type", type)
    if (type !== "CUSTOM") {
      setData((prev) => ({
        ...prev,
        type,
        clauses: DEFAULT_CLAUSES_BY_TYPE[type],
      }))
    }
  }

  const handleSave = async (status = "DRAFT") => {
    if (!data.clientId) {
      toast.error("Please select an existing client before saving", {
        description: "Agreements must be associated with a client profile.",
      })
      return
    }
    setIsSaving(true)
    try {
      const res = await createOrUpdateAgreement(data)
      if (res.success) {
        toast.success("Agreement saved successfully!")
        router.push("/dashboard/agreements")
      } else {
        toast.error(res.error || "Failed to save agreement")
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const fileName = useMemo(
    () =>
      `timesworks-agreement-${data.agreementNumber}-${data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}.pdf`,
    [data.agreementNumber, data.title]
  )

  const pdfDoc = useMemo(
    () => <AgreementPdf data={data} company={data.companyDetails} />,
    [data]
  )

  return (
    <div className="w-full max-w-full overflow-x-hidden font-sans select-none space-y-6 pb-20">
      {/* 1. Executive Top Bar matching CherryWorks PRO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/agreements"
            className="p-2 rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                New Agreement ({data.title || "Legal Contract"})
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25">
                Times Works PRO
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Draft bilateral contracts, MSA, NDAs and guarantee single-page legal PDF generation.
            </p>
          </div>
        </div>

        {/* View Mode Switcher + Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented View Mode Tabs */}
          <div className="inline-flex items-center bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => setViewMode("studio")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "studio"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-[#c82020]" />
              <span>Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("canvas")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "canvas"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#c82020]" />
              <span>Paper Sheet</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="h-8.5 px-3 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Export PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={() => handleSave("DRAFT")}
            className="h-8.5 px-3 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted"
          >
            <Save className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Save Draft
          </Button>

          <Button
            size="sm"
            disabled={isSaving}
            onClick={() => handleSave("ACTIVE")}
            className="h-8.5 px-4 text-xs font-bold rounded-full bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs transition-all cursor-pointer"
          >
            <span>{isSaving ? "Finalizing..." : "Save Agreement"}</span>
            <Check className="h-3.5 w-3.5 ml-1.5 stroke-[3]" />
          </Button>
        </div>
      </div>

      {/* 2. Main Workspace */}
      {viewMode === "studio" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full min-w-0">
          {/* LEFT COLUMN: Main Form Cards (8 cols) */}
          <div className="xl:col-span-8 space-y-6 w-full min-w-0">
            {/* Card 1: Agreement Information */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">Agreement Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Agreement Title *</Label>
                  <Input
                    value={data.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="Master Services Agreement (MSA)"
                    className="h-10 text-xs font-medium rounded-xl bg-muted/20"
                  />
                </div>

                <div className="sm:col-span-1 space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Agreement Number *</Label>
                  <Input
                    value={data.agreementNumber}
                    onChange={(e) => set("agreementNumber", e.target.value)}
                    placeholder="AGR-2026-001"
                    className="h-10 text-xs font-mono font-medium rounded-xl bg-muted/20"
                  />
                </div>

                <div className="sm:col-span-1 space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Agreement Type</Label>
                  <Select
                    value={data.type}
                    onValueChange={(v: string | null) =>
                      handleTypeChange((v ?? "SERVICE_AGREEMENT") as AgreementType)
                    }
                  >
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGREEMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Effective Date</Label>
                  <Input
                    type="date"
                    value={data.effectiveDate}
                    onChange={(e) => set("effectiveDate", e.target.value)}
                    className="h-10 text-xs rounded-xl bg-muted/20"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Valid Until (Expiry Date)</Label>
                  <Input
                    type="date"
                    value={data.expiryDate}
                    onChange={(e) => set("expiryDate", e.target.value)}
                    className="h-10 text-xs rounded-xl bg-muted/20"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Parties (Dual-Party Identification) */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-foreground">Parties & Counterparties</h2>
                  <p className="text-[11px] text-muted-foreground">Identify both participating legal entities.</p>
                </div>
                {data.clientId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setData((prev) => ({ ...prev, clientId: "" }))}
                    className="h-7 text-xs text-muted-foreground"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Edit Manually
                  </Button>
                )}
              </div>

              {/* Client Selection */}
              {clients.length > 0 && !data.clientId ? (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Select Registered Client *</Label>
                  <Select
                    value=""
                    onValueChange={(v: string | null) => v && handleClientChange(v)}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                      <SelectValue placeholder="Choose a client to auto-fill..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.company || client.clientCompany ? `(${client.company || client.clientCompany})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Party 2: Client Legal Name *</Label>
                  <Input
                    value={data.clientName}
                    onChange={(e) => set("clientName", e.target.value)}
                    placeholder="Acme Global Corporation"
                    className="h-10 text-xs rounded-xl bg-muted/20"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Client Organization / Trade Name</Label>
                  <Input
                    value={data.clientCompany}
                    onChange={(e) => set("clientCompany", e.target.value)}
                    placeholder="Acme Global Inc."
                    className="h-10 text-xs rounded-xl bg-muted/20"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Official Contact Email</Label>
                  <Input
                    value={data.clientEmail}
                    onChange={(e) => set("clientEmail", e.target.value)}
                    placeholder="legal@acmeglobal.com"
                    className="h-10 text-xs rounded-xl bg-muted/20"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Registered Corporate Address</Label>
                  <Input
                    value={data.clientAddress}
                    onChange={(e) => set("clientAddress", e.target.value)}
                    placeholder="750 7th Avenue, New York, NY 10019, USA"
                    className="h-10 text-xs rounded-xl bg-muted/20"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Commercial Consideration & Scope of Work */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">Commercial Scope & Compensation</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Contract Value</Label>
                  <Input
                    type="number"
                    value={data.value}
                    onChange={(e) => set("value", e.target.value)}
                    placeholder="6000"
                    className="h-10 text-xs font-mono rounded-xl bg-muted/20"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Currency</Label>
                  <Select value={data.currency} onValueChange={(v) => set("currency", v || "USD")}>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="GBP">£ GBP</SelectItem>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="BDT">৳ BDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-medium">Payment Terms</Label>
                  <Select value={data.paymentTerms} onValueChange={(v) => set("paymentTerms", v || "Net 30")}>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Due upon receipt">Due upon receipt</SelectItem>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="Milestone-based">Milestone-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-medium">Scope of Work & Services Narrative</Label>
                <Textarea
                  value={data.scope}
                  onChange={(e) => set("scope", e.target.value)}
                  placeholder="Detail the deliverables, technical responsibilities, and service levels..."
                  className="min-h-[85px] text-xs rounded-xl bg-muted/20 resize-y"
                />
              </div>
            </div>

            {/* Card 4: Terms, Conditions & Legal Covenants */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-foreground">Terms & Legal Covenants</h2>
                  <p className="text-[11px] text-muted-foreground">Standard clauses automatically balanced into 2 columns on the A4 PDF.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTypeChange(data.type)}
                  className="h-7 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset to Standard Clauses
                </Button>
              </div>

              <Textarea
                value={data.clauses}
                onChange={(e) => set("clauses", e.target.value)}
                placeholder="1. SCOPE OF WORK&#10;The Service Provider shall perform...&#10;&#10;2. TERM&#10;This Agreement shall commence..."
                className="min-h-[220px] text-xs font-mono leading-relaxed rounded-xl bg-muted/20 resize-y"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Contract Overview Card (4 cols) */}
          <div className="xl:col-span-4 w-full min-w-0 xl:sticky xl:top-20 space-y-4">
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">Contract Overview</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#c82020]/10 text-[#c82020]">
                  {data.type.replace(/_/g, " ")}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Parties Summary */}
                <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Party 1 (Provider):</span>
                    <span className="font-bold text-foreground">{data.companyDetails.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Party 2 (Client):</span>
                    <span className="font-bold text-foreground">{data.clientName || "Not assigned"}</span>
                  </div>
                </div>

                {/* Contract Value */}
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Contract Consideration</span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {data.currency} {Number(data.value || 0).toLocaleString()}
                  </span>
                </div>

                {/* Terms */}
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Payment Terms</span>
                  <span className="font-medium text-foreground">{data.paymentTerms}</span>
                </div>

                {/* Effective Timeline */}
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Duration</span>
                  <span className="font-medium text-foreground">1 Year (Renewable)</span>
                </div>

                {/* Single Page Guarantee Badge */}
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Single-Page A4 Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400/90 leading-tight">
                    Clauses and dual execution signatures will fit on exactly one legal A4 page.
                  </p>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={() => handleSave("ACTIVE")}
                  disabled={isSaving}
                  className="w-full h-11 text-xs font-bold rounded-xl bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>{isSaving ? "Saving Agreement..." : "Save Agreement"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas View */}
      {viewMode === "canvas" && (
        <div className="py-4 flex flex-col items-center">
          <div className="w-full max-w-[210mm] bg-white rounded-lg shadow-xl overflow-hidden border min-h-[800px] h-[calc(100vh-140px)]">
            <PDFViewer width="100%" height="100%" className="border-none" showToolbar={false}>
              {pdfDoc}
            </PDFViewer>
          </div>
        </div>
      )}

      {/* Export PDF Modal Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-foreground">
              Agreement PDF Export & Print
            </DialogTitle>
            <PDFDownloadLink document={pdfDoc} fileName={fileName}>
              {({ loading }) => (
                <Button size="sm" disabled={loading} className="h-8 text-xs font-bold bg-[#c82020] hover:bg-[#a81a1a] text-white mr-6">
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </DialogHeader>
          <div className="py-2 h-[700px] w-full">
            <PDFViewer width="100%" height="100%" className="border-none" showToolbar={false}>
              {pdfDoc}
            </PDFViewer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
