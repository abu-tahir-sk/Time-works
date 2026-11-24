"use server"

import { prisma } from "@/lib/prisma"
import { requireUser, getUserCompany } from "@/lib/auth/utils"

export type AnalyticsPeriod = "30D" | "6M" | "1Y" | "ALL"

export interface MonthlyTrendItem {
  monthKey: string // YYYY-MM
  label: string    // "Jan", "Feb"
  fullLabel: string // "Jan 2026"
  invoiced: number
  collected: number
  expenses: number
  netProfit: number
}

export interface ExpenseCategoryStat {
  category: string
  amount: number
  percentage: number
  count: number
}

export interface AgingReceivableStat {
  current: { amount: number; count: number }
  overdue1_30: { amount: number; count: number }
  overdue31_60: { amount: number; count: number }
  overdue60_plus: { amount: number; count: number }
  totalOutstanding: number
}

export interface TopClientStat {
  id: string
  name: string
  companyName?: string | null
  email?: string | null
  totalInvoiced: number
  totalPaid: number
  outstanding: number
  invoiceCount: number
}

export interface QuotationPipelineStat {
  totalCount: number
  totalValue: number
  acceptedCount: number
  acceptedValue: number
  pendingCount: number
  pendingValue: number
  conversionRate: number
}

export interface FinancialAnalyticsData {
  currency: string
  period: AnalyticsPeriod
  companyName: string
  kpis: {
    totalInvoiced: number
    totalCollected: number
    pendingReceivables: number
    totalExpenses: number
    netProfit: number
    operatingMargin: number
    collectionRate: number
    activeClients: number
    avgInvoiceValue: number
    totalInvoicesCount: number
    paidInvoicesCount: number
  }
  monthlyTrends: MonthlyTrendItem[]
  expenseCategories: ExpenseCategoryStat[]
  agingReceivables: AgingReceivableStat
  topClients: TopClientStat[]
  quotationPipeline: QuotationPipelineStat
}

export async function getFinancialAnalytics(period: AnalyticsPeriod = "1Y"): Promise<{
  success: boolean
  data?: FinancialAnalyticsData
  error?: string
}> {
  try {
    const user = await requireUser()
    const company = await getUserCompany()

    // Determine start date filter
    const now = new Date()
    let startDate: Date | undefined

    if (period === "30D") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else if (period === "6M") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    } else if (period === "1Y") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
    }

    // 1. Fetch Invoices
    const invoices = await prisma.invoice.findMany({
      where: {
        companyId: company.id,
        ...(startDate ? { issueDate: { gte: startDate } } : {}),
      },
      include: {
        client: {
          select: { id: true, name: true, clientCompany: true, email: true },
        },
      },
      orderBy: { issueDate: "asc" },
    })

    // 2. Fetch Expenses
    const expenses = await prisma.expense.findMany({
      where: {
        companyId: company.id,
        ...(startDate ? { expenseDate: { gte: startDate } } : {}),
      },
      orderBy: { expenseDate: "asc" },
    })

    // 3. Fetch Quotations for Funnel
    const quotations = await prisma.quotation.findMany({
      where: {
        authorId: user.id,
        ...(startDate ? { issueDate: { gte: startDate } } : {}),
      },
      include: {
        items: true,
      },
      orderBy: { issueDate: "desc" },
    })

    const currency = invoices[0]?.currency || expenses[0]?.currency || "INR"

    // Calculate Executive KPIs
    let totalInvoiced = 0
    let totalCollected = 0
    let pendingReceivables = 0
    let paidInvoicesCount = 0

    const clientMap = new Map<string, TopClientStat>()

    // Aging categories
    const aging: AgingReceivableStat = {
      current: { amount: 0, count: 0 },
      overdue1_30: { amount: 0, count: 0 },
      overdue31_60: { amount: 0, count: 0 },
      overdue60_plus: { amount: 0, count: 0 },
      totalOutstanding: 0,
    }

    invoices.forEach((inv) => {
      const invTotal = inv.total || 0
      const invPaid = inv.amountPaid || 0
      const unpaid = Math.max(0, invTotal - invPaid)

      totalInvoiced += invTotal
      totalCollected += invPaid

      if (inv.status === "PAID" || invPaid >= invTotal) {
        paidInvoicesCount++
      }

      if (inv.status !== "PAID" && inv.status !== "CANCELLED" && inv.status !== "REFUNDED" && unpaid > 0) {
        pendingReceivables += unpaid
        aging.totalOutstanding += unpaid

        const dueDate = new Date(inv.dueDate)
        const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays <= 0) {
          aging.current.amount += unpaid
          aging.current.count++
        } else if (diffDays <= 30) {
          aging.overdue1_30.amount += unpaid
          aging.overdue1_30.count++
        } else if (diffDays <= 60) {
          aging.overdue31_60.amount += unpaid
          aging.overdue31_60.count++
        } else {
          aging.overdue60_plus.amount += unpaid
          aging.overdue60_plus.count++
        }
      }

      // Group by client
      if (inv.client) {
        const cId = inv.client.id
        const existing = clientMap.get(cId) || {
          id: cId,
          name: inv.client.name,
          companyName: inv.client.clientCompany,
          email: inv.client.email,
          totalInvoiced: 0,
          totalPaid: 0,
          outstanding: 0,
          invoiceCount: 0,
        }
        existing.totalInvoiced += invTotal
        existing.totalPaid += invPaid
        existing.outstanding += unpaid
        existing.invoiceCount += 1
        clientMap.set(cId, existing)
      }
    })

    // Expenses calculation
    let totalExpenses = 0
    const categoryAgg: Record<string, { amount: number; count: number }> = {}

    expenses.forEach((exp) => {
      const amt = exp.amount || 0
      totalExpenses += amt
      const cat = exp.category || "OPERATIONS"
      if (!categoryAgg[cat]) {
        categoryAgg[cat] = { amount: 0, count: 0 }
      }
      categoryAgg[cat].amount += amt
      categoryAgg[cat].count += 1
    })

    const expenseCategories: ExpenseCategoryStat[] = Object.entries(categoryAgg)
      .map(([category, val]) => ({
        category,
        amount: val.amount,
        count: val.count,
        percentage: totalExpenses > 0 ? Math.round((val.amount / totalExpenses) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    // Monthly trends (12 months)
    const monthlyMap = new Map<string, MonthlyTrendItem>()
    const monthsToGenerate = period === "30D" ? 6 : period === "6M" ? 6 : 12

    for (let i = monthsToGenerate - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const label = d.toLocaleString("en-US", { month: "short" })
      const fullLabel = d.toLocaleString("en-US", { month: "short", year: "numeric" })
      monthlyMap.set(key, {
        monthKey: key,
        label,
        fullLabel,
        invoiced: 0,
        collected: 0,
        expenses: 0,
        netProfit: 0,
      })
    }

    // Populate monthly invoices
    invoices.forEach((inv) => {
      const d = new Date(inv.issueDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const entry = monthlyMap.get(key)
      if (entry) {
        entry.invoiced += inv.total || 0
        entry.collected += inv.amountPaid || 0
      }
    })

    // Populate monthly expenses
    expenses.forEach((exp) => {
      const d = new Date(exp.expenseDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const entry = monthlyMap.get(key)
      if (entry) {
        entry.expenses += exp.amount || 0
      }
    })

    // Calculate monthly net profit
    monthlyMap.forEach((entry) => {
      entry.netProfit = entry.collected - entry.expenses
    })

    const monthlyTrends = Array.from(monthlyMap.values())

    // Top clients sorted by total invoiced
    const topClients = Array.from(clientMap.values())
      .sort((a, b) => b.totalInvoiced - a.totalInvoiced)
      .slice(0, 6)

    // Quotation Funnel
    let quoteTotalCount = 0
    let quoteTotalVal = 0
    let quoteAcceptedCount = 0
    let quoteAcceptedVal = 0
    let quotePendingCount = 0
    let quotePendingVal = 0

    quotations.forEach((q) => {
      quoteTotalCount++
      const val = q.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
      quoteTotalVal += val

      if (q.status === "ACCEPTED" || q.status === "CONVERTED") {
        quoteAcceptedCount++
        quoteAcceptedVal += val
      } else if (q.status === "SENT" || q.status === "DRAFT") {
        quotePendingCount++
        quotePendingVal += val
      }
    })

    const netProfit = totalCollected - totalExpenses
    const operatingMargin = totalCollected > 0 ? (netProfit / totalCollected) * 100 : 0
    const collectionRate = totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0
    const avgInvoiceValue = invoices.length > 0 ? totalInvoiced / invoices.length : 0

    return {
      success: true,
      data: {
        currency,
        period,
        companyName: company.name,
        kpis: {
          totalInvoiced,
          totalCollected,
          pendingReceivables,
          totalExpenses,
          netProfit,
          operatingMargin: Math.round(operatingMargin * 10) / 10,
          collectionRate: Math.round(collectionRate * 10) / 10,
          activeClients: clientMap.size,
          avgInvoiceValue: Math.round(avgInvoiceValue),
          totalInvoicesCount: invoices.length,
          paidInvoicesCount,
        },
        monthlyTrends,
        expenseCategories,
        agingReceivables: aging,
        topClients,
        quotationPipeline: {
          totalCount: quoteTotalCount,
          totalValue: quoteTotalVal,
          acceptedCount: quoteAcceptedCount,
          acceptedValue: quoteAcceptedVal,
          pendingCount: quotePendingCount,
          pendingValue: quotePendingVal,
          conversionRate:
            quoteTotalCount > 0 ? Math.round((quoteAcceptedCount / quoteTotalCount) * 1000) / 10 : 0,
        },
      },
    }
  } catch (error: any) {
    console.error("getFinancialAnalytics error:", error)
    return {
      success: false,
      error: error.message || "Failed to load financial analytics",
    }
  }
}
