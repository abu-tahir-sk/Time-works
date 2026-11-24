import { Metadata } from "next"
import { getPayments, getInvoicesForPayment } from "@/actions/payments"
import { getUserCompany } from "@/lib/auth/utils"
import { PaymentsClient } from "./payments-client"

export const metadata: Metadata = {
  title: "Payments & Collections | Times Works",
  description: "Track received payments, client remittances, and transaction ledgers.",
}

export const dynamic = "force-dynamic"

export default async function PaymentsPage() {
  const [paymentsRes, invoicesRes, company] = await Promise.all([
    getPayments(),
    getInvoicesForPayment(),
    getUserCompany(),
  ])

  const payments = paymentsRes.success && paymentsRes.payments ? paymentsRes.payments : []
  const invoices = invoicesRes.success && invoicesRes.invoices ? invoicesRes.invoices : []

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <PaymentsClient
        initialPayments={payments}
        invoices={invoices}
        company={company}
      />
    </div>
  )
}
