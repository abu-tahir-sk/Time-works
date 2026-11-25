"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, Variants } from "framer-motion"
import { 
  FileText, Shield, Zap, CheckCircle2, ArrowRight,
  Calculator, Lock, Fingerprint, Cloud,
  Users, PenTool, LayoutTemplate, CreditCard, BarChart3,
  Bell, History, Settings, FileSignature, Share2, Play, Check, Server
} from "lucide-react"

// Import Mockups
import { HeroDashboardMockup } from "@/components/mockups/hero-dashboard"
import { InvoicePreviewMockup } from "@/components/mockups/invoice-preview"
import { ClientProfileMockup } from "@/components/mockups/client-profile"
import { AgreementPreviewMockup } from "@/components/mockups/agreement-preview"
import { AnalyticsDashboardMockup } from "@/components/mockups/analytics-dashboard"
import { PaymentTrackingMockup } from "@/components/mockups/payment-tracking"
import { DigitalSignatureMockup } from "@/components/mockups/digital-signature"
import { TeamRbacMockup } from "@/components/mockups/team-rbac"
import { AutomationWorkflowMockup } from "@/components/mockups/automation-workflow"
import { NotificationCenterMockup } from "@/components/mockups/notification-center"
import { CustomizationPanelMockup } from "@/components/mockups/customization-panel"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// Helper for sleek Mac Window container
const MacWindow = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative rounded-xl border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl shadow-2xl overflow-hidden ${className}`}>
    <div className="h-10 border-b border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center px-4 gap-2">
      <div className="w-3 h-3 rounded-full bg-red-400/80" />
      <div className="w-3 h-3 rounded-full bg-amber-400/80" />
      <div className="w-3 h-3 rounded-full bg-green-400/80" />
    </div>
    <div className="p-2 sm:p-4">
      {children}
    </div>
  </div>
)

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#000000] font-sans selection:bg-[#c82020]/20 overflow-x-hidden text-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="flex-1">
        
        {/* 1. HERO SECTION (Vercel/Linear Style) */}
        <section className="relative w-full pt-40 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[95vh]">
          {/* Subtle glowing mesh background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] opacity-30 dark:opacity-40 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#c82020]/15 via-rose-500/10 to-amber-500/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-8">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-600 dark:text-slate-300 font-medium">
                The Ultimate Operating System
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-balance">
                Run your business with <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c82020] via-rose-600 to-[#991b1b]">absolute clarity.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed text-balance">
                Invoices, quotations, agreements, and client management—meticulously crafted into one unified, lightning-fast workspace.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-[#c82020] hover:bg-[#a81a1a] text-white rounded-full px-8 h-12 text-[15px] font-semibold shadow-xl shadow-[#c82020]/25 border-0 transition-transform hover:scale-105">
                  Start Building Free
                </Button>
                <Button size="lg" variant="ghost" className="rounded-full px-8 h-12 text-[15px] font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <Play className="w-4 h-4 mr-2" /> Watch Demo
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="relative perspective-1000">
              {/* 3D Tilt container simulation */}
              <div className="transform rotate-y-[-5deg] rotate-x-[5deg] shadow-2xl rounded-xl">
                <MacWindow className="border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-black/60 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)]">
                  <HeroDashboardMockup />
                </MacWindow>
              </div>
              
              {/* Floating notification badges */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -left-8 top-16 bg-white/80 dark:bg-[#111] backdrop-blur-xl p-3.5 rounded-2xl shadow-xl border border-slate-200/50 dark:border-white/10 flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                <div className="pr-2">
                  <div className="text-sm font-semibold">Payment cleared</div>
                  <div className="text-xs text-slate-500">INV-2023 just got paid</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. BENTO BOX FEATURE GRID */}
        <section className="py-32 bg-white dark:bg-[#050505] relative z-10 border-t border-slate-200/50 dark:border-white/5">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need. Nothing you don't.</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">A meticulously designed ecosystem of tools.</p>
            </div>
            
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px]">
              {/* Large Bento Item 1 */}
              <motion.div variants={fadeUp} className="md:col-span-2 md:row-span-2 group relative p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 overflow-hidden hover:bg-slate-100/50 dark:hover:bg-white/[0.04] transition-colors">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Calculator className="w-32 h-32" /></div>
                <div className="h-full flex flex-col">
                  <div className="w-12 h-12 bg-[#c82020]/10 text-[#c82020] rounded-xl flex items-center justify-center mb-6"><Calculator className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Smart Invoicing</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm flex-1 leading-relaxed">Create beautiful, professional invoices in seconds. Track statuses, apply taxes automatically, and let clients pay directly via integrated payment links.</p>
                  <div className="pt-4 flex items-center text-[#c82020] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                    Explore Invoices <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </motion.div>

              {/* Normal Bento Items */}
              <motion.div variants={fadeUp} className="md:col-span-2 group relative p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 overflow-hidden hover:bg-slate-100/50 dark:hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 bg-rose-500/10 text-[#c82020] rounded-xl flex items-center justify-center mb-4"><FileSignature className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Digital Agreements</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Legally binding digital signatures built right in. Get contracts signed instantly without external software.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="md:col-span-1 group relative p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 overflow-hidden hover:bg-slate-100/50 dark:hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center"><Users className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-bold mb-1 tracking-tight">Client CRM</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">A unified directory for all your clients.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="md:col-span-1 group relative p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 overflow-hidden hover:bg-slate-100/50 dark:hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-bold mb-1 tracking-tight">Analytics</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Real-time revenue insights & metrics.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 3. CORE SHOWCASE: INVOICING */}
        <section className="py-32 bg-[#FAFAFA] dark:bg-[#000] relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-8 z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
                  Invoices that get you paid faster.
                </h2>
                <div className="space-y-4">
                  {[
                    "Pixel-perfect PDF generation",
                    "Automated tax and discount calculation",
                    "One-click client selection from CRM",
                    "Integrated 'Pay Now' buttons"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-[15px] text-slate-600 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-[#c82020]/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#c82020]" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 lg:pl-10">
                <MacWindow>
                  <InvoicePreviewMockup />
                </MacWindow>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. DYNAMIC WORKFLOW */}
        <section className="py-32 bg-white dark:bg-[#050505] border-y border-slate-200/50 dark:border-white/5 text-center overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">The seamless lifecycle.</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">From proposal to payment without ever switching tabs.</p>
            </motion.div>
            
            <div className="relative">
              {/* Animated Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#c82020] to-transparent" 
                />
              </div>

              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {[
                  { title: "Quote", icon: FileText, desc: "Send proposal" },
                  { title: "Accept", icon: CheckCircle2, desc: "Client approves" },
                  { title: "Invoice", icon: Calculator, desc: "Auto-convert" },
                  { title: "Paid", icon: CreditCard, desc: "Money received" }
                ].map((step, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white dark:bg-[#111] rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/50 dark:border-white/10 flex items-center justify-center mb-4 text-slate-700 dark:text-slate-300 relative group">
                      <div className="absolute inset-0 bg-[#c82020]/0 group-hover:bg-[#c82020]/10 rounded-2xl transition-colors" />
                      <step.icon className="w-6 h-6 group-hover:text-[#c82020] transition-colors" />
                    </div>
                    <div className="font-bold tracking-tight">{step.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{step.desc}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. TEAM & SECURITY */}
        <section className="py-32 bg-[#FAFAFA] dark:bg-[#000] border-b border-slate-200/50 dark:border-white/5">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="order-2 lg:order-1 relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-3xl blur-2xl z-0" />
                <MacWindow className="relative z-10">
                  <TeamRbacMockup />
                </MacWindow>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-8 order-1 lg:order-2 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-white/10">
                  <Server className="w-3 h-3" /> Enterprise Grade
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  Built for teams. <br />Secured by default.
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                  Granular role-based access control (RBAC) ensures your team sees exactly what they need to see. Comprehensive audit logs track every action.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Owner, Admin, Staff roles",
                    "Detailed activity logs",
                    "Document version history",
                    "End-to-end encryption"
                  ].map((ft, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                      <Shield className="w-4 h-4 text-slate-400" /> {ft}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="py-24 md:py-32 relative overflow-hidden text-center bg-gradient-to-r from-[#c82020] via-[#a81a1a] to-[#880e0e] text-white">
          <div className="container mx-auto px-4 max-w-3xl space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-tight text-white">
              Ready to modernize your workflow?
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-medium max-w-xl mx-auto leading-relaxed">
              Join thousands of businesses managing their documents with Times Works today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-white/95 text-[#c82020] rounded-full px-10 h-14 text-lg font-bold shadow-2xl transition-transform hover:scale-105">
                Start Building Free
              </Button>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  )
}
