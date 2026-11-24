"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FileSpreadsheet,
  FileSignature,
  Receipt,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Database,
  Zap,
  TrendingUp,
  BarChart3,
  CreditCard,
  Building2,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "ledger" | "quotes" | "admin">("invoices")

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f8] dark:bg-[#111318] text-foreground font-sans selection:bg-[#c82020]/20 selection:text-[#c82020]">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION (Times Works Professional Style) */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border/60 bg-linear-to-b from-[#fef2f2]/60 via-[#faf9f8] to-background dark:from-[#1f1113] dark:via-[#111318] dark:to-background overflow-hidden">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
            {/* Enterprise Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Times Works Business Suite</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="font-medium text-muted-foreground">Invoicing, Ledger & Admin Governance</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.12]">
              Modern Financial Management & Document Suite for Enterprise.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
              Streamline client billing, issue precision single-page invoices and estimates, track company operating costs, and manage multi-tenant governance in one centralized platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/register">
                <Button className="h-11 px-7 bg-[#c82020] hover:bg-[#a81a1a] text-white text-sm font-semibold rounded-md shadow-sm transition-all hover:shadow-md flex items-center gap-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-11 px-6 text-sm font-medium border-border/80 bg-background/80 hover:bg-muted shadow-2xs"
                >
                  Sign In to Workspace
                </Button>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#c82020]" />
                <span>Single-page PDF rendering</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#c82020]" />
                <span>Serverless PostgreSQL storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#c82020]" />
                <span>Two-Factor Authentication</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#c82020]" />
                <span>Custom watermark controls</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. INTERACTIVE PRODUCT PREVIEW SHOWCASE */}
        <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Integrated Business Workspace
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Everything your financial operations need, engineered with Microsoft Fluent standards.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-6 overflow-x-auto max-w-full pb-2">
            <div className="inline-flex p-1 rounded-lg bg-muted/60 border border-border/70 shadow-2xs shrink-0">
              <button
                onClick={() => setActiveTab("invoices")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "invoices"
                    ? "bg-background text-[#c82020] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Invoices & Billing</span>
              </button>
              <button
                onClick={() => setActiveTab("ledger")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "ledger"
                    ? "bg-background text-[#c82020] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Receipt className="h-3.5 w-3.5" />
                <span>Company Ledger</span>
              </button>
              <button
                onClick={() => setActiveTab("quotes")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "quotes"
                    ? "bg-background text-[#c82020] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileSignature className="h-3.5 w-3.5" />
                <span>Quotations</span>
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "admin"
                    ? "bg-background text-[#c82020] shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>

          {/* Interactive Showcase Window */}
          <Card className="border border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-card rounded-xl overflow-hidden">
            {/* Window Title Bar (Windows 11 / Microsoft 365 style) */}
            <div className="bg-muted/40 border-b border-border/80 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-[11px] font-mono text-muted-foreground">
                  https://timesworks.cloud/{activeTab}
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live Demo View
              </span>
            </div>

            <CardContent className="p-6 md:p-8">
              {activeTab === "invoices" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-md border bg-muted/20">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Invoiced</p>
                      <p className="text-xl font-bold font-mono text-foreground mt-0.5">$48,250.00</p>
                    </div>
                    <div className="p-3 rounded-md border bg-emerald-50/30 dark:bg-emerald-950/20">
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-semibold">Paid Collections</p>
                      <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">$39,400.00</p>
                    </div>
                    <div className="p-3 rounded-md border bg-amber-50/30 dark:bg-amber-950/20">
                      <p className="text-[10px] text-amber-700 dark:text-amber-300 uppercase font-semibold">Pending Due</p>
                      <p className="text-xl font-bold font-mono text-amber-600 mt-0.5">$8,850.00</p>
                    </div>
                    <div className="p-3 rounded-md border bg-rose-50/30 dark:bg-rose-950/20">
                      <p className="text-[10px] text-[#c82020] uppercase font-semibold">Active Clients</p>
                      <p className="text-xl font-bold font-mono text-foreground mt-0.5">34</p>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-x-auto text-xs">
                    <table className="w-full text-left min-w-[500px]">
                      <thead className="bg-muted/40 border-b text-[11px] font-semibold text-muted-foreground">
                        <tr>
                          <th className="p-3">Invoice #</th>
                          <th className="p-3">Client</th>
                          <th className="p-3">Issue Date</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-sans">
                        <tr>
                          <td className="p-3 font-semibold text-[#c82020]">INV-2026-081</td>
                          <td className="p-3 font-medium">Acme Global Technologies</td>
                          <td className="p-3 text-muted-foreground">Nov 22, 2026</td>
                          <td className="p-3 font-mono font-bold">$12,400.00</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              PAID
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-[#c82020]">INV-2026-082</td>
                          <td className="p-3 font-medium">Summit Consulting Group</td>
                          <td className="p-3 text-muted-foreground">Nov 23, 2026</td>
                          <td className="p-3 font-mono font-bold">$4,850.00</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              PENDING
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "ledger" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-md border bg-card">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Revenue Inflow</p>
                      <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">+$39,400.00</p>
                    </div>
                    <div className="p-3 rounded-md border bg-card">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Operational Costs</p>
                      <p className="text-xl font-bold font-mono text-rose-600 mt-0.5">-$14,280.00</p>
                    </div>
                    <div className="p-3 rounded-md border bg-card">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Net Profit Margin</p>
                      <p className="text-xl font-bold font-mono text-foreground mt-0.5">+$25,120.00 (63.7%)</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-md border bg-muted/20 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Operating Cost Distribution</span>
                      <span className="text-muted-foreground">Payroll (48%) • Cloud IT (24%) • Marketing (18%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                      <div className="bg-blue-500 h-full w-[48%]" />
                      <div className="bg-purple-500 h-full w-[24%]" />
                      <div className="bg-amber-500 h-full w-[18%]" />
                      <div className="bg-emerald-500 h-full w-[10%]" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "quotes" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-md border bg-muted/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">Sales Proposals & Estimates Pipeline</p>
                      <p className="text-[11px] text-muted-foreground">Send branded estimates and convert approved deals directly into invoices.</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600">84% Approval Rate</span>
                  </div>

                  <div className="border rounded-md overflow-x-auto text-xs">
                    <table className="w-full text-left min-w-[500px]">
                      <thead className="bg-muted/40 border-b text-[11px] font-semibold text-muted-foreground">
                        <tr>
                          <th className="p-3">Quote #</th>
                          <th className="p-3">Prospect</th>
                          <th className="p-3">Valid Until</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-sans">
                        <tr>
                          <td className="p-3 font-semibold text-indigo-600">QUO-2026-039</td>
                          <td className="p-3 font-medium">FinEdge Dynamics Inc</td>
                          <td className="p-3 text-muted-foreground">Dec 15, 2026</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ACCEPTED
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "admin" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-md border bg-card">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Users</p>
                      <p className="text-xl font-bold font-mono text-foreground mt-0.5">1,248</p>
                    </div>
                    <div className="p-3 rounded-md border bg-card">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Paid Subscribers</p>
                      <p className="text-xl font-bold font-mono text-amber-600 mt-0.5">384</p>
                    </div>
                    <div className="p-3 rounded-md border bg-card">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Monthly MRR</p>
                      <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">$18,420</p>
                    </div>
                    <div className="p-3 rounded-md border bg-card">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">System Health</p>
                      <p className="text-xl font-bold font-mono text-[#c82020] mt-0.5">100%</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* 3. FOUR CORE BUSINESS PILLARS */}
        <section className="py-16 border-t border-border/60 bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Engineered for Complete Enterprise Control
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                No unnecessary complexity. Every feature is built for high speed, reliability, and precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Feature 1 */}
              <div className="p-5 rounded-lg border border-border/80 bg-card space-y-3 shadow-xs">
                <div className="w-9 h-9 rounded-md bg-[#c82020]/10 text-[#c82020] flex items-center justify-center">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Precision Billing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Strict single-page PDF rendering ensures clean, professional client invoices without unwanted blank page spills.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-5 rounded-lg border border-border/80 bg-card space-y-3 shadow-xs">
                <div className="w-9 h-9 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Financial Ledger</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Record company operating costs, manage payroll and software expenses, and compute net profit margins in real time.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-5 rounded-lg border border-border/80 bg-card space-y-3 shadow-xs">
                <div className="w-9 h-9 rounded-md bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Dedicated Admin Center</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Centralized control to monitor registered accounts, manage Pro and Enterprise subscriptions, and track platform MRR.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-5 rounded-lg border border-border/80 bg-card space-y-3 shadow-xs">
                <div className="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Custom Watermarking</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fine-tune document opacity, rotation, size, and tiling patterns for corporate identity and fraud protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SUBSCRIPTION & PRICING PLANS */}
        <section id="pricing" className="py-20 md:py-24 border-t border-border/60 bg-linear-to-b from-[#f8fafc] to-background dark:from-[#0d1117] dark:to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Subscription Plans & Benefits</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Predictable Pricing for High-Performance Workspaces.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All users receive immediate access to the workspace and ledger tools. Choose Free to get started with up to 20 documents, or unlock Pro for unlimited PDF generation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {/* Plan 1: Free Tier */}
              <div className="rounded-xl border border-border/80 bg-card p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Free Starter</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">20 PDFs Included</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">$0</span>
                      <span className="text-xs text-muted-foreground">/ forever</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ideal for individual freelancers and contractors starting out.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">Max 20 PDF document generations (Invoices, Quotations, Agreements combined)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span>Single-page PDF guarantee & standard template</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span>Full access to workspace & financial dashboard</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span>Standard client management & ledger overview</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span>PostgreSQL cloud sync & 2FA security</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link href="/register" className="w-full block">
                    <Button variant="outline" className="w-full h-10 text-xs font-semibold border-border/80 hover:bg-muted">
                      Start Free (20 PDFs)
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Plan 2: Pro Business (Featured) */}
              <div className="rounded-xl border-2 border-[#c82020] bg-card p-6 flex flex-col justify-between shadow-md relative ring-4 ring-[#c82020]/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#c82020] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c82020]">Pro Business</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#c82020]/15 text-[#c82020]">Unlimited PDFs</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">$29</span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      For active consulting firms, agencies, and expanding enterprises.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span className="text-foreground font-semibold">Unlimited PDF document generations (No 20-doc cap)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">Logo Tiling & Text Watermarking (Pattern, angle, opacity)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span>Full Company Ledger, P&L analytics & expense categorization</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span>Instant Quotation to Invoice conversion</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span>Custom brand assets, signatures, and payment bank details</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#c82020] shrink-0 mt-0.5" />
                      <span>High-speed priority PDF rendering engine</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link href="/register" className="w-full block">
                    <Button className="w-full h-10 text-xs font-semibold bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Plan 3: Enterprise */}
              <div className="rounded-xl border border-border/80 bg-card p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Enterprise</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">Dedicated Governance</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">$99</span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      For corporate organizations requiring central governance and audit trails.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      <span className="text-foreground font-semibold">Everything in Pro with unlimited documents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">Dedicated Super Admin Center & platform telemetry</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Team seats, multi-user roles & permissions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>Complete agreement contracts & NDAs with legal clauses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>24/7 dedicated priority SLA & enterprise onboarding</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link href="/register" className="w-full block">
                    <Button variant="outline" className="w-full h-10 text-xs font-semibold border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40">
                      Contact Enterprise
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION SECTION */}
        <section className="py-16 md:py-20 border-t border-border/60 bg-linear-to-r from-[#c82020] to-[#991b1b] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to Upgrade Your Financial Workspace?
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
              Join thousands of businesses managing their documents, expenses, and invoices with modern Times Works precision.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button className="h-11 px-8 bg-white hover:bg-white/95 text-[#c82020] text-sm font-bold rounded-md shadow-md transition-all">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="h-11 px-6 text-sm font-medium border-white/30 text-white hover:bg-white/10">
                  Sign In
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
