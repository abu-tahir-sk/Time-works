"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  FileSpreadsheet,
  FileSignature,
  Handshake,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUpRight,
  ExternalLink,
  MessageCircle,
  FileText,
  Clock,
  ChevronRight,
  X,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { formatMoney } from "@/lib/utils"
import { createOrUpdateClient, deleteClient } from "@/actions/clients"
import { format } from "date-fns"

interface ClientsClientProps {
  initialClients: any[]
  company: any
}

export function ClientsClient({ initialClients, company }: ClientsClientProps) {
  const router = useRouter()
  const [clients, setClients] = useState(initialClients)
  const [search, setSearch] = useState("")
  const [filterTab, setFilterTab] = useState<"ALL" | "DUE" | "ZERO">("ALL")
  const [isPending, startTransition] = useTransition()

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [selectedStatementClient, setSelectedStatementClient] = useState<any>(null)

  // Form fields for Add / Edit
  const [name, setName] = useState("")
  const [clientCompany, setClientCompany] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [taxId, setTaxId] = useState("")

  // Financial Aggregates
  const totalBilled = clients.reduce((acc, c) => acc + (c.totalInvoiced || 0), 0)
  const totalCollected = clients.reduce((acc, c) => acc + (c.totalPaid || 0), 0)
  const totalOutstanding = clients.reduce((acc, c) => acc + (c.balanceDue || 0), 0)
  const clientsWithDue = clients.filter((c) => (c.balanceDue || 0) > 0).length

  // Filtered list
  const filteredClients = clients.filter((c) => {
    const query = search.toLowerCase()
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      (c.clientCompany && c.clientCompany.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.phone && c.phone.includes(query)) ||
      (c.taxId && c.taxId.toLowerCase().includes(query))

    let matchesTab = true
    if (filterTab === "DUE") {
      matchesTab = (c.balanceDue || 0) > 0
    } else if (filterTab === "ZERO") {
      matchesTab = (c.balanceDue || 0) <= 0
    }

    return matchesSearch && matchesTab
  })

  const openAddModal = () => {
    setEditingClient(null)
    setName("")
    setClientCompany("")
    setEmail("")
    setPhone("")
    setAddress("")
    setTaxId("")
    setIsModalOpen(true)
  }

  const openEditModal = (client: any) => {
    setEditingClient(client)
    setName(client.name || "")
    setClientCompany(client.clientCompany || "")
    setEmail(client.email || "")
    setPhone(client.phone || "")
    setAddress(client.address || "")
    setTaxId(client.taxId || "")
    setIsModalOpen(true)
  }

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Customer name is required")
      return
    }

    startTransition(async () => {
      const payload: any = {
        name: name.trim(),
        clientCompany: clientCompany.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        taxId: taxId.trim() || undefined,
      }

      if (editingClient) {
        payload.id = editingClient.id
      }

      const res = await createOrUpdateClient(payload)
      if (res.success && res.client) {
        toast.success(editingClient ? "Customer updated successfully" : "Customer created successfully")
        setIsModalOpen(false)
        router.refresh()
      } else {
        toast.error(res.error || "Failed to save customer")
      }
    })
  }

  const handleDeleteClient = async (id: string, clientName: string) => {
    if (!confirm(`Are you sure you want to delete ${clientName}?`)) return

    startTransition(async () => {
      const res = await deleteClient(id)
      if (res.success) {
        toast.success("Customer removed")
        setClients((prev) => prev.filter((c) => c.id !== id))
        router.refresh()
      } else {
        toast.error(res.error || "Cannot delete customer")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers & CRM</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#c82020]/10 text-[#c82020] border border-[#c82020]/25">
              Ledger & CRM
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete Customer Relationship Management, individual billing ledgers, and outstanding receivables tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={openAddModal}
            className="h-9 px-4 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Customers
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {clients.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Active business accounts</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Invoiced
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatMoney(totalBilled, "USD")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Total revenue billed</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Received
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatMoney(totalCollected, "USD")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Cleared in business bank</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Outstanding Due
            </CardTitle>
            <div className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatMoney(totalOutstanding, "USD")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{clientsWithDue} clients with balance</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search and Tabs Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, email, or tax ID..."
              className="h-8.5 text-xs pl-8 w-full rounded-xl bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => setFilterTab("ALL")}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                filterTab === "ALL"
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Customers ({clients.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("DUE")}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                filterTab === "DUE"
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              With Balance Due ({clientsWithDue})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("ZERO")}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                filterTab === "ZERO"
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Settled / Clean ({clients.length - clientsWithDue})
            </button>
          </div>
        </div>
      </div>

      {/* 4. Customers Table */}
      <Card className="border border-border/80 shadow-xs overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[750px]">
              <TableHeader className="bg-muted/40 border-b border-border/80">
                <TableRow className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="py-2.5 px-4">Customer / Company</TableHead>
                  <TableHead className="py-2.5 px-3">Contact Details</TableHead>
                  <TableHead className="py-2.5 px-3">Tax / GSTIN</TableHead>
                  <TableHead className="py-2.5 px-3 text-right">Total Invoiced</TableHead>
                  <TableHead className="py-2.5 px-3 text-right">Balance Due</TableHead>
                  <TableHead className="py-2.5 px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground space-y-1">
                        <Users className="h-8 w-8 text-muted-foreground/30 stroke-[1.5]" />
                        <p>No customers found matching your criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => {
                    const hasDue = (client.balanceDue || 0) > 0

                    return (
                      <TableRow key={client.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground text-xs">{client.name}</span>
                            {client.clientCompany && (
                              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {client.clientCompany}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-3 px-3">
                          <div className="space-y-0.5 text-[11px]">
                            {client.email && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Mail className="w-3 h-3 shrink-0" />
                                <span className="truncate max-w-[160px]">{client.email}</span>
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                          {client.taxId || "—"}
                        </TableCell>

                        <TableCell className="py-3 px-3 text-right font-mono font-bold text-foreground">
                          {formatMoney(client.totalInvoiced || 0, "USD")}
                          <span className="block text-[10px] text-muted-foreground font-normal">
                            {client.invoices?.length || 0} invoice{client.invoices?.length !== 1 ? "s" : ""}
                          </span>
                        </TableCell>

                        <TableCell className="py-3 px-3 text-right font-mono font-bold">
                          {hasDue ? (
                            <span className="text-amber-600 dark:text-amber-400">
                              {formatMoney(client.balanceDue, "USD")}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              $0.00
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStatementClient(client)}
                              className="h-7 px-2.5 text-[11px] font-semibold text-foreground hover:bg-muted"
                            >
                              Ledger
                            </Button>

                            <Link href={`/dashboard/invoices/new`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Create Invoice for this Client"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-[#c82020]"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </Button>
                            </Link>

                            <DropdownMenu>
                              <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44 text-xs">
                                <DropdownMenuItem onClick={() => setSelectedStatementClient(client)} className="cursor-pointer">
                                  <FileText className="mr-2 h-3.5 w-3.5 text-[#c82020]" /> View Statement
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditModal(client)} className="cursor-pointer">
                                  <Edit className="mr-2 h-3.5 w-3.5 text-blue-600" /> Edit Customer
                                </DropdownMenuItem>
                                {client.phone && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`, "_blank")}
                                    className="cursor-pointer"
                                  >
                                    <MessageCircle className="mr-2 h-3.5 w-3.5 text-emerald-600" /> WhatsApp Chat
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/40"
                                  onClick={() => handleDeleteClient(client.id, client.name)}
                                >
                                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Customer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Add / Edit Customer Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c82020]" />
              <span>{editingClient ? "Edit Customer Details" : "Add New Customer"}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveClient} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Customer Full Name *</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Abu Sufian"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Company / Business Name</Label>
              <Input
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="Acme International Corp"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@acme.com"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Phone / WhatsApp</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 0199"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">GSTIN / Tax ID</Label>
              <Input
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="22AAAAA0000A1Z5"
                className="h-9 text-xs rounded-xl font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Billing Address</Label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, City, State, Postal Code"
                className="text-xs rounded-xl min-h-[60px]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="h-8.5 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="h-8.5 text-xs rounded-xl bg-[#c82020] hover:bg-[#a81a1a] text-white font-semibold"
              >
                {isPending ? "Saving..." : editingClient ? "Update Customer" : "Create Customer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. Customer Statement / Ledger Modal */}
      {selectedStatementClient && (
        <Dialog open={!!selectedStatementClient} onOpenChange={(open) => !open && setSelectedStatementClient(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6">
            <DialogHeader className="border-b border-border/60 pb-3">
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#c82020]" />
                  <span>Customer Ledger & Statement: {selectedStatementClient.name}</span>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 pt-3">
              {/* Profile Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Customer</span>
                  <span className="font-semibold text-foreground">{selectedStatementClient.name}</span>
                  {selectedStatementClient.clientCompany && (
                    <span className="block text-muted-foreground text-[11px]">{selectedStatementClient.clientCompany}</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Billed</span>
                  <span className="font-mono font-bold text-foreground">
                    {formatMoney(selectedStatementClient.totalInvoiced || 0, "USD")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Paid</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {formatMoney(selectedStatementClient.totalPaid || 0, "USD")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Current Due</span>
                  <span className="font-mono font-bold text-[#c82020]">
                    {formatMoney(selectedStatementClient.balanceDue || 0, "USD")}
                  </span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Invoices History ({selectedStatementClient.invoices?.length || 0})
                </h4>

                {(!selectedStatementClient.invoices || selectedStatementClient.invoices.length === 0) ? (
                  <p className="text-xs text-muted-foreground p-3 border rounded-xl bg-muted/10">
                    No invoices recorded for this customer yet.
                  </p>
                ) : (
                  <div className="border border-border/60 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/40 border-b border-border/60 text-[10px] font-bold uppercase text-muted-foreground">
                        <tr>
                          <th className="py-2 px-3">Invoice #</th>
                          <th className="py-2 px-3">Issue Date</th>
                          <th className="py-2 px-3">Due Date</th>
                          <th className="py-2 px-3 text-right">Total</th>
                          <th className="py-2 px-3 text-right">Paid</th>
                          <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {selectedStatementClient.invoices.map((inv: any) => (
                          <tr key={inv.id} className="hover:bg-muted/20">
                            <td className="py-2.5 px-3 font-bold">
                              <Link href={`/dashboard/invoices/${inv.id}`} className="text-[#c82020] hover:underline">
                                {inv.invoiceNumber}
                              </Link>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {format(new Date(inv.issueDate), "MMM dd, yyyy")}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {format(new Date(inv.dueDate), "MMM dd, yyyy")}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold">
                              {formatMoney(inv.total, inv.currency || "USD")}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-semibold">
                              {formatMoney(inv.amountPaid || 0, inv.currency || "USD")}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted">
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => router.push(`/dashboard/invoices/new`)}
                  className="h-8 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Create New Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
