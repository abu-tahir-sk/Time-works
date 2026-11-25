"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { convertQuotationToInvoice } from "@/actions/quotations"
import { toast } from "sonner"
import { ArrowRightLeft, Loader2 } from "lucide-react"

interface ConvertQuotationButtonProps {
  quotationId: string
  quotationNumber: string
  status: string
}

export function ConvertQuotationButton({
  quotationId,
  quotationNumber,
  status,
}: ConvertQuotationButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    if (loading) return
    const confirmed = window.confirm(
      `Convert quotation ${quotationNumber} into a draft invoice?`
    )
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await convertQuotationToInvoice(quotationId)
      if (res.success && res.invoiceId) {
        toast.success(`Converted to Invoice ${res.invoiceNumber}!`)
        router.push(`/dashboard/invoices/${res.invoiceId}/edit`)
      } else {
        toast.error(res.error || "Failed to convert quotation")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during conversion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleConvert}
      disabled={loading}
      className="h-7 text-[11px] px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
      title="Convert this quote to an Invoice"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : (
        <ArrowRightLeft className="h-3 w-3 mr-1" />
      )}
      Convert to Invoice
    </Button>
  )
}
