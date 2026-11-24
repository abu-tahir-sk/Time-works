"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invoiceSchema, InvoiceFormValues } from "@/lib/invoices/schema"
import { defaultDesignSettings } from "@/lib/design-system/schema"
import { InvoiceEditor } from "./invoice-editor"
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
  FileSpreadsheet,
  Printer,
  Sparkles,
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

export function InvoiceBuilder({ clients, company, initialData }: InvoiceBuilderProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
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
    <div className="w-full font-sans select-none space-y-6 pb-20">
      {/* 1. Header Bar matching Image 1: "New Invoice (Professional)" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
            {initialData ? `Edit Invoice (${form.watch("invoiceNumber") || "Professional"})` : "New Invoice (Professional)"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create a new invoice using the Professional template and automated tax calculations.
          </p>
        </div>

        {/* Top Right Action Buttons (Image 1) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/invoices")}
            className="h-8.5 px-3 text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="h-8.5 px-3 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Preview
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
            variant="outline"
            size="sm"
            onClick={handlePrintPDF}
            className="h-8.5 px-3 text-xs font-semibold border-border/80 shadow-2xs hover:bg-muted hidden sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Export PDF
          </Button>

          <Button
            size="sm"
            disabled={isSaving}
            onClick={() => handleSave("SENT")}
            className="h-8.5 px-4 text-xs font-bold rounded-full bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs transition-all cursor-pointer"
          >
            <span>{isSaving ? "Creating..." : "Create Invoice"}</span>
            <Check className="h-3.5 w-3.5 ml-1.5 stroke-[3]" />
          </Button>
        </div>
      </div>

      {/* 2. Main Form Content */}
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

      {/* 3. Live Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-muted/30">
          <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#c82020]" />
              <span>Invoice Preview</span>
            </DialogTitle>
            <Button size="sm" variant="outline" onClick={() => window.print()} className="h-7 text-xs mr-4">
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print / Save PDF
            </Button>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <InvoicePreview form={form} company={company} clients={localClients} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
