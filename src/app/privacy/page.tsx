import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Times Works",
  description: "Our commitment to financial data security, GDPR compliance, and non-disclosure standards.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] dark:bg-[#111318] text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="space-y-2 border-b border-border/70 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Enterprise Data Governance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-xs text-muted-foreground">
              Last Updated: November 25, 2026 • Governed by Times Works Inc.
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">1. Introduction & Overview</h2>
              <p>
                Times Works Inc. (&ldquo;Times Works,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the Times Works financial and document automation platform. We are committed to protecting the confidentiality, integrity, and security of your personal data, customer financial records, invoices, and legal agreements.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">2. Information We Collect</h2>
              <p>
                When you create an account or utilize the Times Works workspace, we collect the following categories of information:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Credentials:</strong> Name, business email, encrypted password hashes, and optional 2FA phone numbers.</li>
                <li><strong>Organization Information:</strong> Company name, registered address, VAT/Tax identification number, company logo, and authorized representative titles.</li>
                <li><strong>Financial & Transaction Data:</strong> Client billing coordinates, itemized invoice descriptions, quantities, rates, tax calculations, expense receipts, and payment ledger entries.</li>
                <li><strong>Usage & Security Telemetry:</strong> Log timestamps, IP addresses for authentication verification, and device browser headers to detect unauthorized login attempts.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">3. How We Use and Protect Financial Information</h2>
              <p>
                We process your information exclusively to provide, maintain, and secure the Times Works services. We <strong>never sell, monetize, or license</strong> your customer lists, invoice totals, or legal agreements to any third parties or advertisers.
              </p>
              <p>
                All data is stored in isolated, encrypted PostgreSQL databases hosted in modern tier-IV data centers. Connections are enforced via TLS 1.3 with 256-bit AES encryption at rest and in transit.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">4. Compliance & Data Retention</h2>
              <p>
                Times Works complies with global data protection frameworks, including the EU General Data Protection Regulation (GDPR) and standard SOC-2 Type II controls. You retain full ownership of your data at all times and may request complete data export or account erasure by contacting our legal compliance team at <strong>legal@timesworks.com</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">5. Contact Information</h2>
              <p>
                If you have questions or concerns regarding our privacy practices or data processing agreements (DPA), please contact our Data Protection Officer:
              </p>
              <p className="font-mono text-xs text-foreground bg-muted p-3 rounded-md">
                Times Works Inc. • Data Privacy Office<br />
                Times Works Tower, Suite 400, Redmond, WA 98052, USA<br />
                Email: privacy@timesworks.com • Hotline: +1 (800) 555-0199
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
