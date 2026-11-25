"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invoiceSchema, InvoiceFormValues } from "@/lib/invoices/schema"
import { defaultDesignSettings } from "@/lib/design-system/schema"
import { InvoiceEditor } from "./invoice-editor"
import { LivePaperCanvas } from "./live-paper-canvas"
import { InvoicePreview } from "./invoice-preview"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createOrUpdateInvoice } from "@/actions/invoices"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Eye,
  Save,
  Download,
  Check,
  Printer,
  Sparkles,
  LayoutTemplate,
  FileText,
  Columns,
  Share2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface InvoiceBuilderProps {
  clients: any[]
  company: any
  initialData?: any
}

type ViewMode = "studio" | "canvas" | "split"

export function InvoiceBuilder({ clients, company, initialData }: InvoiceBuilderProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("studio")
  const [localClients, setLocalClients] = useState<any[]>(clients)

  const form = useForm<any>({
    // @ts-ignore
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData ? {
      ...initialData,
      issueDate: new Date(initialData.issueDate),
      dueDate: new Date(initialData.dueDate),
      designSettings: initialData.designSettings || company?.designSettings || defaultDesignSettings,
      companyDetails: {
        name: initialData.companyDetails?.name || company?.name || "Times Works",
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
      currency: "USD",
      discountType: "PERCENTAGE",
      discountValue: 0,
      status: "DRAFT",
      paymentTerms: "NET 15 days",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      template: "professional",
      items: [
        {
          description: "Enterprise Financial Operations & Cloud Invoicing",
          quantity: 1,
          unit: "Month",
          unitPrice: 1250,
          taxRate: 0,
        },
        {
          description: "Senior Financial Partner Consultation",
          quantity: 8,
          unit: "Hour",
          unitPrice: 220,
          taxRate: 0,
        },
      ],
      notes: company?.defaultNotes || "Thank you for partnering with Times Works. We appreciate your business.",
      terms: company?.defaultTerms || "1. Payment is due within 15 calendar days of invoice date.\n2. Remittance via ACH / Wire or credit card.\n3. Late payments subject to 1.5% statutory monthly fee.",
      designSettings: company?.designSettings || defaultDesignSettings,
      companyDetails: {
        name: company?.name || "Times Works",
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
      const res = await createOrUpdateInvoice(data as InvoiceFormValues)
      if (res.success) {
        toast.success(status === "DRAFT" ? "Draft saved successfully" : "Invoice created successfully!")
        router.push("/dashboard/invoices")
      } else {
        toast.error(res.error || "Failed to save invoice")
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrintPDF = () => {
    setPreviewOpen(true)
    setTimeout(() => {
      window.print()
    }, 600)
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden font-sans select-none space-y-6 pb-20">
      {/* 1. Header Bar with CherryWorks / Wave & Invoice Generator Modes */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/invoices"
            className="p-2 rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                {initialData ? `Edit Invoice (${form.watch("invoiceNumber") || "Professional"})` : "New Invoice (Professional)"}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25">
                Times Works
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live WYSIWYG paper calculations with strict single-page PDF guarantee.
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
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "split"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-purple-600" />
              <span>Split View</span>
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
            onClick={() => handleSave("SENT")}
            className="h-8.5 px-4 text-xs font-bold rounded-full bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs transition-all cursor-pointer"
          >
            <span>{isSaving ? "Finalizing..." : "Create Invoice"}</span>
            <Check className="h-3.5 w-3.5 ml-1.5 stroke-[3]" />
          </Button>
        </div>
      </div>

      {/* 2. Main Workspace based on selected View Mode */}
      {viewMode === "studio" && (
        <InvoiceEditor
          form={form}
          clients={localClients}
          onAddClient={(newClient) => {
            setLocalClients((prev) => [newClient, ...prev])
            form.setValue("clientId", newClient.id)
          }}
          onCreateInvoice={() => handleSave("SENT")}
          isSaving={isSaving}
        />
      )}

      {viewMode === "canvas" && (
        <div className="py-4">
          <LivePaperCanvas
            form={form}
            company={company}
            clients={localClients}
          />
        </div>
      )}

      {viewMode === "split" && (
        <div className="grid grid-cols-12 gap-8 items-start w-full">
          <div className="col-span-7">
            <InvoiceEditor
              form={form}
              clients={localClients}
              onAddClient={(newClient) => {
                setLocalClients((prev) => [newClient, ...prev])
                form.setValue("clientId", newClient.id)
              }}
              onCreateInvoice={() => handleSave("SENT")}
              isSaving={isSaving}
            />
          </div>
          <div className="col-span-5 sticky top-6">
            <LivePaperCanvas
              form={form}
              company={company}
              clients={localClients}
            />
          </div>
        </div>
      )}

      {/* 3. Live Print/PDF Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-muted/30">
          <DialogHeader className="pb-3 border-b">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#c82020]" />
              <span>Times Works Professional Invoice Preview</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-2">
            <InvoicePreview form={form} company={company} clients={localClients} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
