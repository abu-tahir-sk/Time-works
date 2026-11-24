"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { quotationSchema, QuotationFormValues } from "@/lib/quotations/schema"
import { defaultDesignSettings } from "@/lib/design-system/schema"
import { QuotationEditor } from "./quotation-editor"
import { StaticInvoicePreview } from "@/components/invoices/invoice-preview"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createOrUpdateQuotation } from "@/actions/quotations"
import { useRouter } from "next/navigation"

interface QuotationBuilderProps {
    clients: any[]
    company: any
    initialData?: any
}

export function QuotationBuilder({ clients, company, initialData }: QuotationBuilderProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
    const [localClients, setLocalClients] = useState<any[]>(clients)

    const form = useForm<any>({
        resolver: zodResolver(quotationSchema),
        defaultValues: initialData ? {
            ...initialData,
            issueDate: new Date(initialData.issueDate),
            validUntil: new Date(initialData.validUntil),
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
            quotationNumber: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            currency: "USD",
            discountType: "PERCENTAGE",
            discountValue: 0,
            status: "DRAFT",
            issueDate: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days validity
            template: "classic",
            items: [
                {
                    description: "Enterprise Digital Workflow Transformation",
                    quantity: 1,
                    unit: "Project",
                    unitPrice: 3500,
                    taxRate: 10,
                },
                {
                    description: "Custom Cloud API & Microsoft Dynamics 365 Architecture",
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
            notes: company?.defaultNotes || "Times Digitals delivers enterprise document workflow infrastructure with a 99.99% uptime SLA.",
            terms: company?.defaultTerms || "1. Quotation is valid for 30 calendar days from issue date.\n2. 50% advance upon project authorization, 50% upon final acceptance milestone.\n3. Applicable statutory taxes extra as billed.",
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
            const res = await createOrUpdateQuotation(data as QuotationFormValues)
            if (res.success) {
                toast.success("Quotation saved successfully!")
                router.push("/dashboard/quotations")
            } else {
                toast.error(res.error || "Failed to save quotation")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    const formData = form.watch()

    return (
        <div className="flex h-full flex-col md:flex-row overflow-hidden bg-muted/30">
            {/* Mobile Navigation Tabs */}
            <div className="md:hidden flex border-b bg-background">
                <button
                    onClick={() => setActiveTab("edit")}
                    className={`flex-1 py-3 text-sm font-medium ${activeTab === "edit" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                >
                    Edit Form
                </button>
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 py-3 text-sm font-medium ${activeTab === "preview" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                >
                    Live Preview
                </button>
            </div>

            {/* Left: Editor Panel */}
            <div className={`w-full md:w-1/2 flex-col overflow-y-auto border-r bg-background ${activeTab === "preview" ? "hidden md:flex" : "flex"}`}>
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">Create Quotation</h2>
                        <p className="text-xs text-muted-foreground">Draft an estimate or sales quote</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/quotations")}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Quotation"}
                        </Button>
                    </div>
                </div>

                <div className="p-4 md:p-6">
                    <QuotationEditor
                        form={form}
                        clients={localClients}
                        onAddClient={(newClient) => setLocalClients((prev) => [...prev, newClient])}
                    />
                </div>
            </div>

            {/* Right: Live Preview Panel */}
            <div className={`w-full md:w-1/2 flex-col overflow-y-auto bg-muted/40 ${activeTab === "edit" ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 flex justify-center min-h-full">
                    {/* Live Preview using unified preview engine */}
                    <StaticInvoicePreview
                        data={{
                            ...formData,
                            invoiceNumber: formData.quotationNumber, // Displays Quote No in place of Invoice No
                            dueDate: formData.validUntil // Maps Valid Until to preview
                        }}
                        company={company}
                        clients={localClients}
                    />
                </div>
            </div>
        </div>
    )
}