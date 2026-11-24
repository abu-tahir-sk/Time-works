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

interface InvoiceBuilderProps {
  clients: any[]
  company: any
  initialData?: any
}

export function InvoiceBuilder({ clients, company, initialData }: InvoiceBuilderProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
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
        name: initialData.companyDetails?.name || (company?.name && !company.name.includes("'s Company") ? company.name : "Times Digitals"),
        address: initialData.companyDetails?.address || company?.address || "Times Digitals Tower, Suite 400, Redmond, WA 98052, USA",
        email: initialData.companyDetails?.email || company?.email || "billing@timesdigitals.com",
        phone: initialData.companyDetails?.phone || company?.phone || "+1 (800) 555-0199",
        taxId: initialData.companyDetails?.taxId || company?.taxId || "US-EIN-98-7654321",
        logoUrl: initialData.companyDetails?.logoUrl || company?.logoUrl || "/logo-v3.jpg",
        signatureUrl: initialData.companyDetails?.signatureUrl ?? company?.signatureUrl ?? "",
        sealUrl: initialData.companyDetails?.sealUrl ?? company?.sealUrl ?? "",
      }
    } : {
      clientId: "",
      currency: "USD",
      discountType: "PERCENTAGE",
      discountValue: 0,
      status: "DRAFT",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      template: "classic",
      items: [
        {
          description: "Enterprise Cloud Document Platform",
          quantity: 1,
          unit: "Year",
          unitPrice: 2400,
          taxRate: 10,
        },
        {
          description: "Microsoft Azure & Dynamics Integration",
          quantity: 1,
          unit: "Service",
          unitPrice: 850,
          taxRate: 10,
        },
        {
          description: "Dedicated 24/7 Enterprise SLA Support",
          quantity: 1,
          unit: "Month",
          unitPrice: 500,
          taxRate: 10,
        },
      ],
      notes: company?.defaultNotes || "Thank you for choosing Times Digitals as your trusted document solutions provider.",
      terms: company?.defaultTerms || "1. Payment is due within 14 calendar days of invoice date.\n2. Remittance via wire transfer to JPMorgan Chase Bank, N.A. (A/C: 9876 5432 1098, Routing: CHASUS33XXX).\n3. Late payments may incur standard statutory interest.",
      designSettings: company?.designSettings || defaultDesignSettings,
      companyDetails: {
        name: company?.name && !company.name.includes("'s Company") ? company.name : "Times Digitals",
        address: company?.address || "Times Digitals Tower, Suite 400, Redmond, WA 98052, USA",
        email: company?.email || "billing@timesdigitals.com",
        phone: company?.phone || "+1 (800) 555-0199",
        taxId: company?.taxId || "US-EIN-98-7654321",
        logoUrl: company?.logoUrl || "/logo-v3.jpg",
        signatureUrl: company?.signatureUrl || "",
        sealUrl: company?.sealUrl || "",
      }
    }
  })

  async function onSubmit(data: any) {
    setIsSaving(true)
    try {
      const res = await createOrUpdateInvoice(data as InvoiceFormValues)
      if (res.success) {
        toast.success("Invoice saved successfully")
        router.push("/dashboard/invoices")
      } else {
        toast.error(res.error || "Failed to save invoice")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // To build a truly split-screen editor on desktop, and tabs on mobile
  return (
    <div className="flex h-full flex-col md:flex-row overflow-hidden bg-muted/40">
      {/* Mobile Tabs */}
      <div className="md:hidden flex border-b bg-background">
        <button 
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "edit" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
        >
          Edit
        </button>
        <button 
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "preview" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
        >
          Preview
        </button>
      </div>

      {/* Editor Panel */}
      <div className={`w-full md:w-1/2 flex-col overflow-y-auto border-r bg-background ${activeTab === "preview" ? "hidden md:flex" : "flex"}`}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
          <h2 className="text-lg font-semibold">Invoice Builder</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/invoices")}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <InvoiceEditor form={form} clients={localClients} onAddClient={(newClient) => setLocalClients((prev) => [...prev, newClient])} />
        </div>
      </div>

      {/* Preview Panel */}
      <div className={`w-full md:w-1/2 flex-col overflow-y-auto bg-muted ${activeTab === "edit" ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 flex justify-center min-h-full">
          <InvoicePreview form={form} company={company} clients={localClients} />
        </div>
      </div>
    </div>
  )
}
