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
  const isSuperAdmin = session?.user?.email?.toLowerCase() === "abutahir2626@gmail.com"

  const visibleSections = SIDEBAR_SECTIONS.filter((section) => {
    if (section.group === "Administration" && !isSuperAdmin) {
      return false
    }
    return true
  })

  return (
    <div className="hidden border-r border-border/80 bg-background/95 backdrop-blur-md md:block w-64 lg:w-72 shrink-0 select-none shadow-[1px_0_0_0_rgba(0,0,0,0.04)]">
      <div className="flex h-full max-h-screen flex-col">
        {/* Times Works PRO Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
          <Link href="/dashboard" className="flex items-center gap-3 font-semibold group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c82020] to-[#e11d48] text-white shadow-sm ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                Times Works
                <span className="inline-flex items-center rounded-sm px-1.5 py-0.2 text-[9px] font-extrabold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25 tracking-wider">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-muted-foreground/75 font-medium">Professional Services</span>
            </div>
          </Link>
        </div>

        {/* Navigation by Sections */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {visibleSections.map((section, sIndex) => (
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
                          ? "bg-rose-50/70 dark:bg-rose-950/30 text-[#c82020] dark:text-rose-400 font-semibold shadow-[inset_3px_0_0_0_#c82020]"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive
                              ? "text-[#c82020] dark:text-rose-400"
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

        {/* Bottom User Profile Card (CherryWorks Style) */}
        <div className="mt-auto border-t border-border/60 p-3 space-y-2 bg-muted/15">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/70 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c82020] to-[#991b1b] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white/50 shadow-2xs shrink-0">
              {session?.user?.name
                ? session.user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "TW"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-foreground truncate group-hover:text-[#c82020] transition-colors">
                {session?.user?.name || "Abu Tahir"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {isSuperAdmin ? "Managing Partner" : "Finance Director"}
              </span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-foreground" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
            {isSuperAdmin && (
              <Link href="/admin" className="hover:text-foreground flex items-center gap-1 font-medium">
                <Sparkles className="h-3 w-3 text-[#c82020]" /> Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-auto hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
