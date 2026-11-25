import Link from "next/link"
import Image from "next/image"
import { Globe, Mail, ArrowRight, ShieldCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full relative overflow-hidden bg-background pt-20 pb-8 border-t border-border/60">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#c82020]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/60 shadow-2xs">
                <Image
                  src="/logo-v3.jpg"
                  alt="Times Works Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-foreground font-sans">
                  Times Works
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25 uppercase">
                  PRO
                </span>
              </div>
            </Link>

            <p className="text-muted-foreground text-xs sm:text-sm max-w-sm leading-relaxed font-sans">
              Precision billing, single-page enterprise invoices, quotations, legal contracts, and accounting ledger engineered for high-performance businesses.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-[#c82020]" />
              <span>SOC-2 Ready • 256-Bit Bank Encryption • Anti-Fraud Watermarks</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Platform & Features
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/features" className="hover:text-[#c82020] transition-colors">
                  All Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#c82020] transition-colors">
                  Plans & Pricing
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#c82020] transition-colors">
                  Document Templates
                </Link>
              </li>
              <li>
                <Link href="/dashboard/invoices" className="hover:text-[#c82020] transition-colors">
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/dashboard/quotations" className="hover:text-[#c82020] transition-colors">
                  Quotation Pipeline
                </Link>
              </li>
              <li>
                <Link href="/dashboard/agreements" className="hover:text-[#c82020] transition-colors">
                  Agreement Contracts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/about" className="hover:text-[#c82020] transition-colors">
                  About Times Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c82020] transition-colors">
                  Contact Sales & Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#c82020] transition-colors">
                  FAQ & Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#c82020] transition-colors">
                  Workspace Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/privacy" className="hover:text-[#c82020] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#c82020] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#c82020] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#c82020] transition-colors">
                  Create Workspace
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Times Works Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span className="text-border">•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span className="text-border">•</span>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
