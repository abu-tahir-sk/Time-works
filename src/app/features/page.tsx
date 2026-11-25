"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  FileText,
  FileSignature,
  FileCheck2,
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Database,
  Globe2,
  Check,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Receipt,
  PieChart,
  Sliders,
  Scale,
  Users2,
  Server
} from "lucide-react"

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "quotations" | "agreements" | "ledger" | "security">("invoices")

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-[#c82020]/15">
      <Navbar />

      <main className="flex-1">
        {/* 1. MICROSOFT FLUENT EXECUTIVE HERO */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-border/80 bg-linear-to-b from-muted/30 via-background to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25">
                <Building2 className="h-3.5 w-3.5" />
                <span>Times Works Enterprise Operational Suite</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
                Enterprise Financial Operations & Document Automation.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Engineered for corporate consultancies, agencies, and high-performance businesses. Deliver single-page executive invoices, commercial deal quotations, bilateral legal contracts, and live cash flow accounting without fragmentation.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/dashboard">
                  <Button className="h-11 px-7 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold rounded-md shadow-xs">
                    Launch Workspace
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" className="h-11 px-6 text-xs font-semibold border-border/80 hover:bg-muted">
                    Explore A4 Templates
                  </Button>
                </Link>
              </div>
            </div>

            {/* Microsoft 365 / Azure Portal Style Live Interface Showcase */}
            <div className="rounded-xl border border-border/80 bg-card shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden">
              {/* Window Titlebar */}
              <div className="h-11 bg-muted/60 border-b border-border/70 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <span className="text-xs font-semibold text-muted-foreground ml-3 flex items-center gap-1.5 font-mono">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    timesworks.cloud // executive-financial-ops // live-instance
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-background border border-border/60">Times Works v2.4</span>
                  <span className="text-emerald-600 font-medium">99.99% Cloud Sync</span>
                </div>
              </div>

              {/* Showcase Interior (Realistic Executive Workspace) */}
              <div className="p-4 sm:p-6 lg:p-8 bg-card space-y-6">
                {/* Metric Summary Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">YTD Billed Revenue</span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">$142,850.00</div>
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> +18.4% vs last period
                    </span>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Inflow Collected</span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">$128,400.00</div>
                    <span className="text-[10px] text-muted-foreground">92% cash realization</span>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Active Documents</span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">84 Issued</div>
                    <span className="text-[10px] text-muted-foreground">Invoices, Quotes, MSAs</span>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Operating Margin</span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">76.2%</div>
                    <span className="text-[10px] text-muted-foreground">Automated P&L ledger</span>
                  </div>
                </div>

                {/* Split Operational View: Live Document + Activity Stream */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Realistic Live Document Preview */}
                  <div className="lg:col-span-8 rounded-lg border border-border/80 bg-background p-5 sm:p-6 space-y-5 shadow-2xs">
                    <div className="flex items-start justify-between border-b border-border/60 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border/60 shrink-0">
                          <Image src="/logo-v3.jpg" alt="Times Works Logo" fill className="object-cover" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">Times Works Digital Advisory</div>
                          <div className="text-xs text-muted-foreground">Redmond Towers, Suite 400 • billing@timesworks.com</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-extrabold font-mono text-[#c82020] uppercase tracking-wide">INVOICE</div>
                        <div className="text-xs font-mono text-muted-foreground">INV-2026-0184</div>
                      </div>
                    </div>

                    {/* Bill To & Metadata */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Client Entity</span>
                        <span className="font-semibold text-foreground">Acme Global Enterprise</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Issue Date</span>
                        <span className="text-foreground">Nov 25, 2026</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Payment Terms</span>
                        <span className="font-medium text-foreground">Net 30 Days</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Status</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          PAID
                        </span>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="border border-border/70 rounded-md overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-muted/40 border-b border-border/70 text-[11px] font-semibold text-muted-foreground uppercase">
                          <tr>
                            <th className="py-2 px-3">Description</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3 text-right">Unit Rate</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 font-sans">
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-foreground">Enterprise Cloud Systems Architecture Review</td>
                            <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">1 Project</td>
                            <td className="py-2.5 px-3 text-right font-mono">$3,500.00</td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold">$3,500.00</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-foreground">Executive Financial Workflow Automation Deployment</td>
                            <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">1 System</td>
                            <td className="py-2.5 px-3 text-right font-mono">$1,800.00</td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold">$1,800.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end pt-2">
                      <div className="w-56 space-y-1.5 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal:</span>
                          <span className="font-mono">$5,300.00</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Applicable Tax (10%):</span>
                          <span className="font-mono">+$530.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-foreground pt-1.5 border-t border-border/80">
                          <span>Total Settled:</span>
                          <span className="font-mono text-[#c82020]">$5,830.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Security & Ledger Feed */}
                  <div className="lg:col-span-4 space-y-4">
                    <Card className="border border-border/80 shadow-2xs">
                      <CardHeader className="py-3 px-4 border-b border-border/60">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-[#c82020]" />
                          Anti-Fraud Security Verification
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Watermark Matrix</span>
                          <span className="font-semibold text-foreground">Active (45° Angle, 8% Opacity)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Audit Token</span>
                          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground">
                            SHA256:7f4a...9b12
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">A4 Height Check</span>
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="h-3 w-3" /> Exact 841.89 pt (1-Page)
                          </span>
                        </div>
                        <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                          All generated PDFs include tamper-resistant metadata matching Fortune 500 legal standards.
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-border/80 shadow-2xs">
                      <CardHeader className="py-3 px-4 border-b border-border/60">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-indigo-500" />
                          1-Click Quotation Deal Conversion
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-2 text-xs">
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          Commercial scope approved by client? Convert quotation proposals into live legal invoices and ledger records with zero manual copy-pasting.
                        </p>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c82020]">
                            Verified Contract Integrity <CheckCircle2 className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CORE CAPABILITY PILLARS (MICROSOFT FLUENT GRID) */}
        <section className="py-20 md:py-28 border-b border-border/80 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c82020]">Architectural Capabilities</span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Engineered for Commercial Precision and Reliability.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Times Works replaces fragmented point-solutions with an integrated operational environment that scales from solo advisors to corporate billing teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="p-6 rounded-xl border border-border/80 bg-card space-y-4 hover:border-[#c82020]/40 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[#c82020]/10 text-[#c82020] flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Single-Page Invoicing Engine</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Strict single-page A4 PDF guarantee prevents awkward page overflows. Real-time WYSIWYG paper calculations calculate subtotal, discounts, compound taxes, and amounts due instantly.
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#c82020]" />
                    <span>5 Executive templates (Professional, Classic, Minimal)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#c82020]" />
                    <span>Multi-currency support (USD, EUR, GBP, INR, BDT)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#c82020]" />
                    <span>Instant client PDF email dispatch via Resend</span>
                  </li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 rounded-xl border border-border/80 bg-card space-y-4 hover:border-[#c82020]/40 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileSignature className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Commercial Quotations & Proposals</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Draft commercial project scopes, payment milestones, validity terms, and estimated costs. Clients review clean proposals that transition directly into execution.
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-500" />
                    <span>1-Click Quotation to Invoice deal conversion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Formal P.O. numbers and validity expiry dates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Full itemized scope with units, rates, and tax</span>
                  </li>
                </ul>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 rounded-xl border border-border/80 bg-card space-y-4 hover:border-[#c82020]/40 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Bilateral Legal Agreements & NDAs</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generate Master Services Agreements (MSA), Non-Disclosure Agreements (NDA), and Scope of Work contracts with formal bilateral signature blocks and jurisdiction clauses.
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-rose-500" />
                    <span>Pre-drafted legal covenants and IP protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-rose-500" />
                    <span>Bilateral Provider and Client execution lines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-rose-500" />
                    <span>Strict 1-page compact layout without spillover</span>
                  </li>
                </ul>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 rounded-xl border border-border/80 bg-card space-y-4 hover:border-[#c82020]/40 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Company Ledger & Cash Flow</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time operating ledger aggregates verified client invoice payments against business expenses, vendor invoices, and overheads to calculate net operating margins.
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Automatic Profit & Loss and net margin computation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Category breakdown: Payroll, Software, Legal, Ops</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Export CSV ledger reports for external accountants</span>
                  </li>
                </ul>
              </div>

              {/* Pillar 5 */}
              <div className="p-6 rounded-xl border border-border/80 bg-card space-y-4 hover:border-[#c82020]/40 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Anti-Counterfeit Watermark Matrix</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Eliminate invoice spoofing and contract tampering. Configure corporate logo or text watermarking with customizable diagonal rotation, opacity, and dense tiling.
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-500" />
                    <span>Live 4x4 matrix tiling across paper background</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-500" />
                    <span>Custom opacity (3% to 20%) and custom angles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-500" />
                    <span>Cryptographic audit stamps on every PDF export</span>
                  </li>
                </ul>
              </div>

              {/* Pillar 6 */}
              <div className="p-6 rounded-xl border border-border/80 bg-card space-y-4 hover:border-[#c82020]/40 transition-colors shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Serverless Cloud Infrastructure</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Built on high-availability Neon PostgreSQL, Prisma ORM, and Next.js 16. Multi-tenant data isolation ensures company secrets and customer records remain strictly segregated.
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-amber-500" />
                    <span>Zero data loss with automated relational backups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-amber-500" />
                    <span>Super Admin governance and company telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-amber-500" />
                    <span>JWT session management and secure authentication</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE CAPABILITY TOUR (FLUENT SEGMENTED CONTROL) */}
        <section className="py-20 md:py-28 border-b border-border/80 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c82020]">System Tour</span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Deep Dive into the Operational Workflow.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Click across the core subsystems to inspect their functional architecture and enterprise advantages.
              </p>
            </div>

            {/* Segmented Control Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-background p-1.5 rounded-xl border border-border/80 shadow-2xs max-w-3xl mx-auto">
              {[
                { id: "invoices", label: "Invoices & Billing", icon: FileText },
                { id: "quotations", label: "Quotations & Scopes", icon: FileSignature },
                { id: "agreements", label: "Legal Agreements", icon: Scale },
                { id: "ledger", label: "Operating Ledger", icon: TrendingUp },
                { id: "security", label: "Watermark Security", icon: ShieldCheck },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-[#c82020] text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Details Display */}
            <div className="max-w-4xl mx-auto rounded-xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
              {activeTab === "invoices" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Executive Invoicing System</h3>
                      <p className="text-xs text-muted-foreground">Deterministic single-page PDF rendering for corporate accounts.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#c82020]/10 text-[#c82020] font-semibold text-xs border border-[#c82020]/20">
                      React-PDF 4.9 Core
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Real-time Calculation Engine</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Line item quantities, unit rates, flat/percentage discounts, and custom tax percentages automatically sum up in live client memory with zero rounding errors.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Zero-Spillover Architecture</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Compact table layouts, measured typography, and padding guards ensure your invoices never split into a 2-page mess when sending to VIP clients.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link href="/dashboard/invoices/new">
                      <Button size="sm" className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold">
                        Try Invoice Generator
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "quotations" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Commercial Quotations & Proposals</h3>
                      <p className="text-xs text-muted-foreground">Draft and submit structured bids with automated deal conversion.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-xs border border-indigo-200">
                      1-Click Pipeline
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Proposal Deal Flow</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Send formal quotations with validity periods (e.g. 30 days) and explicit payment terms (50% upfront, 50% milestone).
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Lossless Conversion</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Click "Convert to Invoice" on any approved quote to copy all line items, client details, and tax configs instantly into an active invoice.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link href="/dashboard/quotations/new">
                      <Button size="sm" className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold">
                        Draft a Quotation
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "agreements" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Bilateral Legal Contracts & MSAs</h3>
                      <p className="text-xs text-muted-foreground">Binding service agreements and NDAs configured for single-page signing.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-semibold text-xs border border-rose-200">
                      Enterprise Legal
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">7 Core Legal Provisions</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Pre-loaded clauses covering Scope of Work, Term, Payment Terms, Intellectual Property, Confidentiality, Termination, and Governing Law.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Dual Signature Protocol</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Dual columns for Authorized Representative execution (Service Provider and Counterparty Client) with dates and corporate stamps.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link href="/dashboard/agreements/new">
                      <Button size="sm" className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold">
                        Create Legal Agreement
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "ledger" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Corporate Operating Ledger</h3>
                      <p className="text-xs text-muted-foreground">Unified cash flow balance, expense tracking, and P&L accounting.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-xs border border-emerald-200">
                      Real-time Accounting
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Operating Margin Calculation</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Matches collected invoice payments against operational overheads (salaries, software, travel, office) to yield your exact net margin.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Tax Season Preparation</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Categorized expenditures with vendor notes and receipt attachments ready for 1-click CSV spreadsheet export.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link href="/dashboard/expenses">
                      <Button size="sm" className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold">
                        Open Ledger
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Anti-Counterfeit Protection System</h3>
                      <p className="text-xs text-muted-foreground">Tamper-evident watermark tiling and verification hashes.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold text-xs border border-purple-200">
                      Fraud Prevention
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Dense Watermark Grid</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Watermarks are mathematically tiled behind text and tables, preventing unauthorized modifications and PDF screenshot manipulation.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                      <span className="font-bold text-foreground block">Custom Brand Calibration</span>
                      <p className="text-muted-foreground leading-relaxed">
                        Fine-tune opacity (from faint 5% watermark to 18% bold brand mark) and rotation angle in your Company Workspace Settings.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link href="/dashboard/settings">
                      <Button size="sm" className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold">
                        Configure Security Settings
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. TECHNICAL SPECIFICATIONS (MICROSOFT AZURE STYLE SPECS MATRIX) */}
        <section className="py-20 md:py-28 border-b border-border/80 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c82020]">Technical Architecture</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Platform Specifications & Operational Standards
              </h2>
            </div>

            <div className="rounded-xl border border-border/80 overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-3 px-4 w-1/3">Capability Subsystem</th>
                    <th className="py-3 px-4 w-1/3">Times Works Implementation</th>
                    <th className="py-3 px-4 w-1/3">Operational Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-foreground">PDF Rendering Engine</td>
                    <td className="py-3 px-4 text-muted-foreground">@react-pdf/renderer 4.9.0 with fixed A4 dimensions</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">Deterministic single-page guarantee without text split</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-foreground">Cloud Database Architecture</td>
                    <td className="py-3 px-4 text-muted-foreground">Neon Serverless PostgreSQL with Prisma ORM</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">Auto-scaling, instant schema branching, zero data loss</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-foreground">Document Pipeline</td>
                    <td className="py-3 px-4 text-muted-foreground">1-Click Quotation to Invoice Conversion Action</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">Eliminates re-keying line items upon contract closing</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-foreground">Accounting Architecture</td>
                    <td className="py-3 px-4 text-muted-foreground">Inflow (Invoice Payments) vs. Outflow (Operating Expenses)</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">Live P&L statement, Net Margin %, and Cash Balance</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-foreground">Security & Watermarking</td>
                    <td className="py-3 px-4 text-muted-foreground">4x4 SVG & PNG Canvas Tiling with Dynamic Opacity</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">Prevents client tampering, forgery, and invoice fraud</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-foreground">Multi-Tenant Governance</td>
                    <td className="py-3 px-4 text-muted-foreground">Scoped Company Foreign Keys with NextAuth Role Guard</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">Strict tenant boundary isolation between companies</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. ENTERPRISE CTA BANNER (MICROSOFT STYLE) */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-[#c82020] via-[#a81a1a] to-[#880e0e] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Bring Commercial Precision to Your Business Documents.
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
              Start creating institutional-grade invoices, quotations, and bilateral agreements today with zero artificial limits.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button className="h-11 px-8 bg-white hover:bg-white/95 text-[#c82020] text-xs font-bold rounded-md shadow-md transition-all">
                  Create Workspace Account
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="h-11 px-6 text-xs font-semibold border-white/30 text-white hover:bg-white/10">
                  Open Live Dashboard
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
