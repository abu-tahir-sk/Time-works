import { Metadata } from "next"
import { AlertCircle } from "lucide-react"

import { getDocumentLibrary } from "@/actions/documents"
import { DocumentLibraryClient } from "./document-library-client"

export const metadata: Metadata = {
  title: "Documents | DocuFlow",
  description: "All your business documents, organised in one place.",
}

export default async function DocumentsPage() {
  const res = await getDocumentLibrary()

  if (!res.success) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <AlertCircle className="h-8 w-8" />
          <p className="text-lg font-medium">Failed to load documents</p>
          <p className="text-sm">{res.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Every invoice, quotation, and agreement your team has saved — live
          from your workspace.
        </p>
      </div>

      <DocumentLibraryClient
        documents={res.documents}
        summary={res.summary}
      />
    </div>
  )
}
