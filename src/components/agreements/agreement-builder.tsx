"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    FileText,
    Loader2,
    Plus,
    RefreshCw,
} from "lucide-react"
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer"

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
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AgreementBuilderProps {
    clients: any[]
    company: any
}

export function AgreementBuilder({ clients, company }: AgreementBuilderProps) {
    const router = useRouter()
    const [previewReady, setPreviewReady] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
    const [data, setData] = useState<AgreementFormValues>(() => ({
        title: "Master Services Agreement (MSA)",
        agreementNumber: `AGR-${new Date().getFullYear()}-${Math.floor(
            1000 + Math.random() * 9000
        )}`,
        type: "SERVICE_AGREEMENT",
        clientId: "",
        clientName: "Acme Global Corporation",
        clientEmail: "accounts@acmeglobal.com",
        clientAddress: "750 7th Avenue, 18th Floor, New York, NY 10019, USA",
        clientCompany: "Acme Global Corporation",
        effectiveDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10),
        value: "6000",
        currency: "USD",
        paymentTerms: "Net 30",
        scope: "Times Works shall design, provision, configure, and maintain enterprise document workflows, custom billing synchronizers, and digital signature automation infrastructure under the agreed service level standards.",
        clauses: DEFAULT_CLAUSES_BY_TYPE.SERVICE_AGREEMENT,
        notes: "Governed by the standard commercial master service provisions of Times Works PRO.",
        companyDetails: {
            name: company?.name || "Times Works",
            address: company?.address || "Times Works Tower, Suite 400, Redmond, WA 98052, USA",
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

    const setCompanyDetail = (
        key: keyof AgreementFormValues["companyDetails"],
        value: string
    ) =>
        setData((prev) => ({
            ...prev,
            companyDetails: { ...prev.companyDetails, [key]: value },
        }))

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
            clientCompany: client.company || prev.clientCompany,
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

    const handleSave = async () => {
        if (!data.clientId) {
            toast.error("Please select an existing client before saving", {
                description: "Manual entries can be downloaded as PDF, but agreements must be linked to a client to save.",
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
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    const fileName = useMemo(
        () =>
            `${data.agreementNumber}-${data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")}.pdf`,
        [data.agreementNumber, data.title]
    )

    return (
        <div className="flex h-full flex-col md:flex-row overflow-hidden bg-background">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex border-b bg-background shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        activeTab === "edit"
                            ? "border-b-2 border-[#c82020] text-[#c82020]"
                            : "text-muted-foreground"
                    }`}
                >
                    Edit Agreement
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        activeTab === "preview"
                            ? "border-b-2 border-[#c82020] text-[#c82020]"
                            : "text-muted-foreground"
                    }`}
                >
                    Live PDF Preview
                </button>
            </div>

            {/* Left: form */}
            <div className={`w-full md:w-1/2 flex-col overflow-y-auto border-r bg-background ${activeTab === "preview" ? "hidden md:flex" : "flex"}`}>
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Create Agreement
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Draft a professional agreement and download it as a PDF
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/dashboard/agreements")}
                        >
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving…" : "Save Agreement"}
                        </Button>
                    </div>
                </div>

                <div className="space-y-6 p-4 md:p-6">
                    {/* Agreement basics */}
                    <Card>
                        <CardContent className="space-y-4 p-4 md:p-5">
                            <p className="text-sm font-semibold">Agreement Details</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Agreement title</Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) => set("title", e.target.value)}
                                        placeholder="Service Agreement"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Agreement number</Label>
                                    <Input
                                        value={data.agreementNumber}
                                        onChange={(e) =>
                                            set("agreementNumber", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Agreement type</Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(v: string | null) =>
                                            handleTypeChange(
                                                (v ?? "SERVICE_AGREEMENT") as AgreementType
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
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
                                    <p className="text-xs text-muted-foreground">
                                        Choosing a type loads standard clauses — you can edit
                                        them below.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client */}
                    <Card>
                        <CardContent className="space-y-4 p-4 md:p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">Client</p>
                                {data.clientId ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setData((prev) => ({
                                                ...prev,
                                                clientId: "",
                                            }))
                                        }
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Enter manually
                                    </Button>
                                ) : null}
                            </div>
                            {clients.length > 0 && !data.clientId ? (
                                <div className="space-y-2">
                                    <Label>Select an existing client</Label>
                                    <Select
                                        value=""
                                        onValueChange={(v: string | null) =>
                                            v && handleClientChange(v)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose a client…" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem key={client.id} value={client.id}>
                                                    {client.name}
                                                    {client.company ? ` — ${client.company}` : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : null}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Contact name *</Label>
                                    <Input
                                        value={data.clientName}
                                        onChange={(e) => set("clientName", e.target.value)}
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input
                                        value={data.clientCompany}
                                        onChange={(e) => set("clientCompany", e.target.value)}
                                        placeholder="Acme Corp"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={data.clientEmail}
                                        onChange={(e) => set("clientEmail", e.target.value)}
                                        placeholder="jane@acme.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input
                                        value={data.clientAddress}
                                        onChange={(e) => set("clientAddress", e.target.value)}
                                        placeholder="City, State"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Terms */}
                    <Card>
                        <CardContent className="space-y-4 p-4 md:p-5">
                            <p className="text-sm font-semibold">Terms &amp; Value</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Effective date *</Label>
                                    <Input
                                        type="date"
                                        value={data.effectiveDate}
                                        onChange={(e) => set("effectiveDate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Expiry date *</Label>
                                    <Input
                                        type="date"
                                        value={data.expiryDate}
                                        onChange={(e) => set("expiryDate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Agreement value</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.value}
                                        onChange={(e) => set("value", e.target.value)}
                                        placeholder="500000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Select
                                        value={data.currency}
                                        onValueChange={(v: string | null) =>
                                            set("currency", v ?? "INR")
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                            <SelectItem value="AED">AED (د.إ)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Payment terms</Label>
                                    <Input
                                        value={data.paymentTerms}
                                        onChange={(e) => set("paymentTerms", e.target.value)}
                                        placeholder="Net 30, 50% advance, Milestone-based…"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content */}
                    <Card>
                        <CardContent className="space-y-4 p-4 md:p-5">
                            <p className="text-sm font-semibold">Agreement Content</p>
                            <div className="space-y-2">
                                <Label>Scope of work</Label>
                                <Textarea
                                    rows={3}
                                    value={data.scope}
                                    onChange={(e) => set("scope", e.target.value)}
                                    placeholder="Describe the services, deliverables and timelines…"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Terms &amp; clauses</Label>
                                <Textarea
                                    rows={12}
                                    className="font-mono text-xs"
                                    value={data.clauses}
                                    onChange={(e) => set("clauses", e.target.value)}
                                    placeholder="1. SCOPE OF WORK…"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Each numbered clause renders as a paragraph in the PDF.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Additional notes (optional)</Label>
                                <Textarea
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) => set("notes", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company */}
                    <Card>
                        <CardContent className="space-y-4 p-4 md:p-5">
                            <p className="text-sm font-semibold">Your Company</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Company name</Label>
                                    <Input
                                        value={data.companyDetails.name}
                                        onChange={(e) =>
                                            setCompanyDetail("name", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax ID</Label>
                                    <Input
                                        value={data.companyDetails.taxId}
                                        onChange={(e) =>
                                            setCompanyDetail("taxId", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label>Address</Label>
                                    <Textarea
                                        rows={2}
                                        value={data.companyDetails.address}
                                        onChange={(e) =>
                                            setCompanyDetail("address", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={data.companyDetails.email}
                                        onChange={(e) =>
                                            setCompanyDetail("email", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        value={data.companyDetails.phone}
                                        onChange={(e) =>
                                            setCompanyDetail("phone", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right: PDF preview */}
            <div className={`w-full md:w-1/2 flex-col overflow-y-auto bg-white ${activeTab === "edit" ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b bg-background flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        Live PDF preview
                    </div>
                    <PDFDownloadLink
                        document={<AgreementPdf data={data} />}
                        fileName={fileName}
                        style={{ textDecoration: "none" }}
                    >
                        {({ loading, error }) => {
                            if (error) toast.error("PDF generation failed")
                            return (
                                <Button size="sm" disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                    {loading ? "Preparing…" : "Download PDF"}
                                </Button>
                            )
                        }}
                    </PDFDownloadLink>
                </div>
                <div className="p-4 flex justify-center min-h-full">
                    <div className="w-full h-[calc(100vh-220px)] rounded-lg overflow-hidden bg-white shadow-sm">
                        <PDFViewer
                            width="100%"
                            height="100%"
                            showToolbar={false}
                            key={previewReady ? "ready" : "init"}
                        >
                            <AgreementPdf data={data} />
                        </PDFViewer>
                    </div>
                </div>
            </div>
        </div>
    )
}
