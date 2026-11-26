import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { ThemeToggle } from "@/components/theme/theme-toggle"

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Centered auth shell in the Times Works palette:
 * warm paper background + crimson glow in light mode,
 * deep charcoal + crimson glow in dark mode.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#faf9f8] text-foreground dark:bg-[#111318]">
      {/* Backdrop: subtle grid + brand glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute -top-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#c82020]/10 blur-[130px] dark:bg-[#c82020]/20" />
        <div className="absolute -right-24 -bottom-56 h-[420px] w-[520px] rounded-full bg-[#c82020]/5 blur-[130px] dark:bg-[#c82020]/10" />
      </div>

      {/* Brand bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative h-9 w-9 overflow-hidden rounded-lg border border-border/60 bg-background shadow-2xs transition-transform group-hover:scale-105">
            <Image
              src="/logo-v3.jpg"
              alt="Times Works"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">Times Works</span>
            <span className="mt-1 hidden text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase sm:block">
              Business Suite
            </span>
          </span>
        </Link>

        <ThemeToggle />
      </header>

      {/* Auth card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pt-4 pb-10 sm:px-6">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-[0_18px_60px_-20px_rgba(0,0,0,0.18)] sm:p-8 dark:border-white/10 dark:bg-[#171a21] dark:shadow-[0_18px_60px_-20px_rgba(0,0,0,0.75)]">
            {children}
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-[#c82020] dark:text-rose-400" aria-hidden="true" />
            <span>Secured with 2FA · © {new Date().getFullYear()} Times Works</span>
          </p>
        </div>
      </main>
    </div>
  )
}
