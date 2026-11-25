import { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, Sparkles, ShieldCheck, Zap, ArrowRight, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing & Plans | Times Works PRO",
  description: "Transparent, predictable enterprise billing plans for freelancers, consulting teams, and large enterprises.",
}

const PLANS = [
  {
    name: "Starter",
    badge: "Free Forever",
    price: "$0",
    period: "/month",
    description: "Ideal for freelancers and solopreneurs getting started with client billing.",
    highlight: false,
    cta: "Start Free",
    ctaLink: "/register",
    features: [
      "Up to 20 documents / month (Invoices, Quotes, Agreements)",
      "Strict single-page PDF generator",
      "5 Executive PDF templates (Professional, Classic, Minimal)",
      "Multi-currency support (USD, EUR, GBP, INR, BDT)",
      "Basic Watermark Anti-Fraud Security",
      "Client Management directory",
      "Email PDF dispatch",
    ],
  },
  {
    name: "Professional",
    badge: "Most Popular",
    price: "$29",
    period: "/month",
    description: "Built for scaling agencies, law firms, and consultancy businesses.",
    highlight: true,
    cta: "Upgrade to Pro",
    ctaLink: "/register?plan=pro",
    features: [
      "Unlimited Invoices, Quotations & Agreements",
      "Custom Logo & Text Watermark Security Matrix",
      "Full Accounting & Expense Ledger (Cash Flow, P&L)",
      "Convert Approved Quotations to Invoices in 1-Click",
      "Public Client Payment & Approval Portals",
      "Automated Payment Due Reminders & Tracking",
      "Financial Analytics, Balance Sheet & Export CSV",
      "Priority 24/7 SLA Support",
    ],
  },
  {
    name: "Enterprise",
    badge: "Full Governance",
    price: "$79",
    period: "/month",
    description: "For corporate finance teams requiring multi-entity governance & custom compliance.",
    highlight: false,
    cta: "Contact Enterprise",
    ctaLink: "/contact",
    features: [
      "Everything in Professional plan",
      "Dedicated Database Branching & Custom Postgres URLs",
      "Multi-user RBAC & Audit Trail Logging",
      "Custom Contract Clauses & Legal Agreement Templates",
      "Custom Domain for Client Portals (pay.yourbrand.com)",
      "Bank Reconciliation & ERP Integration",
      "SOC-2 Type II Compliance Reports",
      "Dedicated Account Manager",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] dark:bg-[#111318] text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Header */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Transparent Enterprise Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Simple, Scalable Plans for Modern Finance.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business scale. No hidden fees, instant setup, and cancel anytime.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {PLANS.map((plan, idx) => (
            <Card
              key={idx}
              className={`relative flex flex-col justify-between border rounded-xl transition-all duration-200 ${
                plan.highlight
                  ? "border-[#c82020] shadow-md ring-2 ring-[#c82020]/20 bg-background"
                  : "border-border/80 bg-card shadow-2xs hover:shadow-xs"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#c82020] text-white uppercase tracking-wider shadow-xs">
                  {plan.badge}
                </div>
              )}

              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-lg font-bold text-foreground">{plan.name}</CardTitle>
                  {!plan.highlight && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                  {plan.description}
                </CardDescription>

                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2.5 pt-4 border-t border-border/60">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Included capabilities:
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-foreground/90">
                        <Check className="h-4 w-4 shrink-0 text-[#c82020] mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={plan.ctaLink} className="w-full">
                  <Button
                    className={`w-full h-10 text-xs font-bold rounded-md transition-all ${
                      plan.highlight
                        ? "bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs"
                        : "bg-muted/80 hover:bg-muted text-foreground border border-border"
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Feature Comparison Highlights */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-border/60">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions About Billing
            </h2>
            <p className="text-xs text-muted-foreground">Everything you need to know about payments & terms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border bg-card space-y-1.5">
              <h3 className="font-bold text-foreground">Can I switch plans anytime?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from Workspace Settings.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-1.5">
              <h3 className="font-bold text-foreground">What happens when I hit the free limit?</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Starter tier includes 20 documents every month. Existing documents remain accessible forever with zero data loss.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-1.5">
              <h3 className="font-bold text-foreground">Do you support international taxes?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes! We support custom VAT, GST, Sales Tax, and multi-currency exchange across 150+ countries.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-1.5">
              <h3 className="font-bold text-foreground">Is my financial data secure?</h3>
              <p className="text-muted-foreground leading-relaxed">
                All invoices, clients, and accounting ledgers are encrypted with bank-grade AES-256 protocols on serverless Postgres.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
