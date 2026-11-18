"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Eye,
  FileText,
  Handshake,
  LayoutTemplate,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { deleteAgreement } from "@/actions/agreements"

type AgreementStatus =
  | "DRAFT"
  | "PENDING_SIGNATURE"
  | "ACTIVE"
  | "EXPIRING_SOON"
  | "EXPIRED"

interface Agreement {
  id: string
  agreementNumber: string
  title: string
  type: string
  currency: string
  value: number | null
  status: string
  effectiveDate: string
  expiryDate: string
  updatedAt: string
  client: {
    id: string
    name: string
    clientCompany: string | null
  } | null
}

const STATUS_META: Record<
  AgreementStatus,
  { label: string; badge: string; dot: string }
> = {
  DRAFT: {
    label: "Draft",
    badge:
      "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    dot: "bg-zinc-400",
  },
  PENDING_SIGNATURE: {
    label: "Awaiting signature",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  ACTIVE: {
    label: "Active",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  EXPIRING_SOON: {
    label: "Expiring soon",
    badge:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  EXPIRED: {
    label: "Expired",
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
    dot: "bg-red-500",
  },
}

function deriveStatus(agreement: Agreement): AgreementStatus {
  if (agreement.status === "DRAFT") return "DRAFT"
  const now = new Date()
  const expiry = new Date(agreement.expiryDate)
  if (expiry < now) return "EXPIRED"
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  if (expiry <= in30Days) return "EXPIRING_SOON"
  return "ACTIVE"
}

function formatMoney(value: number | null, currency: string): string {
  if (value == null) return "—"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function AgreementListClient({ agreements }: { agreements: Agreement[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  const query = search.trim().toLowerCase()

  const filteredAgreements = agreements.filter((agreement) => {
    const clientName = agreement.client?.name ?? ""
    const clientCompany = agreement.client?.clientCompany ?? ""
    const matchesSearch =
      query.length === 0 ||
      agreement.title.toLowerCase().includes(query) ||
      clientName.toLowerCase().includes(query) ||
      clientCompany.toLowerCase().includes(query) ||
      agreement.agreementNumber.toLowerCase().includes(query)

    const matchesStatus =
      statusFilter === "ALL" || deriveStatus(agreement) === statusFilter

    return matchesSearch && matchesStatus
  })

  const router = useRouter()

  const handleNew = () => {
    router.push("/dashboard/agreements/new")
  }

  const handleDelete = async (agreement: Agreement) => {
    if (!confirm(`Delete "${agreement.title}"?`)) return

    const res = await deleteAgreement(agreement.id)
    if (res.success) {
      toast.success("Agreement deleted")
      router.refresh()
    } else {
      toast.error(res.error || "Failed to delete agreement")
    }
  }

  const stats = useMemo(() => {
    const now = new Date()
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const awaiting = agreements.filter((a) => a.status === "PENDING_SIGNATURE").length
    const active = agreements.filter((a) => deriveStatus(a) === "ACTIVE")
    const expiring = agreements.filter((a) => deriveStatus(a) === "EXPIRING_SOON").length
    const managed = active.reduce((sum, a) => sum + (a.value ?? 0), 0)
    return [
      {
        label: "Total agreements",
        value: String(agreements.length),
        note: "Across all clients",
        icon: Handshake,
        iconClass: "bg-primary/10 text-primary dark:bg-primary/20",
      },
      {
        label: "Awaiting signature",
        value: String(awaiting),
        note: awaiting > 0 ? "Needs follow-up" : "All caught up",
        icon: PenLine,
        iconClass:
          "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      },
      {
        label: "Active contracts",
        value: String(active.length),
        note: `${formatMoney(managed, "INR")} under management`,
        icon: ShieldCheck,
        iconClass:
          "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      },
      {
        label: "Expiring soon",
        value: String(expiring),
        note: "Within the next 30 days",
        icon: CalendarClock,
        iconClass:
          "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
      },
    ]
  }, [agreements])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.note}</p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  stat.iconClass
                )}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agreements, clients, or numbers..."
              className="pl-8"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: string | null) =>
              setStatusFilter(value ?? "ALL")
            }
          >
            <SelectTrigger className="w-full sm:w-[190px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING_SIGNATURE">
                Awaiting signature
              </SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="EXPIRING_SOON">Expiring soon</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleComingSoon}>
            <LayoutTemplate className="h-4 w-4" />
            Templates
          </Button>
          <Button onClick={() => router.push("/dashboard/agreements/new")}>
            <Plus className="h-4 w-4" />
            New Agreement
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-4">Agreement</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Handshake className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium">No agreements found</p>
                      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        Try a different search or status filter, or start a new
                        agreement from scratch.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgreements.map((agreement) => {
                  const status = STATUS_META[agreement.status]

                  return (
                    <TableRow key={agreement.id} className="group">
                      <TableCell className="pl-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-medium leading-none">
                              {agreement.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {agreement.number}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                            {agreement.clientInitials}
                          </div>
                          <span className="whitespace-nowrap">
                            {agreement.client}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {agreement.type}
                      </TableCell>

                      <TableCell>
                        <p className="font-medium">{agreement.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {agreement.valueNote}
                        </p>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("gap-1.5", status.badge)}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              status.dot
                            )}
                          />
                          {status.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {Array.from({
                            length: agreement.totalSigners,
                          }).map((_, index) => {
                            const isSigned = index < agreement.signed

                            return (
                              <span
                                key={index}
                                className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold",
                                  isSigned
                                    ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                    : "border-dashed border-muted-foreground/40 text-muted-foreground"
                                )}
                              >
                                {isSigned ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                              </span>
                            )
                          })}
                          <span className="ml-1 text-xs text-muted-foreground">
                            {agreement.signed}/{agreement.totalSigners}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="whitespace-nowrap">
                          {agreement.expires}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {agreement.updated}
                        </p>
                      </TableCell>

                      <TableCell className="pr-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Actions for ${agreement.title}`}
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handlePreview}>
                              <Eye className="mr-2 h-4 w-4" />
                              View agreement
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePreview}>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePreview}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDelete(agreement)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing {filteredAgreements.length} of {agreements.length}{" "}
            agreements
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="icon-sm" className="font-medium">
              1
            </Button>
            <Button variant="outline" size="icon-sm" disabled>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
