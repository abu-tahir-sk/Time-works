import { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileSpreadsheet, FileSignature, Handshake, CheckCircle2, ArrowRight, Eye, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Document Templates | Times Works PRO",
  description: "Explore enterprise-ready templates for Invoices, Quotations, Estimates, and Legal Service Agreements.",
}

const TEMPLATES = [
  {
    id: "professional",
    name: "Executive Professional",
    category: "Invoicing & Billing",
    icon: FileSpreadsheet,
    badge: "Most Used",
    description: "Designed for corporate enterprises, consulting partnerships, and legal practices with structured 4-column metadata, anti-fraud security watermark layer, and bank wire remittance blocks.",
    features: ["4-Column Meta Grid", "Anti-Counterfeit Watermark Matrix", "ACH & Wire Box", "Strict Single-Page Engine"],
  },
  {
    id: "classic",
    name: "Corporate Classic",
    category: "Invoicing & Estimates",
    icon: FileSpreadsheet,
    badge: "Clean Standard",
    description: "Time-tested formal format with clean line dividers, boxed bill-to coordinates, and itemized tax breakdowns suitable for manufacturing, logistics, and wholesale commerce.",
    features: ["Formal Left Align Grid", "Tax & GST Compliance", "Custom Brand Accent", "Item Unit Rates"],
  },
  {
    id: "minimal",
    name: "Modern Minimalist",
    category: "Design & Tech",
    icon: FileSpreadsheet,
    badge: "Sleek",
    description: "Airy, high-contrast typographic layout favored by software studios, digital agencies, and creative freelancers who value elegance and white space.",
    features: ["High-Contrast Typography", "Generous Margin Rhythm", "Subtle Border Accents", "Dynamic Total Bar"],
  },
  {
    id: "quotation",
    name: "Commercial Proposal (Quote)",
    category: "Sales Pipeline",
    icon: FileSignature,
    badge: "High Conversion",
    description: "Engineered specifically for project bids, scope estimates, and contract negotiations with validity dates, acceptance milestones, and 1-click invoice conversion.",
    features: ["Validity Expiry Tracking", "Milestone Payment Schedule", "Terms & Conditions Clause", "1-Click Convert to Invoice"],
  },
  {
    id: "agreement",
    name: "Master Services Agreement (MSA)",
    category: "Legal & Contracts",
    icon: Handshake,
    badge: "Legal Grade",
    description: "Legally binding bilateral service contracts with 2-column balanced covenants, intellectual property protection, confidentiality clauses, and dual-party signature blocks.",
    features: ["2-Column Balanced Clauses Grid", "Scope of Work Section", "Dual-Party Execution Blocks", "Zero-Spillover A4 Guarantee"],
  },
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] dark:bg-[#111318] text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Production-Grade Document Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Precision Business Document Templates.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Every template is meticulously calibrated to guarantee strict 1-page PDF rendering without awkward text spillover or cramped typography.
          </p>
        </section>

        {/* Template Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon
            return (
              <Card
                key={tmpl.id}
                className="border border-border/80 bg-card rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-[#c82020]/10 text-[#c82020]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-foreground border border-border">
                      {tmpl.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c82020]">
                      {tmpl.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-0.5">{tmpl.name}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 space-y-1.5">
                    {tmpl.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11px] text-foreground/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#c82020]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link href="/dashboard/invoices/new" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-9 text-xs font-semibold border-border hover:bg-[#c82020] hover:text-white hover:border-[#c82020] transition-colors"
                    >
                      <span>Use This Template</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
        </section>

        {/* Anti-Fraud Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#c82020]/10 via-[#c82020]/5 to-transparent border border-[#c82020]/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#c82020]">
                <ShieldCheck className="h-4 w-4" />
                <span>ANTI-FRAUD WATERMARK PROTECTION</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                All templates include bank-grade security watermarks
              </h3>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                Configure repeating logo tiling, diagonal security watermarks, and cryptographic hash verification to ensure your invoices cannot be modified or forged.
              </p>
            </div>
            <Link href="/register">
              <Button className="h-10 px-6 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-bold shrink-0 shadow-xs">
                Create Free Workspace
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
