"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import {
  FileText,
  FileSpreadsheet,
  Receipt,
  FileSignature,
  ShieldCheck,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { siteConfig } from "@/config/site"
import { MobileNav } from "./mobile-nav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/templates", label: "Templates" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 dark:bg-[#0c0d12]/90 backdrop-blur-md border-b border-border/80 shadow-xs dark:border-white/10 py-2.5"
          : "bg-background/60 dark:bg-[#0c0d12]/60 backdrop-blur-sm border-b border-border/40 py-3"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          
          {/* LEFT: Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <MobileNav />
            </div>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/60 shadow-2xs transition-transform group-hover:scale-105">
                <Image
                  src="/logo-v3.jpg"
                  alt="Times Works Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-foreground font-sans">
                  Times Works
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#c82020] dark:text-rose-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-[#c82020] rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* RIGHT: User Actions & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {session?.user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="h-9 px-3.5 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold rounded-md shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Workspace</span>
                  </Button>
                </Link>

                {/* User quick badge */}
                <Link
                  href="/dashboard"
                  className="w-8 h-8 rounded-full bg-[#c82020]/10 border border-[#c82020]/30 flex items-center justify-center text-xs font-bold text-[#c82020] hover:ring-2 hover:ring-[#c82020]/40 transition"
                  title={session.user.name || session.user.email || "Account"}
                >
                  {(session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted/60 transition"
                >
                  Sign In
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 px-3.5 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold rounded-md shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Start Free</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
