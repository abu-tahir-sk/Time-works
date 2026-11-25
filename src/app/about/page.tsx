import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Award, Users, Building2, CheckCircle2, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Times Works",
  description: "Learn about the mission, engineering standards, and values powering Times Works financial platforms.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] dark:bg-[#111318] text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
            <Building2 className="h-3.5 w-3.5" />
            <span>Enterprise Financial Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
            Built to Eliminate Friction in Business Finance.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Times Works was founded on a simple premise: enterprise financial documents should be exact, elegant, secure, and effortless to generate.
          </p>
        </section>

        {/* Company Overview Cards */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-xl border border-border/80 bg-card shadow-2xs space-y-3">
            <div className="p-2.5 rounded-lg bg-[#c82020]/10 text-[#c82020] w-fit">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Zero-Spillover Precision</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We developed our custom mathematical rendering engine to guarantee that invoices and legal agreements fit on exactly one A4 page without awkward overflow or cramped text.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 bg-card shadow-2xs space-y-3">
            <div className="p-2.5 rounded-lg bg-[#c82020]/10 text-[#c82020] w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Anti-Counterfeit Protection</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Modern billing requires fraud prevention. Our integrated watermark layer protects enterprises from invoice tampering, impersonation, and fraudulent remittance alteration.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 bg-card shadow-2xs space-y-3">
            <div className="p-2.5 rounded-lg bg-[#c82020]/10 text-[#c82020] w-fit">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Integrated Cash Flow</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              From the initial quotation and signed agreement to client payment collection and operating expense ledger, everything connects in real-time.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-border/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Our Mission & Standards
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Most billing software was designed 15 years ago—clunky, multi-page PDFs with broken headers, missing tax compliance, and zero integration with actual cash flow accounting.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Times Works delivers a unified platform following Microsoft Fluent and Fortune 500 standards. Whether you are generating a 10-line consulting bill or managing complex master services agreements, your documents communicate prestige and precision.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#c82020]" />
                  <span>99.99% Cloud Uptime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#c82020]" />
                  <span>Bank-Grade Encryption</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-muted/20 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#c82020]">Corporate Headquarters</span>
                <h4 className="text-base font-bold text-foreground">Times Works Inc.</h4>
                <p className="text-xs text-muted-foreground">Times Works Tower, Suite 400</p>
                <p className="text-xs text-muted-foreground">Redmond, WA 98052, USA</p>
              </div>

              <div className="pt-3 border-t border-border/60 space-y-1 text-xs">
                <p><strong className="text-foreground">Official Inquiries:</strong> <span className="text-muted-foreground">contact@timesworks.com</span></p>
                <p><strong className="text-foreground">Billing Support:</strong> <span className="text-muted-foreground">billing@timesworks.com</span></p>
                <p><strong className="text-foreground">Support Hotline:</strong> <span className="text-muted-foreground">+1 (800) 555-0199</span></p>
              </div>

              <Link href="/contact" className="block pt-2">
                <Button className="w-full h-9 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-bold shadow-xs">
                  Get in Touch
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
