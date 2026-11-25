import { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { HelpCircle, ChevronRight, FileSpreadsheet, ShieldCheck, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ & Help Center | Times Works PRO",
  description: "Answers to common questions regarding invoice creation, single-page PDF rendering, security watermarks, and ledger accounting.",
}

const FAQS = [
  {
    category: "Invoices & Documents",
    items: [
      {
        q: "How does Times Works guarantee single-page PDF output?",
        a: "Our document compiler computes exact vertical line heights, padding, and font metrics using standard A4 printable dimensions (595.28 x 841.89 points). By pairing structured items and 2-column clause grids, documents never accidentally spill onto an unwanted 2nd page.",
      },
      {
        q: "Can I convert an approved Quotation into an Invoice?",
        a: "Yes! Every quotation has a 1-click 'Convert to Invoice' action. It automatically ports the client information, line items, rates, taxes, and payment terms into a newly drafted invoice without manual re-typing.",
      },
      {
        q: "What document types can I create?",
        a: "Times Works supports 3 core document types: Invoices (standard, recurring, payment tracking), Quotations (client proposals, validity expiry), and Master Services Agreements (bilateral contracts with signatures).",
      },
    ],
  },
  {
    category: "Anti-Fraud Security & Watermarks",
    items: [
      {
        q: "What is Anti-Fraud Watermark Protection?",
        a: "Times Works embeds bank-grade security watermarks into generated PDFs. You can choose from Single Centered Logos, Full-Page Diagonal Text Tiling (e.g., CONFIDENTIAL, PAID, ORIGINAL), or Repeating Logo Matrices to prevent unauthorized invoice tampering.",
      },
      {
        q: "Can clients view and verify invoices online?",
        a: "Yes. Every invoice includes a tamper-proof public client portal link where clients can review itemized breakdowns, check payment due statuses, and verify authentic company credentials.",
      },
    ],
  },
  {
    category: "Accounting & Company Ledger",
    items: [
      {
        q: "How does the Company Ledger / Hisab Pati work?",
        a: "The Ledger tracks real-time operating inflow (recorded client invoice payments) against outflow (vendor expenses, payroll, software subscriptions, office overhead). It automatically computes Net Operating Margin and Cash Flow Balance.",
      },
      {
        q: "Can I record partial or split payments?",
        a: "Yes. In the Payments section, you can record multiple partial payments against an invoice (e.g. 50% deposit and 50% completion milestone). The invoice status transitions from DRAFT to PARTIAL and finally to PAID.",
      },
    ],
  },
  {
    category: "Billing & Plans",
    items: [
      {
        q: "Is there a completely free tier?",
        a: "Yes. The Free Starter plan allows generating up to 20 documents every month with full access to single-page PDF downloads, client records, and basic watermark settings.",
      },
      {
        q: "Can I export my data or financial reports?",
        a: "Yes. You can export your client list, invoices, and expense ledgers anytime as CSV spreadsheets or print comprehensive PDF financial analytics.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] dark:bg-[#111318] text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Knowledge Base & Answers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about Times Works PRO invoicing, PDF generation, security watermarks, and company accounting.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 mb-20">
          {FAQS.map((category, cIdx) => (
            <div key={cIdx} className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#c82020] border-b border-border/60 pb-2">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-5 rounded-xl border border-border/80 bg-card shadow-2xs space-y-2 hover:border-[#c82020]/40 transition-colors"
                  >
                    <h3 className="text-sm font-bold text-foreground flex items-center justify-between">
                      <span>{item.q}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Support Banner */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-xl bg-card border border-border/80 text-center space-y-4 shadow-2xs">
            <h3 className="text-xl font-bold text-foreground">Still have questions?</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Our financial engineering and technical support desk is available to assist your team with any custom requirement.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/contact">
                <Button className="h-9.5 px-5 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-bold shadow-xs">
                  Contact Support
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="h-9.5 px-5 text-xs font-semibold">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
