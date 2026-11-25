"use client"

import { useState } from "react"
import { useFieldArray } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  Plus,
  Trash2,
  User,
  FileSpreadsheet,
  Building2,
  Sparkles,
  CreditCard,
  Check,
  Shield,
  Percent,
  Truck,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn, formatMoney } from "@/lib/utils"
import { AddClientModal } from "./add-client-modal"
import { WatermarkSettings } from "./watermark-settings"

interface InvoiceEditorProps {
  form: any
  clients: any[]
  onAddClient: (client: any) => void
  onCreateInvoice?: () => void
  isSaving?: boolean
}

export function InvoiceEditor({ form, clients, onAddClient, onCreateInvoice, isSaving }: InvoiceEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  })

  const [showDiscountInput, setShowDiscountInput] = useState(form.watch("discountValue") > 0)
  const [showShippingInput, setShowShippingInput] = useState(false)
  const [shippingFee, setShippingFee] = useState<number>(0)
  type SectionKey = "details" | "client" | "items" | "notes" | "security"
  const [activeSection, setActiveSection] = useState<SectionKey>("details")

  // Watch fields for live summary calculation
  const watchedItems = form.watch("items") || []
  const currency = form.watch("currency") || "USD"
  const discountType = form.watch("discountType") || "PERCENTAGE"
  const discountValue = Number(form.watch("discountValue") || 0)

  // Calculate Subtotal and Tax
  let subtotal = 0
  let taxTotal = 0

  watchedItems.forEach((item: any) => {
    const qty = Number(item.quantity || 0)
    const rate = Number(item.unitPrice || 0)
    const taxRate = Number(item.taxRate || 0)
    const lineTotal = qty * rate
    subtotal += lineTotal
    taxTotal += lineTotal * (taxRate / 100)
  })

  // Calculate Discount
  let discountAmount = 0
  if (discountType === "PERCENTAGE") {
    discountAmount = subtotal * (discountValue / 100)
  } else {
    discountAmount = discountValue
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + taxTotal + shippingFee)

  const selectedClientId = form.watch("clientId")
  const selectedClient = clients.find((c) => c.id === selectedClientId)

  const handleClientSelect = (clientId: string) => {
    form.setValue("clientId", clientId)
    const client = clients.find((c) => c.id === clientId)
    if (client) {
      if (!form.getValues("clientEmail")) form.setValue("clientEmail", client.email || "")
      if (!form.getValues("clientAddress")) form.setValue("clientAddress", client.address || "")
    }
  }

  return (
    <Form {...form}>
      <form className="w-full">
        {/* Two-Column Layout (Matching Screenshot 1) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full min-w-0">
          
          {/* LEFT COLUMN: Main Invoice Form Cards (8 Cols) */}
          <div className="xl:col-span-8 space-y-4 w-full min-w-0">
            
            {/* Step Navigation Menu */}
            <div className="flex items-center gap-1.5 p-1.5 bg-muted/30 rounded-xl border border-border/60 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "details", label: "1. Details", icon: FileText },
                { id: "client", label: "2. Client", icon: User },
                { id: "items", label: "3. Line Items", icon: FileSpreadsheet },
                { id: "notes", label: "4. Remittance", icon: Building2 },
                { id: "security", label: "5. Security", icon: Shield },
              ].map((step) => {
                const isActive = activeSection === step.id
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveSection(step.id as SectionKey)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                      isActive
                        ? "bg-[#c82020] text-white shadow-2xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <step.icon className={cn("h-3.5 w-3.5", isActive ? "text-white" : "opacity-70")} />
                    <span>{step.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Card 1: Invoice Details */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-xs border border-border/60 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === "details" ? ("" as any) : "details")}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                    activeSection === "details" ? "bg-[#c82020] text-white" : "bg-muted text-muted-foreground"
                  )}>
                    1
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-foreground">Invoice Details</h2>
                    <p className="text-[11px] text-muted-foreground">Number, template, issue & due dates, payment terms</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeSection !== "details" && (
                    <span className="hidden sm:inline-flex text-[11px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
                      {form.watch("invoiceNumber") || "INV-2026"} • {form.watch("template") || "Professional"}
                    </span>
                  )}
                  <div className="p-1 rounded-md text-muted-foreground">
                    {activeSection === "details" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </div>
              </button>

              {activeSection === "details" && (
                <div className="px-5 pb-5 pt-2 border-t border-border/50 space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {/* 1. Invoice Number */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Invoice Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="INV-2026"
                            className="h-10 text-xs font-mono font-medium rounded-xl bg-muted/20"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 2. Template */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Template</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "professional"}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                              <SelectValue placeholder="Template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 3. Issue Date */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem className="space-y-1 flex flex-col">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Issue Date</FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger render={
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-10 text-xs justify-between rounded-xl font-normal bg-muted/20 border-input",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(new Date(field.value), "MM/dd/yy") : "Pick date"}
                                <CalendarIcon className="h-3.5 w-3.5 opacity-60 ml-1" />
                              </Button>
                            } />
                          </FormControl>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 4. Due Date */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="space-y-1 flex flex-col">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Due Date</FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger render={
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-10 text-xs justify-between rounded-xl font-normal bg-muted/20 border-input",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(new Date(field.value), "MM/dd/yy") : "Pick date"}
                                <CalendarIcon className="h-3.5 w-3.5 opacity-60 ml-1" />
                              </Button>
                            } />
                          </FormControl>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 5. Payment Terms */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Payment Terms</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "NET 15 days"}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                              <SelectValue placeholder="Terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Due upon receipt">Due upon receipt</SelectItem>
                            <SelectItem value="NET 15 days">NET 15 days</SelectItem>
                            <SelectItem value="NET 30 days">NET 30 days</SelectItem>
                            <SelectItem value="NET 60 days">NET 60 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Next Step Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setActiveSection("client")}
                  className="h-8.5 px-4 text-xs font-semibold bg-[#c82020] hover:bg-[#a81a1a] text-white"
                >
                  Next: Client Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Client */}
        <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-xs border border-border/60 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === "client" ? ("" as any) : "client")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                activeSection === "client" ? "bg-[#c82020] text-white" : "bg-muted text-muted-foreground"
              )}>
                2
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">Client</h2>
                <p className="text-[11px] text-muted-foreground">Client profile, billing email, address, and currency</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeSection !== "client" && (
                <span className="hidden sm:inline-flex text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
                  {selectedClient?.name || "No Client Selected"} • {currency}
                </span>
              )}
              <div className="p-1 rounded-md text-muted-foreground">
                {activeSection === "client" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </div>
          </button>

          {activeSection === "client" && (
            <div className="px-5 pb-5 pt-2 border-t border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Select an existing account or register a new client</span>
                <AddClientModal onSuccess={(client) => {
                  onAddClient(client)
                  form.setValue("clientId", client.id)
                }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Client Name */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Client Name</FormLabel>
                        {clients.length === 0 ? (
                          <div className="text-xs text-muted-foreground p-2 border rounded-xl bg-muted/20">
                            No clients yet. Click Add Client above.
                          </div>
                        ) : (
                          <Select onValueChange={handleClientSelect} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                                <SelectValue placeholder="Search or add client..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name} {c.clientCompany ? `(${c.clientCompany})` : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Email</label>
                    <Input
                      readOnly
                      placeholder="client@example.com"
                      value={selectedClient?.email || ""}
                      className="h-10 text-xs rounded-xl bg-muted/20 text-muted-foreground cursor-default"
                    />
                  </div>
                </div>

                {/* Currency */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Currency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "USD"}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">€ EUR - Euro</SelectItem>
                            <SelectItem value="GBP">£ GBP - British Pound</SelectItem>
                            <SelectItem value="INR">₹ INR - Indian Rupee</SelectItem>
                            <SelectItem value="CAD">CA$ CAD - Canadian Dollar</SelectItem>
                            <SelectItem value="AUD">A$ AUD - Australian Dollar</SelectItem>
                            <SelectItem value="SGD">S$ SGD - Singapore Dollar</SelectItem>
                            <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                            <SelectItem value="BDT">৳ BDT - Bangladeshi Taka</SelectItem>
                            <SelectItem value="JPY">¥ JPY - Japanese Yen</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Billing Address</label>
                <Input
                  readOnly
                  placeholder="123 Client Street, City, State 12345"
                  value={selectedClient?.address || ""}
                  className="h-10 text-xs rounded-xl bg-muted/20 text-muted-foreground cursor-default"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex justify-between items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection("details")}
                  className="h-8.5 px-3 text-xs"
                >
                  Back to Details
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setActiveSection("items")}
                  className="h-8.5 px-4 text-xs font-semibold bg-[#c82020] hover:bg-[#a81a1a] text-white"
                >
                  Next: Line Items <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Line Items */}
        <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-xs border border-border/60 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === "items" ? ("" as any) : "items")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                activeSection === "items" ? "bg-[#c82020] text-white" : "bg-muted text-muted-foreground"
              )}>
                3
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">Line Items</h2>
                <p className="text-[11px] text-muted-foreground">Deliverables, hours/quantity, rates, taxes, and discounts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeSection !== "items" && (
                <span className="hidden sm:inline-flex text-[11px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
                  {watchedItems.length} items • {formatMoney(grandTotal, currency)}
                </span>
              )}
              <div className="p-1 rounded-md text-muted-foreground">
                {activeSection === "items" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </div>
          </button>

          {activeSection === "items" && (
            <div className="px-5 pb-5 pt-2 border-t border-border/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Add products, professional services, or retainer deliverables.</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: "", quantity: 1, unit: "Hour", unitPrice: 0, taxRate: 0 })}
                  className="h-8 text-xs font-semibold rounded-lg border-border/80 hover:bg-muted self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5 mr-1 text-[#c82020]" />
                  Add Line Item
                </Button>
              </div>

              {/* Quick Preset Services (Wave & Invoice Generator Speed) */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-muted/20 border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider mr-1">
                  Quick Add:
                </span>
                <button
                  type="button"
                  onClick={() => append({ description: "Full-Stack Web & Software Engineering", quantity: 40, unit: "Hour", unitPrice: 85, taxRate: 0 })}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-background hover:bg-muted text-foreground border border-border/60 shadow-2xs transition-colors cursor-pointer"
                >
                  + Software Engineering (40h)
                </button>
                <button
                  type="button"
                  onClick={() => append({ description: "Enterprise Cloud Infrastructure & DevOps", quantity: 1, unit: "Month", unitPrice: 1500, taxRate: 0 })}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-background hover:bg-muted text-foreground border border-border/60 shadow-2xs transition-colors cursor-pointer"
                >
                  + Cloud Retainer ($1,500/mo)
                </button>
                <button
                  type="button"
                  onClick={() => append({ description: "Strategic Business Advisory & Financial Consulting", quantity: 8, unit: "Hour", unitPrice: 200, taxRate: 0 })}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-background hover:bg-muted text-foreground border border-border/60 shadow-2xs transition-colors cursor-pointer"
                >
                  + Financial Advisory (8h)
                </button>
                <button
                  type="button"
                  onClick={() => append({ description: "UI/UX Executive Design & Prototyping", quantity: 1, unit: "Project", unitPrice: 2200, taxRate: 0 })}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-background hover:bg-muted text-foreground border border-border/60 shadow-2xs transition-colors cursor-pointer"
                >
                  + UI/UX Design ($2,200)
                </button>
              </div>

              <div className="overflow-x-auto w-full border border-border/60 rounded-xl shadow-2xs">
                <table className="w-full min-w-[500px] text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-2 w-20 text-center">Qty / Hrs</th>
                      <th className="py-2.5 px-2 w-28 text-right">Rate</th>
                      <th className="py-2.5 px-2 w-20 text-right">Tax %</th>
                      <th className="py-2.5 px-3 w-28 text-right">Amount</th>
                      <th className="py-2.5 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {fields.map((field, index) => {
                      const qty = Number(form.watch(`items.${index}.quantity`) || 0)
                      const price = Number(form.watch(`items.${index}.unitPrice`) || 0)
                      const rowTotal = qty * price

                      return (
                        <tr key={field.id} className="hover:bg-muted/15 transition-colors">
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <Input
                                  placeholder="Service or product description..."
                                  className="h-8 text-xs rounded-lg border-transparent focus:border-input bg-transparent hover:bg-muted/30"
                                  {...field}
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  step="0.01"
                                  className="h-8 text-xs text-center font-mono rounded-lg border-transparent focus:border-input bg-transparent hover:bg-muted/30"
                                  {...field}
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.unitPrice`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  step="0.01"
                                  className="h-8 text-xs text-right font-mono rounded-lg border-transparent focus:border-input bg-transparent hover:bg-muted/30"
                                  {...field}
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.taxRate`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  step="1"
                                  placeholder="0"
                                  className="h-8 text-xs text-right font-mono rounded-lg border-transparent focus:border-input bg-transparent hover:bg-muted/30"
                                  {...field}
                                />
                              )}
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-foreground text-xs pr-3">
                            {formatMoney(rowTotal, currency)}
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={fields.length === 1}
                              onClick={() => remove(index)}
                              className="h-7 w-7 text-muted-foreground hover:text-red-600 rounded-md"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex justify-between items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection("client")}
                  className="h-8.5 px-3 text-xs"
                >
                  Back to Client
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setActiveSection("notes")}
                  className="h-8.5 px-4 text-xs font-semibold bg-[#c82020] hover:bg-[#a81a1a] text-white"
                >
                  Next: Remittance & Notes <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Sender Company & Payment Terms */}
        <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-xs border border-border/60 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === "notes" ? ("" as any) : "notes")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                activeSection === "notes" ? "bg-[#c82020] text-white" : "bg-muted text-muted-foreground"
              )}>
                4
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">Remittance & Notes</h2>
                <p className="text-[11px] text-muted-foreground">Issuing entity, payment terms, and client instructions</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeSection !== "notes" && (
                <span className="hidden sm:inline-flex text-[11px] text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
                  {form.watch("companyDetails.name") || "Times Works"}
                </span>
              )}
              <div className="p-1 rounded-md text-muted-foreground">
                {activeSection === "notes" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </div>
          </button>

          {activeSection === "notes" && (
            <div className="px-5 pb-5 pt-2 border-t border-border/50 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyDetails.name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs text-muted-foreground font-medium">Issuing Entity</FormLabel>
                      <FormControl>
                        <Input className="h-9 text-xs rounded-xl bg-muted/20 font-medium" {...field} value={field.value || "Times Works"} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyDetails.email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs text-muted-foreground font-medium">Billing Email</FormLabel>
                      <FormControl>
                        <Input className="h-9 text-xs rounded-xl bg-muted/20" {...field} value={field.value || "billing@timesworks.com"} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs text-muted-foreground font-medium">Project Notes / Purchase Order</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Client Project & Deliverables..." className="text-xs rounded-xl bg-muted/20 min-h-[70px]" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs text-muted-foreground font-medium">Payment Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Wire Remittance / Stripe Payment terms..." className="text-xs rounded-xl bg-muted/20 min-h-[70px]" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex justify-between items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection("items")}
                  className="h-8.5 px-3 text-xs"
                >
                  Back to Line Items
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setActiveSection("security")}
                  className="h-8.5 px-4 text-xs font-semibold bg-[#c82020] hover:bg-[#a81a1a] text-white"
                >
                  Next: Watermark Security <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Card 5: Watermarking & Anti-Fraud Security */}
        <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-xs border border-border/60 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === "security" ? ("" as any) : "security")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                activeSection === "security" ? "bg-[#c82020] text-white" : "bg-muted text-muted-foreground"
              )}>
                5
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#c82020]" />
                  Anti-Fraud & Watermark Security
                </h2>
                <p className="text-[11px] text-muted-foreground">Document watermark logo, tiling matrix, opacity, and rotation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeSection !== "security" && (
                <span className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#c82020]/10 text-[#c82020]">
                  Protection Active
                </span>
              )}
              <div className="p-1 rounded-md text-muted-foreground">
                {activeSection === "security" ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </div>
          </button>

          {activeSection === "security" && (
            <div className="px-5 pb-5 pt-2 border-t border-border/50 space-y-4">
              <WatermarkSettings />
              <div className="pt-2 flex justify-start">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection("notes")}
                  className="h-8.5 px-3 text-xs"
                >
                  Back to Remittance
                </Button>
              </div>
            </div>
          )}
        </div>

          </div>

          {/* RIGHT COLUMN: Sticky Summary Card (Matching Screenshot 1) (4 Cols) */}
          <div className="xl:col-span-4 xl:sticky top-6 space-y-4 w-full min-w-0">
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-5">
              <h2 className="text-base font-bold text-foreground">Summary</h2>

              <div className="space-y-3 text-xs">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-mono font-semibold text-foreground text-sm">
                    {formatMoney(subtotal, currency)}
                  </span>
                </div>

                {/* + Add Invoice Discount Button / Input */}
                {!showDiscountInput ? (
                  <button
                    type="button"
                    onClick={() => setShowDiscountInput(true)}
                    className="text-[#c82020] hover:text-[#a81a1a] font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    + Add Invoice Discount
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-foreground">Invoice Discount</span>
                      <button
                        type="button"
                        onClick={() => {
                          form.setValue("discountValue", 0)
                          setShowDiscountInput(false)
                        }}
                        className="text-muted-foreground hover:text-red-600 text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="h-8 text-xs font-mono rounded-lg bg-background"
                            {...field}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "PERCENTAGE"}>
                            <SelectTrigger className="h-8 text-xs w-24 rounded-lg bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">%</SelectItem>
                              <SelectItem value="FIXED">Flat</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* + Add Shipping Button / Input */}
                {!showShippingInput ? (
                  <button
                    type="button"
                    onClick={() => setShowShippingInput(true)}
                    className="text-[#c82020] hover:text-[#a81a1a] font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    + Add Shipping
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-foreground">Shipping / Extra Fee</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShippingFee(0)
                          setShowShippingInput(false)
                        }}
                        className="text-muted-foreground hover:text-red-600 text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={shippingFee || ""}
                      onChange={(e) => setShippingFee(Number(e.target.value) || 0)}
                      className="h-8 text-xs font-mono rounded-lg bg-background"
                    />
                  </div>
                )}

                {/* Tax */}
                <div className="flex justify-between items-center text-muted-foreground pt-1">
                  <span className="font-medium">Tax (from line items)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {formatMoney(taxTotal, currency)}
                  </span>
                </div>

                {/* Total Row */}
                <div className="border-t border-border/80 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-base text-foreground">Total</span>
                  <span className="font-mono text-2xl font-extrabold text-foreground tracking-tight">
                    {formatMoney(grandTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Pill Create Invoice Button (Matching Screenshot 1) */}
              <Button
                type="button"
                disabled={isSaving}
                onClick={onCreateInvoice}
                className="w-full h-11 text-xs font-bold rounded-full bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isSaving ? "Creating..." : "Create Invoice"}</span>
                <Check className="h-4 w-4 stroke-[3]" />
              </Button>
            </div>
          </div>

        </div>
      </form>
    </Form>
  )
}
