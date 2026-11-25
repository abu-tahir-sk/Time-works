"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { quotationSchema, QuotationFormValues } from "@/lib/quotations/schema"
import { defaultDesignSettings } from "@/lib/design-system/schema"
import { QuotationEditor } from "./quotation-editor"
import { StaticInvoicePreview } from "@/components/invoices/invoice-preview"
import { InvoicePdf } from "@/components/invoices/invoice-pdf"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createOrUpdateQuotation } from "@/actions/quotations"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  LayoutTemplate,
  FileText,
  Save,
  Download,
  Check,
  Loader2,
} from "lucide-react"

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

interface QuotationBuilderProps {
  clients: any[]
  company: any
  initialData?: any
}

type ViewMode = "studio" | "canvas"

export function QuotationBuilder({ clients, company, initialData }: QuotationBuilderProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("studio")
  const [localClients, setLocalClients] = useState<any[]>(clients)

  const form = useForm<any>({
    // @ts-ignore
    resolver: zodResolver(quotationSchema),
    defaultValues: initialData ? {
      ...initialData,
      issueDate: new Date(initialData.issueDate),
      validUntil: new Date(initialData.validUntil),
      designSettings: initialData.designSettings || company?.designSettings || defaultDesignSettings,
      companyDetails: {
        name: initialData.companyDetails?.name || (company?.name && !company.name.includes("'s Company") ? company.name : "Times Works"),
        address: initialData.companyDetails?.address || company?.address || "Times Works Tower, Suite 400, Redmond, WA 98052, USA",
        email: initialData.companyDetails?.email || company?.email || "billing@timesworks.com",
        phone: initialData.companyDetails?.phone || company?.phone || "+1 (800) 555-0199",
        taxId: initialData.companyDetails?.taxId || company?.taxId || "US-EIN-98-7654321",
        logoUrl: initialData.companyDetails?.logoUrl || company?.logoUrl || "/logo-v3.jpg",
        signatureUrl: initialData.companyDetails?.signatureUrl ?? company?.signatureUrl ?? "",
        sealUrl: initialData.companyDetails?.sealUrl ?? company?.sealUrl ?? "",
      }
    } : {
      clientId: clients[0]?.id || "",
      quotationNumber: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      currency: "USD",
      discountType: "PERCENTAGE",
      discountValue: 0,
      status: "DRAFT",
      issueDate: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days validity
      template: "professional",
      items: [
        {
          description: "Enterprise Digital Workflow Transformation",
          quantity: 1,
          unit: "Project",
          unitPrice: 3500,
          taxRate: 10,
        },
        {
          description: "Custom Cloud API & Dynamics 365 Architecture",
          quantity: 1,
          unit: "System",
          unitPrice: 1800,
          taxRate: 10,
        },
        {
          description: "Annual Priority SLA Maintenance & Support",
          quantity: 1,
          unit: "Year",
          unitPrice: 700,
          taxRate: 10,
        },
      ],
      notes: company?.defaultNotes || "Times Works delivers enterprise document workflow infrastructure with a 99.99% uptime SLA.",
      terms: company?.defaultTerms || "1. Quotation is valid for 30 calendar days from issue date.\n2. 50% advance upon project authorization, 50% upon final acceptance milestone.\n3. Applicable statutory taxes extra as billed.",
      designSettings: company?.designSettings || defaultDesignSettings,
      companyDetails: {
        name: company?.name && !company.name.includes("'s Company") ? company.name : "Times Works",
        address: company?.address || "Times Works Tower, Suite 400, Redmond, WA 98052, USA",
        email: company?.email || "billing@timesworks.com",
        phone: company?.phone || "+1 (800) 555-0199",
        taxId: company?.taxId || "US-EIN-98-7654321",
        logoUrl: company?.logoUrl || "/logo-v3.jpg",
        signatureUrl: company?.signatureUrl || "",
        sealUrl: company?.sealUrl || "",
      }
    }
  })

  async function handleSave(status = "DRAFT") {
    setIsSaving(true)
    try {
      const data = form.getValues()
      data.status = status
      const res = await createOrUpdateQuotation(data as QuotationFormValues)
      if (res.success) {
        toast.success(status === "DRAFT" ? "Quotation draft saved!" : "Quotation saved successfully!")
        router.push("/dashboard/quotations")
      } else {
        toast.error(res.error || "Failed to save quotation")
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const formData = form.watch()
  const pdfDoc = useMemo(
    () => (
      <InvoicePdf
        data={{
          ...formData,
          dueDate: formData.validUntil,
        }}
        company={company}
        clients={localClients}
      />
    ),
    [formData, company, localClients]
  )

  return (
    <div className="w-full max-w-full overflow-x-hidden font-sans select-none space-y-6 pb-20">
      {/* 1. Executive Top Bar matching CherryWorks PRO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/quotations"
            className="p-2 rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                {initialData ? `Edit Quotation (${form.watch("quotationNumber") || ""})` : "New Quotation (Proposal)"}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25">
                Times Works
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Draft commercial scope, pricing milestones, and convert approved deals to invoices.
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

          {pdfDoc && (
            <PDFDownloadLink
              document={pdfDoc}
              fileName={`timesworks-quotation-${formData.quotationNumber || "draft"}.pdf`}
            >
              {({ loading }: any) => (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="h-8.5 px-3 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          )}

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
            onClick={() => handleSave("SENT")}
            className="h-8.5 px-4 text-xs font-bold rounded-full bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs transition-all cursor-pointer"
          >
            <span>{isSaving ? "Saving..." : "Save Quotation"}</span>
            <Check className="h-3.5 w-3.5 ml-1.5 stroke-[3]" />
          </Button>
        </div>
      </div>

      {/* 2. Main Workspace */}
      {viewMode === "studio" && (
        <QuotationEditor
          form={form}
          clients={localClients}
          onAddClient={(newClient) => {
            setLocalClients((prev) => [newClient, ...prev])
            form.setValue("clientId", newClient.id)
          }}
          onSaveQuotation={() => handleSave("SENT")}
          isSaving={isSaving}
        />
      )}

      {viewMode === "canvas" && (
        <div className="py-4 flex justify-center">
          <div className="w-full max-w-[210mm]">
            <StaticInvoicePreview
              data={{
                ...formData,
                dueDate: formData.validUntil,
              }}
              company={company}
              clients={localClients}
            />
          </div>
        </div>
      )}
    </div>
  )
}
