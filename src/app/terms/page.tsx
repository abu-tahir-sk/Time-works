import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Times Works",
  description: "Enterprise master service agreement, licensing terms, and billing conditions for Times Works.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] dark:bg-[#111318] text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="space-y-2 border-b border-border/70 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020]">
              <FileText className="h-3.5 w-3.5" />
              <span>Standard Commercial Terms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-xs text-muted-foreground">
              Effective Date: November 25, 2026 • Governed by the Laws of the State of Washington, USA
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By registering, accessing, or utilizing the services provided by Times Works Inc. (&ldquo;Times Works&rdquo;), you agree to be legally bound by these Terms of Service. If you are entering into this agreement on behalf of a corporate entity, you warrant that you have full legal authority to bind said entity.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">2. Authorized Use & Account Responsibility</h2>
              <p>
                You are responsible for maintaining the confidentiality of your workspace login credentials, two-factor authentication tokens, and authorized user permissions. You agree not to utilize the service to transmit unlawful materials, generate fraudulent or counterfeit invoices, or infringe upon third-party intellectual property.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">3. Document Ownership & Intellectual Property</h2>
              <p>
                All documents, customer records, line items, and proprietary agreements authored within your Times Works workspace remain your exclusive property. Times Works claims no ownership or proprietary copyright over customer billing data. Times Works owns the underlying software architecture, design systems, algorithms, and single-page PDF rendering engine.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">4. Service Access & Workspace Governance</h2>
              <p>
                Times Works provides unrestricted access to document automation, invoices, quotations, legal contracts, and financial bookkeeping. Users retain full ownership and copyright of all company data, documents, and client records produced within their workspace.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">5. Service Level Agreement (SLA) & Limitation of Liability</h2>
              <p>
                Times Works strives to maintain a 99.99% cloud service uptime. In no event shall Times Works Inc. be liable for indirect, punitive, or consequential damages resulting from network interruption, client non-payment, or third-party bank processing delays.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">6. Contact & Legal Inquiries</h2>
              <p>
                For questions regarding enterprise service contracts, dispute resolution, or licensing terms, contact:
              </p>
              <p className="font-mono text-xs text-foreground bg-muted p-3 rounded-md">
                Times Works Inc. • Legal Counsel<br />
                Times Works Tower, Suite 400, Redmond, WA 98052, USA<br />
                Email: legal@timesworks.com • Phone: +1 (800) 555-0199
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
