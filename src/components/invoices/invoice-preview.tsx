"use client"

import React, { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { useWatch } from "react-hook-form"
import { InvoicePdf } from "./invoice-pdf"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Printer } from "lucide-react"
import { SendEmailDialog } from "./send-email-dialog"

// PDFDownloadLink shouldn't strictly need dynamic if used conditionally after mount, but doing it ensures no SSR issues.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full w-full bg-white"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> }
)

interface StaticInvoicePreviewProps {
  data: any
  company: any
  clients: any[]
}

export function StaticInvoicePreview({ data, company, clients }: StaticInvoicePreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const pdfDocument = useMemo(() => {
    if (!data) return null
    return <InvoicePdf data={data} company={company} clients={clients} />
  }, [data, company, clients])

  if (!mounted) {
    return (
      <div className="w-full flex justify-center h-full pt-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-[210mm] px-2 py-3 bg-white dark:bg-card rounded-xl border border-border/60 shadow-2xs mb-3">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5 pl-2">
          Times Works Professional Document
        </span>
        <div className="flex items-center gap-2">
          {pdfDocument && (
            <SendEmailDialog
              data={data}
              company={company}
              clients={clients}
              pdfDocument={pdfDocument}
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 text-xs font-semibold shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Print
          </Button>
          {pdfDocument && (
            <PDFDownloadLink
              document={pdfDocument}
              fileName={`timesworks-${data?.quotationNumber ? 'quotation' : 'invoice'}-${data?.invoiceNumber || data?.quotationNumber || 'draft'}.pdf`}
            >
              {({ loading }: any) => (
                <Button size="sm" disabled={loading} className="h-8 text-xs font-bold bg-[#c82020] hover:bg-[#a81a1a] text-white shadow-xs">
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <div className="w-full max-w-[210mm] h-[calc(100vh-140px)] min-h-[800px] bg-white shadow-xl rounded-sm overflow-hidden border">
        {pdfDocument && (
          <PDFViewer width="100%" height="100%" className="border-none" showToolbar={false}>
            {pdfDocument}
          </PDFViewer>
        )}
      </div>
    </div>
  )
}

interface InvoicePreviewProps {
  form: any
  company: any
  clients: any[]
}

export function InvoicePreview({ form, company, clients }: InvoicePreviewProps) {
  const data = useWatch({ control: form.control })
  const [debouncedData, setDebouncedData] = useState(data)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedData(data)
    }, 300)
    return () => clearTimeout(handler)
  }, [data])

  return <StaticInvoicePreview data={debouncedData} company={company} clients={clients} />
}
