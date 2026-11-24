import { Metadata } from "next"
import { getClientsWithLedger } from "@/actions/clients"
import { getUserCompany } from "@/lib/auth/utils"
import { ClientsClient } from "./clients-client"

export const metadata: Metadata = {
  title: "Customers & CRM | Times Works",
  description: "Customer management, statements, and individual ledger balances.",
}

export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  const [clientsRes, company] = await Promise.all([
    getClientsWithLedger(),
    getUserCompany(),
  ])

  const clients = clientsRes.success && clientsRes.clients ? clientsRes.clients : []

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <ClientsClient initialClients={clients} company={company} />
    </div>
  )
}
