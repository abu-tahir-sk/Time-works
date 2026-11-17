import { Metadata } from "next"

import { AgreementListClient } from "./agreement-list-client"

export const metadata: Metadata = {
  title: "Agreements | DocuFlow",
  description: "Create, sign, and manage your client agreements.",
}

export default function AgreementsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agreements</h1>
        <p className="text-muted-foreground">
          Draft, send for signature, and keep every client agreement in one
          place.
        </p>
      </div>

      <AgreementListClient />
    </div>
  )
}
