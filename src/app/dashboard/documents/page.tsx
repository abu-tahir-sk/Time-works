import { Metadata } from "next"

import { DocumentLibraryClient } from "./document-library-client"

export const metadata: Metadata = {
  title: "Documents | DocuFlow",
  description: "All your business documents, organised in one place.",
}

export default function DocumentsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Every invoice, quotation, agreement, and supporting file in one
          searchable library.
        </p>
      </div>

      <DocumentLibraryClient />
    </div>
  )
}
