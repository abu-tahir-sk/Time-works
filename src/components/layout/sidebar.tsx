"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Settings, HelpCircle, LogOut, Sparkles, Building2, ChevronRight } from "lucide-react"
import { SIDEBAR_SECTIONS } from "@/lib/constants"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="hidden border-r border-border/80 bg-background/95 backdrop-blur-md md:block w-64 lg:w-72 shrink-0 select-none shadow-[1px_0_0_0_rgba(0,0,0,0.04)]">
      <div className="flex h-full max-h-screen flex-col">
        {/* Microsoft App Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-border/60 px-4 lg:h-[60px] lg:px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden ring-1 ring-border shadow-xs bg-primary/5">
              <Image src="/logo-v3.jpg" alt="DocuFlow Logo" width={32} height={32} className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                {siteConfig.name}
                <span className="inline-flex items-center rounded px-1 py-0.2 text-[10px] font-medium bg-[#0078D4]/10 text-[#0078D4] border border-[#0078D4]/20">
                  Business
                </span>
              </span>
              <span className="text-[11px] text-muted-foreground/75 font-normal">Finance & Ledger Suite</span>
            </div>
          </Link>
        </div>

        {/* Navigation by Sections */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {SIDEBAR_SECTIONS.map((section, sIndex) => (
            <div key={sIndex} className="space-y-1">
              <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.group}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item, iIndex) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`))

                  return (
                    <Link
                      key={iIndex}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-all relative",
                        isActive
                          ? "bg-[#eff6fc] dark:bg-blue-950/40 text-[#0078D4] dark:text-blue-400 font-semibold shadow-[inset_3px_0_0_0_#0078D4]"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive
                              ? "text-[#0078D4] dark:text-blue-400"
                              : "text-muted-foreground/80 group-hover:text-foreground"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase tracking-wide",
                            item.badge === "Admin"
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User / System Panel */}
        <div className="mt-auto border-t border-border/60 p-3 space-y-1 bg-muted/20">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Workspace Settings</span>
          </Link>
          <Link
            href="/dashboard/admin"
            className="flex items-center justify-between rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-3.5 w-3.5 text-[#0078D4]" />
              <span>Admin Center</span>
            </div>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-xs text-red-600/90 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
