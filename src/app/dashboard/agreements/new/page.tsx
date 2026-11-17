import type { Metadata } from "next"
import { requireUser } from "@/lib/auth/utils"
import { getClients } from "@/actions/clients"
import { getCompanySettings } from "@/actions/company"
import { AgreementBuilder } from "@/components/agreements/agreement-builder"

export const metadata: Metadata = {
    title: "New Agreement | DocuFlow",
}

export default async function NewAgreementPage() {
    await requireUser()

    const [clientsRes, companyRes] = await Promise.all([
        getClients(),
        getCompanySettings(),
    ])

    const clients = clientsRes.success && clientsRes.clients ? clientsRes.clients : []
    const company = companyRes.success && companyRes.company ? companyRes.company : null

    return (
        <div className="-m-4 md:-m-6 lg:-m-8 h-[calc(100vh-60px)]">
            <AgreementBuilder clients={clients} company={company} />
        </div>
    )
}
