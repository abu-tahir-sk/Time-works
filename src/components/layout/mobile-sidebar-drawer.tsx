"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Settings, LogOut, Sparkles } from "lucide-react"
import { SIDEBAR_SECTIONS } from "@/lib/constants"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"

export function MobileSidebarContent() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const visibleSections = SIDEBAR_SECTIONS

  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-border/60 mb-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-border/60 shadow-2xs">
            <Image
              src="/logo-v3.jpg"
              alt="Times Works Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">Times Works</span>
            <span className="text-[10px] text-muted-foreground/75 font-medium">Professional Services</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-4">
        {visibleSections.map((section, sIndex) => (
          <div key={sIndex} className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">
              {section.group}
            </p>
            {section.items.map((item, iIndex) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`))

              return (
                <Link
                  key={iIndex}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-rose-50/80 dark:bg-rose-950/40 text-[#c82020] dark:text-rose-400 font-semibold"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-[#c82020] dark:text-rose-400" : "text-muted-foreground/80"
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase tracking-wide",
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
        ))}
      </nav>

      {/* Bottom User Profile */}
      <div className="mt-auto border-t border-border/60 p-3 shrink-0 bg-muted/15">
        <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-muted/70 transition-all">
          <Link href="/dashboard/settings" className="flex items-center gap-3 min-w-0 flex-1 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c82020] to-[#991b1b] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white/50 shadow-2xs shrink-0">
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
              <span className="text-sm font-bold text-foreground truncate group-hover:text-[#c82020] transition-colors">
                {session?.user?.name || "Abu Sufian"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                Finance Director
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/dashboard/settings"
              title="Settings"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign out"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
