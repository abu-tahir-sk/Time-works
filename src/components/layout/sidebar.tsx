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
    <div className="hidden border-r border-border/80 bg-background/95 backdrop-blur-md md:block w-64 lg:w-72 shrink-0 select-none shadow-[1px_0_0_0_rgba(0,0,0,0.04)] h-full overflow-hidden">
      <div className="flex h-full flex-col justify-between overflow-hidden">
        {/* Times Works PRO Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-border/60 px-5 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 font-semibold group">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#c82020] to-[#e11d48] text-white shadow-sm ring-1 ring-white/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                Times Works
                <span className="inline-flex items-center rounded-sm px-1.5 py-0.2 text-[9px] font-extrabold bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25 tracking-wider">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground/75 font-medium">Professional Services</span>
            </div>
          </Link>
        </div>

        {/* Navigation by Sections (Compact, No Scroll) */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 px-3 space-y-2.5">
          {visibleSections.map((section, sIndex) => (
            <div key={sIndex} className="space-y-0.5">
              <div className="px-3 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
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
                        "group flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition-all relative",
                        isActive
                          ? "bg-rose-50/80 dark:bg-rose-950/40 text-[#c82020] dark:text-rose-400 font-semibold shadow-[inset_3px_0_0_0_#c82020]"
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
                            "ml-auto text-[9px] font-semibold px-1.5 py-0.2 rounded uppercase tracking-wide",
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

        {/* Bottom User Profile (CherryWorks Exact Style, Compact 48px) */}
        <div className="mt-auto border-t border-border/60 p-2.5 shrink-0 bg-muted/15">
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-muted/70 transition-all">
            <Link href="/dashboard/settings" className="flex items-center gap-2.5 min-w-0 flex-1 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c82020] to-[#991b1b] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white/50 shadow-2xs shrink-0">
                {session?.user?.name
                  ? session.user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "AS"}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-foreground truncate group-hover:text-[#c82020] transition-colors">
                  {session?.user?.name || "Abu Sufian"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {isSuperAdmin ? "Managing Partner" : "Finance Director"}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-0.5 shrink-0">
              {isSuperAdmin && (
                <Link
                  href="/admin"
                  title="Admin Portal"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-[#c82020] hover:bg-muted transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </Link>
              )}
              <Link
                href="/dashboard/settings"
                title="Settings"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Sign out"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
