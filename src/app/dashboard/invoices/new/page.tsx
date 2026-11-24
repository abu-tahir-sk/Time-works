import { Metadata } from "next"
import { InvoiceBuilder } from "@/components/invoices/invoice-builder"
import { getClients } from "@/actions/clients"
import { getCompanySettings } from "@/actions/company"
import { requireUser } from "@/lib/auth/utils"

export const metadata: Metadata = {
  title: "New Invoice | Times Works",
  description: "Create a new professional invoice",
}

export default async function NewInvoicePage() {
  await requireUser() // Ensure authenticated

  const [clientsRes, companyRes] = await Promise.all([
    getClients(),
    getCompanySettings()
  ])

  const clients = clientsRes.success && clientsRes.clients ? clientsRes.clients : []
  const company = companyRes.success && companyRes.company ? companyRes.company : null

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <InvoiceBuilder clients={clients} company={company} />
    </div>
  )
}
