"use client"

import React, { useState, useTransition } from "react"
import {
  ShieldCheck,
  Users,
  CreditCard,
  Building2,
  FileSpreadsheet,
  Search,
  UserCheck,
  Database,
  Mail,
  Zap,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateUserRole } from "@/actions/admin"
import { toast } from "sonner"

interface AdminClientProps {
  stats: {
    totalUsers: number
    totalCompanies: number
    totalInvoices: number
    totalQuotations: number
    totalAgreements: number
    totalExpenses: number
    totalSystemInvoiced: number
    totalSystemCollected: number
  }
  initialUsers: any[]
}

export function AdminClient({ stats, initialUsers }: AdminClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState<"ALL" | "ADMIN" | "USER">("ALL")
  const [isPending, startTransition] = useTransition()

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase()
    const matchesQuery =
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query))

    let matchesRole = true
    if (filterRole !== "ALL") {
      matchesRole = u.role === filterRole
    }

    return matchesQuery && matchesRole
  })

  const handleRoleChange = (userId: string, newRole: "USER" | "ADMIN") => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole)
      if (res.success) {
        toast.success(`User role updated to ${newRole}!`)
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
      } else {
        toast.error(res.error || "Failed to update user role.")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Admin Portal Header (Microsoft Azure Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-[#c82020] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Times Works Admin Center
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Platform governance: Monitor registered accounts, financial telemetry, workspaces, and system infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            System Healthy & Online
          </span>
        </div>
      </div>

      {/* KPI Cards with Microsoft Fluent styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Users */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Users
            </span>
            <div className="h-7 w-7 rounded-md bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-[#c82020]">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {stats.totalUsers}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 font-semibold">{stats.totalCompanies} companies</span> registered
            </p>
          </CardContent>
        </Card>

        {/* Total System Invoiced */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Invoiced
            </span>
            <div className="h-7 w-7 rounded-md bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              ${stats.totalSystemInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {stats.totalInvoices} Invoices generated platform-wide
            </p>
          </CardContent>
        </Card>

        {/* Total Collected Payments */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Payments Collected
            </span>
            <div className="h-7 w-7 rounded-md bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
              ${stats.totalSystemCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Recorded in ledger via client payments
            </p>
          </CardContent>
        </Card>

        {/* Total Documents Issued */}
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Documents Processed
            </span>
            <div className="h-7 w-7 rounded-md bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {stats.totalInvoices + stats.totalQuotations + stats.totalAgreements}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {stats.totalInvoices} Invoices • {stats.totalQuotations} Quotes • {stats.totalAgreements} Contracts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users and Access Governance Table */}
      <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <CardHeader className="py-3.5 px-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[#c82020]" />
                User Accounts & Governance Roster
              </CardTitle>
              <CardDescription className="text-xs">
                Manage all registered users, audit multi-tenant company associations, and set admin privileges.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search user name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8.5 w-52 text-xs pl-8"
                />
              </div>

              {/* Role Filter Pills */}
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-md border border-border/60">
                {(["ALL", "ADMIN", "USER"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterRole(tab)}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-colors ${
                      filterRole === tab
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <Users className="h-8 w-8 mx-auto text-muted-foreground/40 stroke-[1.5]" />
              <p>No user accounts found matching your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">User</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Access Level</th>
                    <th className="py-2.5 px-3">Activity / Tenants</th>
                    <th className="py-2.5 px-3">Registered Date</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-sans">
                  {filteredUsers.map((u) => {
                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 text-xs font-semibold">
                              <AvatarImage src={u.image} />
                              <AvatarFallback>{u.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">{u.name || "Unnamed User"}</span>
                              <span className="text-[11px] text-muted-foreground">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                            Full Access
                          </span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">
                          <span className="font-medium text-foreground">{u._count?.companies || 1}</span> co •{" "}
                          <span className="font-medium text-foreground">
                            {(u._count?.quotations || 0) + (u._count?.agreements || 0) + (u._count?.expenses || 0)}
                          </span>{" "}
                          docs/exp
                        </td>
                        <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-[11px] px-2.5 border-border/80"
                                />
                              }
                            >
                              Manage <ChevronDown className="h-3 w-3 ml-1" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 text-xs">
                              <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase">
                                Role Rights
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}
                                className="cursor-pointer"
                              >
                                Toggle to {u.role === "ADMIN" ? "Standard User" : "Super Admin"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cloud Platform Infrastructure Status (Microsoft Azure Style) */}
      <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] bg-card">
        <CardHeader className="py-3 px-4 border-b border-border/60">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Platform Infrastructure & Connectivity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-md border border-border/60 bg-muted/20">
              <Database className="h-5 w-5 text-[#c82020]" />
              <div>
                <p className="text-xs font-bold text-foreground">Neon PostgreSQL</p>
                <p className="text-[11px] text-emerald-600 font-medium">Connected & Synced</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md border border-border/60 bg-muted/20">
              <Mail className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-xs font-bold text-foreground">Resend Email API</p>
                <p className="text-[11px] text-emerald-600 font-medium">Gateway Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md border border-border/60 bg-muted/20">
              <ShieldCheck className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-xs font-bold text-foreground">NextAuth Security</p>
                <p className="text-[11px] text-emerald-600 font-medium">JWT & 2FA Enabled</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md border border-border/60 bg-muted/20">
              <Zap className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-foreground">PDF Rendering Engine</p>
                <p className="text-[11px] text-emerald-600 font-medium">React-PDF 4.9 Single-Page</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
