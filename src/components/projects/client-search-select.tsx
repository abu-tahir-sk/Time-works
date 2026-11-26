"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { Search, Check, ChevronsUpDown, User, Building2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createOrUpdateClient } from "@/actions/clients"

interface ClientItem {
  id: string
  name: string
  clientCompany?: string | null
  email?: string | null
}

interface ClientSearchSelectProps {
  clients: ClientItem[]
  value: string
  onChange: (clientId: string) => void
  disabled?: boolean
}

export function ClientSearchSelect({
  clients = [],
  value,
  onChange,
  disabled = false,
}: ClientSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [localClients, setLocalClients] = useState<ClientItem[]>(clients)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newClientName, setNewClientName] = useState("")
  const [newClientCompany, setNewClientCompany] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalClients(clients)
  }, [clients])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const selectedClient = useMemo(
    () => localClients.find((c) => c.id === value),
    [localClients, value]
  )

  const filteredClients = useMemo(() => {
    if (!search.trim()) return localClients
    const q = search.toLowerCase()
    return localClients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.clientCompany && c.clientCompany.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    )
  }, [localClients, search])

  const handleSelect = (id: string) => {
    onChange(id)
    setIsOpen(false)
    setSearch("")
  }

  const handleQuickAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName.trim()) {
      toast.error("Client name is required")
      return
    }

    setIsSaving(true)
    try {
      const res = await createOrUpdateClient({
        name: newClientName.trim(),
        clientCompany: newClientCompany.trim() || undefined,
        email: newClientEmail.trim() || undefined,
      })

      if (res.success && res.client) {
        const created = res.client
        setLocalClients((prev) => [created, ...prev])
        onChange(created.id)
        toast.success(`Client "${created.name}" created and selected!`)
        setIsAddOpen(false)
        setIsOpen(false)
        setNewClientName("")
        setNewClientCompany("")
        setNewClientEmail("")
      } else {
        toast.error(res.error || "Failed to create client")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-border/80 bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#c82020] disabled:cursor-not-allowed disabled:opacity-50 text-left transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {selectedClient ? (
            <div className="truncate">
              <span className="font-semibold text-foreground">{selectedClient.name}</span>
              {selectedClient.clientCompany && (
                <span className="ml-1.5 text-muted-foreground text-[11px]">
                  ({selectedClient.clientCompany})
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">Select a client for this project...</span>
          )}
        </div>
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 ml-2" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border/80 bg-background p-1.5 shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95">
          {/* Search Input */}
          <div className="flex items-center gap-2 border-b border-border/60 px-2 pb-2 pt-1">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search client by name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Client List */}
          <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => {
                const isSelected = client.id === value
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleSelect(client.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                      isSelected
                        ? "bg-[#c82020]/10 text-[#c82020] font-semibold"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <div className="flex flex-col items-start truncate">
                      <span className="font-medium text-xs">{client.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        {client.clientCompany && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-2.5 w-2.5" />
                            {client.clientCompany}
                          </span>
                        )}
                        {client.email && <span>{client.email}</span>}
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#c82020] shrink-0" />}
                  </button>
                )
              })
            ) : (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No clients found matching &quot;{search}&quot;
              </div>
            )}
          </div>

          {/* Quick Add Client Action */}
          <div className="border-t border-border/60 pt-1.5 mt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setIsAddOpen(true)
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-[#c82020] hover:bg-[#c82020]/10 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New Client
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Client Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleQuickAddClient}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Quick Add Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Client Name *</Label>
                <Input
                  required
                  placeholder="e.g. John Doe / Nexus Ventures"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Company Name (Optional)</Label>
                <Input
                  placeholder="e.g. Acme Global Corporation"
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Email Address (Optional)</Label>
                <Input
                  type="email"
                  placeholder="e.g. accounts@acmeglobal.com"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold"
              >
                {isSaving ? "Saving..." : "Save & Select Client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
