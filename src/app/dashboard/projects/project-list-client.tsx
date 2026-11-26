"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  FolderGit2,
  Plus,
  Search,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Layers,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatMoney } from "@/lib/utils"

interface ProjectListClientProps {
  initialProjects: any[]
}

export function ProjectListClient({ initialProjects }: ProjectListClientProps) {
  const [projects, setProjects] = useState<any[]>(initialProjects)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  // Financial Stats
  const stats = useMemo(() => {
    let totalBudgets = 0
    let totalPaid = 0
    let totalDue = 0
    let activeCount = 0

    projects.forEach((p) => {
      totalBudgets += p.budget || 0
      totalPaid += p.paidAmount || 0
      totalDue += p.dueAmount || 0
      if (p.status !== "COMPLETED") {
        activeCount++
      }
    })

    return {
      totalProjects: projects.length,
      activeCount,
      totalBudgets,
      totalPaid,
      totalDue,
    }
  }, [projects])

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = statusFilter === "ALL" || p.status === statusFilter
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.code && p.code.toLowerCase().includes(q)) ||
        (p.client?.name && p.client.name.toLowerCase().includes(q)) ||
        (p.client?.clientCompany && p.client.clientCompany.toLowerCase().includes(q))

      return matchesStatus && matchesSearch
    })
  }, [projects, search, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
        )
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Clock className="h-3 w-3" /> In Progress
          </span>
        )
      case "REVIEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            Review
          </span>
        )
      case "PLANNING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Planning
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden font-sans space-y-6 pb-20">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Projects & Deliverables
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/20">
              {stats.activeCount} Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage enterprise projects, client assignments, granular AI feature breakdowns, and payment collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/projects/new">
            <Button
              size="sm"
              className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Active Projects
            </p>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {stats.activeCount}
              <span className="text-xs text-muted-foreground font-normal ml-1">/ {stats.totalProjects} total</span>
            </div>
            <p className="text-[10px] text-muted-foreground">In development & review</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Project Budgets
            </p>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              ${stats.totalBudgets.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">Contracted total budget</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Total Collected (Paid)
            </p>
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              ${stats.totalPaid.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">Remitted via payments & links</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 rounded-xl shadow-xs">
          <CardContent className="p-4 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#c82020]">
              Pending Due Balance (বকেয়া)
            </p>
            <div className="text-2xl font-bold font-mono tracking-tight text-[#c82020]">
              ${stats.totalDue.toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground">Remaining to be collected</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search and Status Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-muted/40 rounded-xl border border-border/60 text-xs">
          {["ALL", "IN_PROGRESS", "PLANNING", "REVIEW", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap ${
                statusFilter === st
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {st === "ALL" ? "All Projects" : st.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8.5 h-8.5 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* 4. Project Cards Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => {
            const paid = p.paidAmount || 0
            const budget = p.budget || 0
            const due = Math.max(0, budget - paid)
            const pct = p.progressPct || 0

            return (
              <Card
                key={p.id}
                className="border border-border/80 hover:border-[#c82020]/40 transition-all rounded-xl shadow-xs group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {p.code || "PRJ"}
                        </span>
                        {getStatusBadge(p.status)}
                      </div>
                      <Link
                        href={`/dashboard/projects/${p.id}`}
                        className="text-sm font-bold text-foreground hover:text-[#c82020] transition-colors line-clamp-1 block"
                      >
                        {p.name}
                      </Link>
                    </div>

                    <Link href={`/dashboard/projects/${p.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground group-hover:text-foreground"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {p.client && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="font-medium text-foreground">{p.client.name}</span>
                      {p.client.clientCompany && (
                        <span>• {p.client.clientCompany}</span>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {p.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  {/* Financial Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">
                        Paid: <strong className="text-emerald-600 font-bold">${paid.toLocaleString()}</strong>
                      </span>
                      <span className="text-muted-foreground">
                        Due: <strong className="text-[#c82020] font-bold">${due.toLocaleString()}</strong>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                      <span>{pct}% Collected</span>
                      <span>Total Budget: ${budget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="border-t border-border/60 pt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Layers className="h-3 w-3" />
                      <span>{Array.isArray(p.featureBreakdown) ? p.featureBreakdown.length : 0} Features</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link href={`/dashboard/projects/${p.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs font-semibold px-2.5"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border border-dashed border-border/80 rounded-xl p-12 text-center space-y-3 bg-muted/10">
          <FolderGit2 className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="text-sm font-bold text-foreground">No Projects Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search
              ? `No projects match "${search}". Try clearing your search.`
              : "Get started by adding your first project and creating granular AI feature breakdowns."}
          </p>
          <Link href="/dashboard/projects/new">
            <Button size="sm" className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold mt-2">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Create First Project
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
