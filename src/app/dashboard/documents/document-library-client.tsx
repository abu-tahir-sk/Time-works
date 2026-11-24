"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileSignature,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Handshake,
  LayoutGrid,
  List,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

import type {
  DocumentKind,
  DocumentSummary,
  LibraryDocument,
} from "@/actions/documents"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

type FolderKey =
  | "all"
  | "invoices"
  | "quotations"
  | "agreements"
  | "drafts"
  | "awaiting"

type SortKey = "recent" | "oldest" | "amount-high" | "amount-low" | "name"

const KIND_META: Record<
  DocumentKind,
  {
    label: string
    short: string
    icon: typeof FileText
    tint: string
    gradient: string
    text: string
  }
> = {
  INVOICE: {
    label: "Invoice",
    short: "Invoice",
    icon: FileSpreadsheet,
    tint: "bg-[#c82020]/10 text-[#c82020] dark:bg-rose-950/40 dark:text-rose-400",
    gradient:
      "bg-gradient-to-br from-[#c82020]/15 via-[#c82020]/5 to-transparent",
    text: "text-[#c82020] dark:text-rose-400",
  },
  QUOTATION: {
    label: "Quotation",
    short: "Quotation",
    icon: FileSignature,
    tint: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    gradient:
      "bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent",
    text: "text-amber-600 dark:text-amber-400",
  },
  AGREEMENT: {
    label: "Agreement",
    short: "Agreement",
    icon: Handshake,
    tint: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    gradient:
      "bg-gradient-to-br from-violet-500/15 via-violet-500/5 to-transparent",
    text: "text-violet-600 dark:text-violet-400",
  },
}

const STATUS_META: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    dot: "bg-zinc-400",
  },
  SENT: {
    label: "Sent",
    className:
      "border-rose-200 bg-rose-50 text-[#c82020] dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
    dot: "bg-[#c82020]",
  },
  VIEWED: {
    label: "Viewed",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  PARTIALLY_PAID: {
    label: "Partially paid",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  PAID: {
    label: "Paid",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  OVERDUE: {
    label: "Overdue",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
    dot: "bg-red-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
  ACCEPTED: {
    label: "Accepted",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
    dot: "bg-red-500",
  },
  EXPIRED: {
    label: "Expired",
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
  PENDING_SIGNATURE: {
    label: "Awaiting signature",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  ACTIVE: {
    label: "Active",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  EXPIRING_SOON: {
    label: "Expiring soon",
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    dot: "bg-orange-500",
  },
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount-high", label: "Amount: high to low" },
  { value: "amount-low", label: "Amount: low to high" },
  { value: "name", label: "Name (A–Z)" },
]

const PAGE_SIZE = 9

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getStatus(status: string) {
  return (
    STATUS_META[status] ?? {
      label: titleCase(status),
      className:
        "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
      dot: "bg-zinc-400",
    }
  )
}

function matchesFolder(entry: LibraryDocument, folder: FolderKey) {
  switch (folder) {
    case "invoices":
      return entry.kind === "INVOICE"
    case "quotations":
      return entry.kind === "QUOTATION"
    case "agreements":
      return entry.kind === "AGREEMENT"
    case "drafts":
      return entry.status === "DRAFT"
    case "awaiting":
      return entry.status === "PENDING_SIGNATURE"
    default:
      return true
  }
}

export function DocumentLibraryClient({
  documents,
  summary,
}: {
  documents: LibraryDocument[]
  summary: DocumentSummary
}) {
  const router = useRouter()
  const [folder, setFolder] = useState<FolderKey>("all")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [sort, setSort] = useState<SortKey>("recent")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)

  const folders = useMemo(
    () =>
      [
        {
          key: "all" as const,
          label: "All files",
          icon: FolderOpen,
          count: documents.length,
        },
        {
          key: "invoices" as const,
          label: "Invoices",
          icon: FileSpreadsheet,
          count: documents.filter((doc) => doc.kind === "INVOICE").length,
        },
        {
          key: "quotations" as const,
          label: "Quotations",
          icon: FileSignature,
          count: documents.filter((doc) => doc.kind === "QUOTATION").length,
        },
        {
          key: "agreements" as const,
          label: "Agreements",
          icon: Handshake,
          count: documents.filter((doc) => doc.kind === "AGREEMENT").length,
        },
        {
          key: "drafts" as const,
          label: "Drafts",
          icon: PenLine,
          count: documents.filter((doc) => doc.status === "DRAFT").length,
        },
        {
          key: "awaiting" as const,
          label: "Awaiting signature",
          icon: Clock,
          count: documents.filter(
            (doc) => doc.status === "PENDING_SIGNATURE"
          ).length,
        },
      ],
    [documents]
  )

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = documents.filter((entry) => {
      const matchesSearch =
        query.length === 0 ||
        entry.title.toLowerCase().includes(query) ||
        entry.number.toLowerCase().includes(query) ||
        entry.client.toLowerCase().includes(query)

      const matchesType =
        typeFilter === "ALL" || entry.kind === typeFilter

      return matchesFolder(entry, folder) && matchesSearch && matchesType
    })

    return filtered.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.updatedAt).getTime() -
            new Date(b.updatedAt).getTime()
          )
        case "amount-high":
          return (b.amount ?? 0) - (a.amount ?? 0)
        case "amount-low":
          return (a.amount ?? 0) - (b.amount ?? 0)
        case "name":
          return a.title.localeCompare(b.title)
        default:
          return (
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
          )
      }
    })
  }, [documents, folder, search, typeFilter, sort])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDocuments.length / PAGE_SIZE)
  )
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + PAGE_SIZE
  )

  const handleOpen = (entry: LibraryDocument) => {
    router.push(entry.href)
  }

  const handleCopy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(message)
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  const stats = [
    {
      label: "Total documents",
      value: String(summary.totalDocuments),
      note: `${summary.updatedThisMonth} updated this month`,
      icon: FileText,
      iconClass: "bg-primary/10 text-primary dark:bg-primary/20",
    },
    {
      label: "Portfolio value",
      value: summary.valueLabel,
      note: `Across ${summary.clientCount} ${
        summary.clientCount === 1 ? "client" : "clients"
      }`,
      icon: Wallet,
      iconClass:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    },
    {
      label: "Awaiting signatures",
      value: String(summary.awaitingSignatures),
      note: "Agreements waiting on clients",
      icon: PenLine,
      iconClass:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    },
    {
      label: "Active documents",
      value: String(summary.activeCount),
      note: "Live and ready to share",
      icon: ShieldCheck,
      iconClass:
        "bg-[#c82020]/10 text-[#c82020] dark:bg-rose-950/40 dark:text-rose-400",
    },
  ]

  const renderActions = (entry: LibraryDocument) => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${entry.title}`}
          />
        }
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleOpen(entry)}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open document
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleCopy(
              typeof window !== "undefined"
                ? `${window.location.origin}${entry.href}`
                : entry.href,
              "Document link copied"
            )
          }
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleCopy(entry.number, "Document number copied")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Copy number
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderStatus = (entry: LibraryDocument) => {
    const status = getStatus(entry.status)

    return (
      <Badge variant="outline" className={cn("gap-1.5", status.className)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
        {status.label}
      </Badge>
    )
  }

  const renderGridCard = (entry: LibraryDocument) => {
    const kind = KIND_META[entry.kind]

    return (
      <div
        key={`${entry.kind}-${entry.id}`}
        className="group flex flex-col overflow-hidden rounded-xl border bg-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
      >
        <div
          className={cn(
            "relative flex h-24 items-center justify-center border-b",
            kind.gradient
          )}
        >
          <kind.icon
            className={cn(
              "absolute -right-3 -bottom-4 h-24 w-24 rotate-12 opacity-[0.07]",
              kind.text
            )}
          />
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-lg",
              kind.tint
            )}
          >
            <kind.icon className="h-5 w-5" />
          </div>

          <div className="absolute right-2 top-2">
            {renderStatus(entry)}
          </div>

          <div className="absolute left-1.5 top-1.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            {renderActions(entry)}
          </div>

          <span className="absolute bottom-2 left-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
            {kind.short}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="truncate text-sm font-semibold" title={entry.title}>
            {entry.title}
          </p>
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            {entry.number}
          </p>

          <div className="mt-2 flex items-end justify-between gap-2">
            <span
              className="truncate text-xs text-muted-foreground"
              title={entry.clientCompany ?? entry.client}
            >
              {entry.client}
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {entry.amountLabel ?? "—"}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-muted-foreground">
            Updated {entry.updatedLabel}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Folders</h2>
          <span className="text-xs text-muted-foreground">
            Live from your workspace
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {folders.map((item) => {
            const isActive = folder === item.key

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setFolder(item.key)
                  setPage(1)
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border bg-card p-3 text-left transition hover:border-primary/40 hover:shadow-sm",
                  isActive && "border-primary/50 ring-1 ring-primary/20"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.count} {item.count === 1 ? "file" : "files"}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents or clients..."
              className="pl-8"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value ?? "ALL")
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                <SelectItem value="INVOICE">Invoices</SelectItem>
                <SelectItem value="QUOTATION">Quotations</SelectItem>
                <SelectItem value="AGREEMENT">Agreements</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(value) => {
                setSort((value as SortKey) ?? "recent")
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[195px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <div className="flex items-center rounded-lg border bg-card p-0.5">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => {
                setView("grid")
                setPage(1)
              }}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => {
                setView("list")
                setPage(1)
              }}
              aria-label="List view"
              aria-pressed={view === "list"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button />}>
              <Plus className="h-4 w-4" />
              New document
              <ChevronDown className="h-4 w-4 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/invoices/new" />}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Invoice
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/dashboard/quotations/new" />}
              >
                <FileSignature className="mr-2 h-4 w-4" />
                Quotation
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/dashboard/agreements/new" />}
              >
                <Handshake className="mr-2 h-4 w-4" />
                Agreement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card p-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <FolderOpen className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Your library is empty</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Create your first invoice, quotation, or agreement and it will show
            up here automatically — no uploads needed.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link href="/dashboard/invoices/new">
              <Button>
                <FileSpreadsheet className="h-4 w-4" />
                New invoice
              </Button>
            </Link>
            <Link href="/dashboard/quotations/new">
              <Button variant="outline">
                <FileSignature className="h-4 w-4" />
                New quotation
              </Button>
            </Link>
            <Link href="/dashboard/agreements/new">
              <Button variant="outline">
                <Handshake className="h-4 w-4" />
                New agreement
              </Button>
            </Link>
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card p-10 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No documents match</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try a different folder, type, or search term.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              setFolder("all")
              setSearch("")
              setTypeFilter("ALL")
              setPage(1)
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDocuments.map(renderGridCard)}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-4">Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleDocuments.map((entry) => {
                  const kind = KIND_META[entry.kind]

                  return (
                    <TableRow key={`${entry.kind}-${entry.id}`} className="group">
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              kind.tint
                            )}
                          >
                            <kind.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {entry.title}
                            </p>
                            <p className="truncate font-mono text-[11px] text-muted-foreground">
                              {entry.number}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {kind.label}
                      </TableCell>
                      <TableCell>
                        <p className="whitespace-nowrap">{entry.client}</p>
                        {entry.clientCompany ? (
                          <p className="text-xs text-muted-foreground">
                            {entry.clientCompany}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {entry.amountLabel ?? "—"}
                      </TableCell>
                      <TableCell>{renderStatus(entry)}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {entry.updatedLabel}
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        {renderActions(entry)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {filteredDocuments.length > 0 ? (
        <div className="flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing {startIndex + 1}–
            {startIndex + visibleDocuments.length} of{" "}
            {filteredDocuments.length} documents
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="px-1 text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
