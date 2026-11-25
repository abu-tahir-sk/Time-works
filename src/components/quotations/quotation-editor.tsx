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
  Building2,
  Sparkles,
  Check,
  Shield,
  Percent,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn, formatMoney } from "@/lib/utils"
import { AddClientModal } from "@/components/invoices/add-client-modal"
import { WatermarkSettings } from "@/components/invoices/watermark-settings"

interface QuotationEditorProps {
  form: any
  clients: any[]
  onAddClient: (client: any) => void
  onSaveQuotation?: () => void
  isSaving?: boolean
}

export function QuotationEditor({
  form,
  clients,
  onAddClient,
  onSaveQuotation,
  isSaving,
}: QuotationEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const [showDiscountInput, setShowDiscountInput] = useState(form.watch("discountValue") > 0)

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

  const grandTotal = Math.max(0, subtotal - discountAmount + taxTotal)

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
        {/* Two-Column Responsive Layout matching CherryWorks PRO */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full min-w-0">
          
          {/* LEFT COLUMN: Main Form Cards (8 cols) */}
          <div className="xl:col-span-8 space-y-6 w-full min-w-0">
            
            {/* Card 1: Quotation Details */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">Quotation Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Quotation Number */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="quotationNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Quote Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="QT-2026"
                            className="h-10 text-xs font-mono font-medium rounded-xl bg-muted/20"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 2. Issue Date */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem className="space-y-1 flex flex-col">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Issue Date</FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger
                              render={
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
                              }
                            />
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

                {/* 3. Valid Until (Expiry Date) */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem className="space-y-1 flex flex-col">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Valid Until (Expiry)</FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger
                              render={
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
                              }
                            />
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

                {/* 4. Status */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "DRAFT"}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="SENT">Sent</SelectItem>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Client & Counterparty */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">Client Information</h2>
                <AddClientModal
                  onSuccess={(client) => {
                    onAddClient(client)
                    form.setValue("clientId", client.id)
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Client Name */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs text-muted-foreground font-medium">Client Name *</FormLabel>
                        {clients.length === 0 ? (
                          <div className="text-xs text-muted-foreground p-2 border rounded-xl bg-muted/20">
                            No clients yet. Click Add Client above.
                          </div>
                        ) : (
                          <Select onValueChange={handleClientSelect} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="h-10 text-xs rounded-xl bg-muted/20">
                                <SelectValue placeholder="Select or search client..." />
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
                    <label className="text-xs text-muted-foreground font-medium">Email Address</label>
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
                            <SelectItem value="BDT">৳ BDT - Bangladeshi Taka</SelectItem>
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
            </div>

            {/* Card 3: Line Items (Pricing & Deliverables) */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-foreground">Items & Deliverables</h2>
                  <p className="text-[11px] text-muted-foreground">Proposed products, billable services, or project milestones.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: "", quantity: 1, unit: "Project", unitPrice: 0, taxRate: 0 })}
                  className="h-8 text-xs font-semibold rounded-lg border-border/80 hover:bg-muted self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5 mr-1 text-[#c82020]" />
                  Add Line Item
                </Button>
              </div>

              {/* Preset Quick Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-muted/20 border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider mr-1">
                  Quick Add:
                </span>
                <button
                  type="button"
                  onClick={() => append({ description: "Enterprise Digital Workflow Transformation", quantity: 1, unit: "Project", unitPrice: 3500, taxRate: 10 })}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-background hover:bg-muted text-foreground border border-border/60 shadow-2xs transition-colors cursor-pointer"
                >
                  + Digital Transformation ($3,500)
                </button>
                <button
                  type="button"
                  onClick={() => append({ description: "Custom Cloud API & Dynamics 365 Architecture", quantity: 1, unit: "System", unitPrice: 1800, taxRate: 10 })}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-background hover:bg-muted text-foreground border border-border/60 shadow-2xs transition-colors cursor-pointer"
                >
                  + Cloud Architecture ($1,800)
                </button>
                <button
                  type="button"
                  onClick={() => append({ description: "Annual Priority SLA Maintenance & Support", quantity: 1, unit: "Year", unitPrice: 700, taxRate: 10 })}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-background hover:bg-muted text-foreground border border-border/60 shadow-2xs transition-colors cursor-pointer"
                >
                  + SLA Support ($700)
                </button>
              </div>

              {/* Items Table */}
              <div className="space-y-3 pt-2">
                {fields.map((field, index) => {
                  const qty = Number(form.watch(`items.${index}.quantity`) || 0)
                  const rate = Number(form.watch(`items.${index}.unitPrice`) || 0)
                  const lineTotal = qty * rate

                  return (
                    <div
                      key={field.id}
                      className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-3 relative group"
                    >
                      <div className="grid grid-cols-12 gap-3 items-start">
                        {/* Description */}
                        <div className="col-span-12 lg:col-span-5">
                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel className="text-[11px] text-muted-foreground font-medium">Description</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Proposed service or deliverable..."
                                    className="h-9 text-xs rounded-lg bg-background"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Quantity */}
                        <div className="col-span-4 sm:col-span-2 lg:col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel className="text-[11px] text-muted-foreground font-medium">Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="h-9 text-xs rounded-lg bg-background text-center font-mono"
                                    {...field}
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Unit */}
                        <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unit`}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel className="text-[11px] text-muted-foreground font-medium">Unit</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Hrs"
                                    className="h-9 text-xs rounded-lg bg-background text-center"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Unit Price / Rate */}
                        <div className="col-span-4 sm:col-span-3 lg:col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel className="text-[11px] text-muted-foreground font-medium">Rate ({currency})</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    className="h-9 text-xs rounded-lg bg-background font-mono text-right"
                                    {...field}
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Line Total & Trash */}
                        <div className="col-span-12 sm:col-span-5 lg:col-span-2 flex items-end justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                          <div className="text-right">
                            <span className="text-[10px] text-muted-foreground uppercase block font-medium">Amount</span>
                            <span className="text-xs font-bold font-mono text-foreground">
                              {formatMoney(lineTotal, currency)}
                            </span>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={fields.length === 1}
                            onClick={() => remove(index)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Card 4: Remittance, Notes & Validity Terms */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">Terms & Specifications</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs text-muted-foreground font-medium">Client Notes / Scope Deliverables</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Times Works delivers enterprise document workflow infrastructure with a 99.99% uptime SLA."
                          className="min-h-[85px] text-xs rounded-xl bg-muted/20 resize-y"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs text-muted-foreground font-medium">Payment Instructions & Terms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="1. Quotation is valid for 30 calendar days from issue date.&#10;2. 50% advance upon project authorization, 50% upon final acceptance milestone."
                          className="min-h-[85px] text-xs rounded-xl bg-muted/20 resize-y"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Card 5: Anti-Fraud & Watermark Security */}
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6">
              <WatermarkSettings />
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Summary Card (4 cols) */}
          <div className="xl:col-span-4 w-full min-w-0 xl:sticky xl:top-20 space-y-4">
            <div className="bg-white dark:bg-[#181a20] rounded-2xl shadow-sm border border-border/60 p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">Summary</h2>

              <div className="space-y-3 text-xs">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatMoney(subtotal, currency)}
                  </span>
                </div>

                {/* Discount */}
                {showDiscountInput ? (
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-foreground">Quotation Discount</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDiscountInput(false)
                          form.setValue("discountValue", 0)
                        }}
                        className="text-[10px] text-muted-foreground hover:text-destructive"
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
                            placeholder="0"
                            className="h-8 text-xs font-mono"
                            {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "PERCENTAGE"}>
                            <SelectTrigger className="h-8 w-24 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">%</SelectItem>
                              <SelectItem value="FIXED">{currency}</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDiscountInput(true)}
                    className="text-xs font-semibold text-[#c82020] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    + Add Quotation Discount
                  </button>
                )}

                {/* Tax */}
                <div className="flex justify-between items-center text-muted-foreground pt-1 border-t border-border/40">
                  <span>Tax (from items)</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatMoney(taxTotal, currency)}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-baseline pt-3 border-t border-border text-foreground">
                  <span className="text-sm font-bold">Total</span>
                  <span className="text-2xl font-extrabold font-mono text-[#c82020]">
                    {formatMoney(grandTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Primary Save Action */}
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={onSaveQuotation}
                  disabled={isSaving}
                  className="w-full h-11 text-xs font-bold rounded-xl bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>{isSaving ? "Saving Quotation..." : "Save Quotation"}</span>
                </Button>
              </div>
            </div>

            {/* Quick Helper Notice */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#c82020]" />
                1-Click Invoice Conversion
              </p>
              <p className="text-[11px] leading-relaxed">
                Once approved by the client, you can convert this quote directly into an invoice with one click from the Quotations table.
              </p>
            </div>
          </div>

        </div>
      </form>
    </Form>
  )
}
