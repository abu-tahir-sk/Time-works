"use server"

import { getUserCompany } from "@/lib/auth/utils"
import { prisma } from "@/lib/prisma"
import { calculateInvoiceTotals } from "@/lib/invoices/calculations"

export type DocumentKind = "INVOICE" | "QUOTATION" | "AGREEMENT"

export interface LibraryDocument {
  id: string
  kind: DocumentKind
  number: string
  title: string
  clientId: string | null
  client: string
  clientCompany: string | null
  status: string
  currency: string
  amount: number | null
  amountLabel: string | null
  updatedAt: string
  updatedLabel: string
  href: string
}

export interface DocumentSummary {
  totalDocuments: number
  updatedThisMonth: number
  valueLabel: string
  clientCount: number
  awaitingSignatures: number
  activeCount: number
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `₹${Math.round(value).toLocaleString("en-IN")}`
  }
}

function formatCompactMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  } catch {
    return formatMoney(value, currency)
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

export async function getDocumentLibrary(): Promise<
  | { success: true; documents: LibraryDocument[]; summary: DocumentSummary }
  | { success: false; error: string; documents: []; summary: DocumentSummary }
> {
  try {
    const company = await getUserCompany()

    const [invoices, quotations, agreements] = await Promise.all([
      prisma.invoice.findMany({
        where: { companyId: company.id },
        include: {
          client: { select: { id: true, name: true, clientCompany: true } },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.quotation.findMany({
        where: { client: { companyId: company.id } },
        include: {
          client: { select: { id: true, name: true, clientCompany: true } },
          items: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.agreement.findMany({
        where: { companyId: company.id },
        include: {
          client: { select: { id: true, name: true, clientCompany: true } },
        },
        orderBy: { updatedAt: "desc" },
      }),
    ])

    const documents: LibraryDocument[] = []

    for (const invoice of invoices) {
      documents.push({
        id: invoice.id,
        kind: "INVOICE",
        number: invoice.invoiceNumber,
        title: `Invoice for ${invoice.client.name}`,
        clientId: invoice.clientId,
        client: invoice.client.name,
        clientCompany: invoice.client.clientCompany,
        status: invoice.status,
        currency: invoice.currency,
        amount: invoice.total,
        amountLabel: formatMoney(invoice.total, invoice.currency),
        updatedAt: invoice.updatedAt.toISOString(),
        updatedLabel: formatDate(invoice.updatedAt),
        href: `/dashboard/invoices/${invoice.id}`,
      })
    }

    for (const quotation of quotations) {
      const totals = calculateInvoiceTotals(
        quotation.items.map((item: any) => ({
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountValue: item.discountValue,
          discountType: item.discountType as
            | "PERCENTAGE"
            | "FIXED"
            | null,
          taxRate: item.taxRate,
        })),
        quotation.discountValue,
        quotation.discountType as "PERCENTAGE" | "FIXED" | null
      )

      documents.push({
        id: quotation.id,
        kind: "QUOTATION",
        number: quotation.quotationNumber,
        title: `Quotation for ${quotation.client.name}`,
        clientId: quotation.clientId,
        client: quotation.client.name,
        clientCompany: quotation.client.clientCompany,
        status: quotation.status,
        currency: quotation.currency,
        amount: totals.grandTotal,
        amountLabel: formatMoney(totals.grandTotal, quotation.currency),
        updatedAt: quotation.updatedAt.toISOString(),
        updatedLabel: formatDate(quotation.updatedAt),
        href: `/quote/${quotation.id}`,
      })
    }

    for (const agreement of agreements) {
      documents.push({
        id: agreement.id,
        kind: "AGREEMENT",
        number: agreement.agreementNumber,
        title: agreement.title,
        clientId: agreement.clientId,
        client: agreement.client?.name ?? "No client",
        clientCompany: agreement.client?.clientCompany ?? null,
        status: agreement.status,
        currency: agreement.currency,
        amount: agreement.value,
        amountLabel:
          agreement.value != null
            ? formatMoney(agreement.value, agreement.currency)
            : null,
        updatedAt: agreement.updatedAt.toISOString(),
        updatedLabel: formatDate(agreement.updatedAt),
        href: `/dashboard/agreements`,
      })
    }

    documents.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    const totalValue = documents.reduce(
      (sum, document) => sum + (document.amount ?? 0),
      0
    )
    const clientIds = new Set(
      documents
        .map((document) => document.clientId)
        .filter((id): id is string => Boolean(id))
    )
    const awaitingSignatures = documents.filter(
      (document) =>
        document.kind === "AGREEMENT" &&
        document.status === "PENDING_SIGNATURE"
    ).length
    const inactiveStatuses = [
      "DRAFT",
      "EXPIRED",
      "CANCELLED",
      "REJECTED",
    ]
    const activeCount = documents.filter(
      (document) => !inactiveStatuses.includes(document.status)
    ).length

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const updatedThisMonth = documents.filter(
      (document) => new Date(document.updatedAt) >= monthStart
    ).length

    return {
      success: true,
      documents,
      summary: {
        totalDocuments: documents.length,
        updatedThisMonth,
        valueLabel: formatCompactMoney(totalValue, "INR"),
        clientCount: clientIds.size,
        awaitingSignatures,
        activeCount,
      },
    }
  } catch (error) {
    console.error("Get Document Library Error:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load your documents",
      documents: [],
      summary: {
        totalDocuments: 0,
        updatedThisMonth: 0,
        valueLabel: formatCompactMoney(0, "INR"),
        clientCount: 0,
        awaitingSignatures: 0,
        activeCount: 0,
      },
    }
  }
}
