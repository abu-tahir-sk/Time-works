import { Metadata } from "next"
import { getCompanyPayments } from "@/actions/project-payments"
import { getProjects } from "@/actions/projects"
import { getUserCompany, requireUser } from "@/lib/auth/utils"
import { PaymentsHubClient } from "./payments-hub-client"

export const metadata: Metadata = {
  title: "Payments & Gateway Links | Times Works",
  description: "Track received payments, client remittances, and generate Fixed or Open amount payment links.",
}

export const dynamic = "force-dynamic"

export default async function PaymentsPage() {
  await requireUser()

  const [payRes, projRes, company] = await Promise.all([
    getCompanyPayments(),
    getProjects(),
    getUserCompany(),
  ])

  const payments = payRes.success && payRes.payments ? payRes.payments : []
  const paymentLinks = payRes.success && payRes.paymentLinks ? payRes.paymentLinks : []
  const projects = projRes.success && projRes.projects ? projRes.projects : []

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <PaymentsHubClient
        initialPayments={payments}
        initialPaymentLinks={paymentLinks}
        projects={projects}
        company={company}
      />
    </div>
  )
}
