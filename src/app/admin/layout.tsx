"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  ShieldCheck,
  Users,
  CreditCard,
  Database,
  ArrowLeft,
  Search,
  Bell,
  Sparkles,
  Server,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (
      status === "authenticated" &&
      session?.user?.email?.toLowerCase() !== "abutahir2626@gmail.com"
    ) {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (
    status === "authenticated" &&
    session?.user?.email?.toLowerCase() !== "abutahir2626@gmail.com"
  ) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] dark:bg-[#0f1117] font-sans text-foreground antialiased select-none">
      {/* Top Admin Header */}
      <header className="h-12 bg-[#c82020] dark:bg-[#1a0808] text-white flex items-center justify-between px-4 sm:px-6 shadow-sm z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5 font-semibold text-sm tracking-tight text-white hover:opacity-95">
            <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span>Times Works Admin Center</span>
            <span className="hidden sm:inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/20 text-white/90">
              Governance Portal
            </span>
          </Link>
        </div>

        {/* Global Admin Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/70" />
            <input
              type="text"
              placeholder="Search users, subscriptions, tenants, audit logs..."
              className="w-full h-7.5 rounded bg-white/15 focus:bg-white text-white focus:text-foreground placeholder:text-white/70 text-xs pl-8 pr-3 border border-transparent focus:border-white/30 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-white hover:bg-white/15 font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to Workspace</span>
            </Button>
          </Link>

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/15 rounded">
            <Bell className="h-3.5 w-3.5" />
          </Button>

          <div className="flex items-center gap-2 pl-2 border-l border-white/20">
            <Avatar className="h-6.5 w-6.5 ring-1 ring-white/30">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="text-[10px] bg-white/20 text-white">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline text-xs font-semibold text-white truncate max-w-[120px]">
              {session?.user?.name || "Administrator"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dedicated Admin Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-[#161a23] border-r border-border/80 shrink-0">
          <div className="p-4 border-b border-border/70">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Platform Administration
            </p>
            <p className="text-xs font-semibold text-foreground mt-0.5">Enterprise Cloud Console</p>
          </div>

          <nav className="p-3 space-y-1 text-xs font-medium flex-1 overflow-y-auto">
            <Link
              href="/admin"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                pathname === "/admin"
                  ? "bg-rose-50 dark:bg-rose-950/40 text-[#c82020] dark:text-rose-400 font-semibold"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-[#c82020]" />
              <span>Admin Overview</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>User Governance</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              <span>Subscriptions & MRR</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
            >
              <Database className="h-4 w-4" />
              <span>Database & Storage</span>
            </Link>
          </nav>

          <div className="p-3 border-t border-border/70 bg-muted/20 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center justify-between px-3 py-2 rounded text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="h-3.5 w-3.5" /> Return to App
              </span>
              <ExternalLink className="h-3 w-3 text-muted-foreground/60" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
