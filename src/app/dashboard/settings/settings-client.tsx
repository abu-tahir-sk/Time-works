"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  CreditCard,
  FileText,
  ShieldCheck,
  Save,
  Sparkles,
  Upload,
  Lock,
  Globe,
  Mail,
  Phone,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateCompanySettings } from "@/actions/company"

interface SettingsClientProps {
  initialCompany: any
  user: any
}

type TabType = "profile" | "bank" | "defaults" | "security"

export function SettingsClient({ initialCompany, user }: SettingsClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [isPending, startTransition] = useTransition()
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB")
      return
    }

    setIsUploadingLogo(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, name: file.name }),
        })
        const data = await res.json()
        if (data.success && data.url) {
          setLogoUrl(data.url)
          toast.success("Logo uploaded to ImgBB successfully!")
        } else {
          toast.error(data.error || "Failed to upload image to ImgBB")
        }
        setIsUploadingLogo(false)
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error("Error reading image file")
      setIsUploadingLogo(false)
    }
  }

  // Company Profile fields
  const [name, setName] = useState(initialCompany?.name || "Times Works")
  const [logoUrl, setLogoUrl] = useState(initialCompany?.logoUrl || "/logo-v3.jpg")
  const [email, setEmail] = useState(initialCompany?.email || "billing@timesworks.com")
  const [phone, setPhone] = useState(initialCompany?.phone || "+1 (800) 555-0199")
  const [website, setWebsite] = useState(initialCompany?.website || "https://timesworks.com")
  const [address, setAddress] = useState(
    initialCompany?.address || "Times Works Tower, Suite 400, Redmond, WA 98052, USA"
  )
  const [taxId, setTaxId] = useState(initialCompany?.taxId || "US-EIN-98-7654321")
  const [registrationNumber, setRegistrationNumber] = useState(initialCompany?.registrationNumber || "")

  // Bank & Remittance fields
  const [bankName, setBankName] = useState(initialCompany?.bankName || "Commercial Business Bank")
  const [accountName, setAccountName] = useState(initialCompany?.accountName || "Times Works LLC")
  const [accountNumber, setAccountNumber] = useState(initialCompany?.accountNumber || "987654321098")
  const [ifsc, setIfsc] = useState(initialCompany?.ifsc || "CHASUS33")
  const [upiId, setUpiId] = useState(initialCompany?.upiId || "timesworks@okaxis")
  const [paymentInstructions, setPaymentInstructions] = useState(
    initialCompany?.paymentInstructions || "Please remit via ACH / Wire or credit card. Mention invoice # as reference."
  )

  // Document Defaults
  const [defaultNotes, setDefaultNotes] = useState(
    initialCompany?.defaultNotes || "Thank you for partnering with Times Works. We appreciate your business."
  )
  const [defaultTerms, setDefaultTerms] = useState(
    initialCompany?.defaultTerms ||
      "1. Payment is due within 15 calendar days of invoice date.\n2. Remittance via ACH / Wire or credit card.\n3. Late payments subject to 1.5% statutory monthly fee."
  )

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const payload = {
        name,
        logoUrl: logoUrl || undefined,
        email: email || undefined,
        phone: phone || undefined,
        website: website || undefined,
        address: address || undefined,
        taxId: taxId || undefined,
        registrationNumber: registrationNumber || undefined,
        bankName: bankName || undefined,
        accountName: accountName || undefined,
        accountNumber: accountNumber || undefined,
        ifsc: ifsc || undefined,
        upiId: upiId || undefined,
        paymentInstructions: paymentInstructions || undefined,
        defaultNotes: defaultNotes || undefined,
        defaultTerms: defaultTerms || undefined,
      }

      const res = await updateCompanySettings(payload)
      if (res.success) {
        toast.success("Settings updated successfully")
        router.refresh()
      } else {
        toast.error(res.error || "Failed to update settings")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Settings</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25">
              Times Works Configuration
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure your enterprise company profile, bank accounts, invoice terms, and tax credentials.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleSaveSettings}
          disabled={isPending}
          className="h-9 px-4 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/60 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "profile"
              ? "bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Company Profile
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bank")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "bank"
              ? "bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Bank & Remittance
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("defaults")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "defaults"
              ? "bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Document Defaults
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "security"
              ? "bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/30"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Security & Plan
        </button>
      </div>

      {/* 3. Tab Contents */}
      <form onSubmit={handleSaveSettings}>
        {activeTab === "profile" && (
          <Card className="border border-border/80 shadow-xs rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold text-foreground">Company & Brand Information</CardTitle>
              <CardDescription className="text-xs">
                This information appears on all generated Invoices, Quotations, and Legal Agreements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Business Name *</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 text-xs rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Logo Image URL</Label>
                    <label className="text-[11px] font-medium text-[#c82020] hover:text-[#a81a1a] cursor-pointer flex items-center gap-1">
                      {isUploadingLogo ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading to ImgBB...
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3" /> Upload Logo (ImgBB)
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoFileUpload}
                        disabled={isUploadingLogo}
                      />
                    </label>
                  </div>
                  <Input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/logo-v3.jpg"
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Official Billing Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Telephone / Mobile</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Website</Label>
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Tax ID / GSTIN / EIN</Label>
                  <Input
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="h-9 text-xs rounded-xl font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Company Registration #</Label>
                  <Input
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="CIN / LLC-98762"
                    className="h-9 text-xs rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Registered Business Address</Label>
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-xs rounded-xl min-h-[70px]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "bank" && (
          <Card className="border border-border/80 shadow-xs rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold text-foreground">Bank Remittance & Settlement Details</CardTitle>
              <CardDescription className="text-xs">
                These banking instructions are presented to clients on invoices and the public payment portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Beneficiary Account Name</Label>
                  <Input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Bank Name</Label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Account Number / IBAN</Label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Routing / Swift / IFSC Code</Label>
                  <Input
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="h-9 text-xs rounded-xl font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">UPI ID / Virtual Address</Label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="company@bank"
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Custom Remittance Instructions</Label>
                <Textarea
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                  className="text-xs rounded-xl min-h-[70px]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "defaults" && (
          <Card className="border border-border/80 shadow-xs rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold text-foreground">Document Defaults & Standard Terms</CardTitle>
              <CardDescription className="text-xs">
                Default notes and legal terms auto-populated when creating new Invoices and Quotations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Standard Client Notes</Label>
                <Textarea
                  value={defaultNotes}
                  onChange={(e) => setDefaultNotes(e.target.value)}
                  className="text-xs rounded-xl min-h-[80px]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Standard Payment Terms & Conditions</Label>
                <Textarea
                  value={defaultTerms}
                  onChange={(e) => setDefaultTerms(e.target.value)}
                  className="text-xs rounded-xl min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "security" && (
          <Card className="border border-border/80 shadow-xs rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold text-foreground">Security & Workspace Governance</CardTitle>
              <CardDescription className="text-xs">
                User access privileges, authentication telemetry, and multi-tenant isolation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Signed In As</span>
                  <span className="font-semibold text-foreground">{user?.name || "Business User"}</span>
                  <span className="block text-muted-foreground text-[11px]">{user?.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Workspace Access</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    Unlimited Full Access
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Security Level</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#c82020] dark:text-rose-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Enterprise Isolation
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2 text-xs">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#c82020]" />
                  Two-Factor Authentication & Tamper Protection
                </h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Every document produced under your company workspace receives a cryptographic audit token and optional anti-fraud watermark tiling to prevent invoice tampering.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="h-9 px-5 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
