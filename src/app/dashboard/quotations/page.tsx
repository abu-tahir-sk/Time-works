import { requireUser } from "@/lib/auth/utils"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, FileSignature, Clock, CheckCircle2, Search, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ConvertQuotationButton } from "@/components/quotations/convert-quotation-button"

export const metadata = {
  title: "Quotations | Times Works",
  description: "Create and manage estimates and project quotes for prospective clients.",
}

export default async function QuotationsPage() {
  const user = await requireUser()

  const quotations = await prisma.quotation.findMany({
    where: { authorId: user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  })

  // Quotation metrics
  const totalCount = quotations.length
  const acceptedCount = quotations.filter((q) => q.status === "ACCEPTED").length
  const draftCount = quotations.filter((q) => q.status === "DRAFT").length

  return (
    <div className="space-y-6">
      {/* Quotations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quotations & Estimates</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Sales Pipeline
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Create, track, and convert client project estimates into active business revenue.
          </p>
        </div>

        <Link href="/dashboard/quotations/new">
          <Button size="sm" className="h-9 px-3.5 bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs">
            <Plus className="h-4 w-4 mr-1.5" /> New Quotation
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Quotations
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-[#c82020]">
              <FileSignature className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {totalCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Estimates prepared for prospects</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Accepted
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {acceptedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Approved by client</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-[0_1.6px_3.6px_0_rgba(0,0,0,0.06)] bg-card rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              In Draft / Pending
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {draftCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Under review or pending send</p>
          </CardContent>
        </Card>
      </div>

      {/* Quotations List */}
      {quotations.length === 0 ? (
        <Card className="border border-dashed border-border/80 rounded-lg text-center p-12 space-y-3 bg-muted/10">
          <div className="p-3 bg-[#c82020]/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center text-[#c82020]">
            <FileSignature className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">No quotations created yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Send clean, professionally formatted estimates to close prospective deals faster.
            </p>
          </div>
          <Link href="/dashboard/quotations/new">
            <Button size="sm" className="h-8.5 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white">
              Create First Quotation
            </Button>
          </Link>
        </Card>
      ) : (
        <Card className="border border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[650px]">
              <thead className="bg-muted/40 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Quotation #</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Valid Until</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-sans">
                {quotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      <Link href={`/quote/${quote.id}`} target="_blank" className="hover:text-[#c82020] hover:underline flex items-center gap-1">
                        {quote.quotationNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">{quote.client?.name || "Client"}</td>
                    <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                      {format(new Date(quote.validUntil), "MMM dd, yyyy")}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{quote.items?.length || 0} items</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          quote.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200"
                            : "bg-muted text-foreground border border-border/70"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <ConvertQuotationButton
                          quotationId={quote.id}
                          quotationNumber={quote.quotationNumber}
                          status={quote.status}
                        />
                        <Link href={`/quote/${quote.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-7 text-[11px] px-2 text-[#c82020] hover:bg-rose-50 dark:hover:bg-rose-950/40">
                            Client View <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
