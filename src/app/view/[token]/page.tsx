import { Metadata } from "next"
import { getInvoiceByToken } from "@/actions/invoices"
import { notFound } from "next/navigation"
import { PublicInvoiceClient } from "./public-invoice-client"

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const res = await getInvoiceByToken(params.token)
  if (!res.success || !res.invoice) return { title: "Invoice Not Found" }
  
  const inv: any = res.invoice
  
  return {
    title: `Invoice ${inv.invoiceNumber} - ${inv.company?.name || "Times Works"}`,
    description: `Invoice from ${inv.company?.name || "Times Works"} for ${inv.client?.name || "Client"}`,
  }
}

export default async function PublicInvoicePage({ params }: { params: { token: string } }) {
  const res = await getInvoiceByToken(params.token)

  if (!res.success || !res.invoice) {
    notFound()
  }

  const invoice: any = res.invoice
  const company = invoice.company || {}
  const client = invoice.client || {}

  return (
    <PublicInvoiceClient
      invoice={invoice}
      company={company}
      client={client}
    />
  )
}
