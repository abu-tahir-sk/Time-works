"use client"

import Image from "next/image"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { Sidebar } from "@/components/layout/sidebar"
import {
  Menu,
  Bell,
  Search,
  User,
  Plus,
  FileSpreadsheet,
  FileSignature,
  Handshake,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SIDEBAR_SECTIONS } from "@/lib/constants"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#faf9f8] dark:bg-[#121212] font-sans antialiased text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          {/* Microsoft Fluent Top Navigation Header */}
          <header className="flex h-14 items-center gap-3 border-b border-border/80 bg-background/95 backdrop-blur-md px-4 lg:h-[60px] lg:px-6 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 md:hidden h-9 w-9 text-muted-foreground hover:bg-muted"
                  />
                }
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col w-72 p-4">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <Image src="/logo-v3.jpg" alt="DocuFlow Logo" width={32} height={32} className="rounded-md" />
                  <div>
                    <span className="font-semibold text-sm">DocuFlow Suite</span>
                    <p className="text-[11px] text-muted-foreground">Business & Ledger ERP</p>
                  </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-3 space-y-4">
                  {SIDEBAR_SECTIONS.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground/70 px-2">
                        {sec.group}
                      </p>
                      {sec.items.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <div className="flex items-center gap-2.5">
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Microsoft Global Search Box */}
            <div className="w-full flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
                <Input
                  type="search"
                  placeholder="Search invoices, clients, expenses, accounts... (Ctrl+K)"
                  className="w-full h-9 rounded-md bg-muted/40 dark:bg-muted/20 border-border/70 pl-8.5 pr-14 text-xs shadow-none focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-[#0078D4]"
                />
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/80 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Quick Create Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      size="sm"
                      className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-3 bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
                    />
                  }
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>New</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-xs">
                  <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
                    Quick Action
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard/invoices/new" />}>
                    <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-[#0078D4]" />
                    <span>Create Invoice</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard/quotations/new" />}>
                    <FileSignature className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                    <span>Create Quotation</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard/agreements/new" />}>
                    <Handshake className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                    <span>New Agreement</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard/expenses" />}>
                    <Receipt className="h-3.5 w-3.5 mr-2 text-amber-500" />
                    <span>Record Expense</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Portal Quick Link */}
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 h-8.5 px-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="hidden xl:inline">Admin Portal</span>
              </Link>

              <ThemeToggle />

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md h-8.5 w-8.5 text-muted-foreground hover:bg-muted"
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-8.5 w-8.5 p-0 overflow-hidden ring-1 ring-border/80 hover:ring-[#0078D4]"
                    />
                  }
                >
                  {session?.user?.image ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                      <AvatarFallback>{session.user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-foreground text-xs font-semibold">
                      {session?.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="sr-only">Toggle user menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs">
                  <DropdownMenuGroup>
                    <div className="p-2">
                      <p className="font-semibold text-foreground truncate">{session?.user?.name || "DocuFlow User"}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{session?.user?.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          PRO Plan
                        </span>
                        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          Admin
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard" />}>
                      Executive Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard/expenses" />}>
                      Company Ledger & Accounts
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" render={<Link href="/admin" />}>
                      Admin Portal
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" render={<Link href="/dashboard/settings" />}>
                      Workspace Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-7 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
