import { Metadata } from "next"
import { requireUser } from "@/lib/auth/utils"
import { getAgreements } from "@/actions/agreements"

import { AgreementListClient } from "./agreement-list-client"

export const metadata: Metadata = {
  title: "Agreements | Times Works",
  description: "Create, sign, and manage your client agreements.",
}

export default async function AgreementsPage() {
  await requireUser()

  const res = await getAgreements()
  const agreements = res.success ? res.agreements : []

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agreements</h1>
        <p className="text-muted-foreground">
          Draft, send for signature, and keep every client agreement in one
          place.
        </p>
      </div>

      <AgreementListClient agreements={agreements as any} />
    </div>
  )
}
