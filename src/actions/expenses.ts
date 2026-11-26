"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser, getUserCompany } from "@/lib/auth/utils"

export type ExpenseCategory =
  | "SALARIES"
  | "RENT"
  | "SOFTWARE"
  | "MARKETING"
  | "UTILITIES"
  | "HARDWARE"
  | "TRAVEL"
  | "TAX"
  | "OPERATIONS"
  | "OTHER"

export interface CreateExpenseInput {
  title: string
  category: string
  amount: number
  currency?: string
  expenseDate?: string
  paymentMethod?: string
  notes?: string
  receiptUrl?: string
  status?: string
}

export async function getCompanyExpenses() {
  try {
    const user = await requireUser()
    const company = await getUserCompany()

    const expenses = await prisma.expense.findMany({
      where: {
        companyId: company.id,
      },
      orderBy: {
        expenseDate: "desc",
      },
    })

    return { success: true, expenses }
  } catch (error: any) {
    console.error("getCompanyExpenses error:", error)
    return { success: false, error: error.message || "Failed to fetch expenses", expenses: [] }
  }
}

export async function createExpense(data: CreateExpenseInput) {
  try {
    const user = await requireUser()
    const company = await getUserCompany()

    if (!data.title || !data.amount || data.amount <= 0) {
      return { success: false, error: "Title and a valid positive amount are required." }
    }

    const expense = await prisma.expense.create({
      data: {
        companyId: company.id,
        userId: user.id,
        title: data.title.trim(),
        category: data.category || "OPERATIONS",
        amount: Number(data.amount),
        currency: data.currency || "USD",
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
        paymentMethod: data.paymentMethod || "BANK_TRANSFER",
        notes: data.notes?.trim() || null,
        receiptUrl: data.receiptUrl || null,
        status: data.status || "PAID",
      },
    })

    revalidatePath("/dashboard/expenses")
    revalidatePath("/dashboard")
    return { success: true, expense }
  } catch (error: any) {
    console.error("createExpense error:", error)
    return { success: false, error: error.message || "Failed to create expense" }
  }
}

export async function deleteExpense(id: string) {
  try {
    const company = await getUserCompany()

    const existing = await prisma.expense.findFirst({
      where: {
        id,
        companyId: company.id,
      },
    })

    if (!existing) {
      return { success: false, error: "Expense not found or unauthorized" }
    }

    await prisma.expense.delete({
      where: { id },
    })

    revalidatePath("/dashboard/expenses")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("deleteExpense error:", error)
    return { success: false, error: error.message || "Failed to delete expense" }
  }
}

export async function getCompanyFinancialOverview() {
  try {
    const company = await getUserCompany()

    // 1. Fetch Projects for Total Budget & Receivables
    const projects = await prisma.project.findMany({
      where: { companyId: company.id },
      include: {
        client: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    // 2. Fetch Project Payments
    const projectPayments = await prisma.projectPayment.findMany({
      where: { companyId: company.id, status: "COMPLETED" },
      include: {
        project: { select: { name: true, code: true } },
        client: { select: { name: true } },
      },
      orderBy: { paidAt: "desc" },
    })

    // 3. Fetch Expenses for Costs (Domains, Hosting, Operations)
    const expenses = await prisma.expense.findMany({
      where: { companyId: company.id },
      orderBy: { expenseDate: "desc" },
    })

    // Calculate Projects & Collections
    let totalProjectBudgets = 0
    let totalCollected = 0
    let pendingReceivables = 0

    projects.forEach((prj) => {
      totalProjectBudgets += prj.budget || 0
      const paid = prj.paidAmount || 0
      if (prj.budget > paid) {
        pendingReceivables += prj.budget - paid
      }
    })

    projectPayments.forEach((p) => {
      totalCollected += p.amount || 0
    })

    // If no projects yet, check fallback invoices
    if (projects.length === 0) {
      const invoices = await prisma.invoice.findMany({
        where: { companyId: company.id },
        select: { total: true, amountPaid: true, status: true },
      })
      invoices.forEach((inv) => {
        totalProjectBudgets += inv.total || 0
        totalCollected += inv.amountPaid || 0
        if (inv.status !== "PAID") {
          pendingReceivables += (inv.total || 0) - (inv.amountPaid || 0)
        }
      })
    }

    // Calculate Expenses
    let totalExpenses = 0
    const categoryTotals: Record<string, number> = {}

    expenses.forEach((exp) => {
      totalExpenses += exp.amount || 0
      const cat = exp.category || "OTHER"
      categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount
    })

    // Net Profit = Collected Revenue - Expenses
    const netProfit = totalCollected - totalExpenses
    const profitMargin = totalCollected > 0 ? (netProfit / totalCollected) * 100 : 0

    return {
      success: true,
      currency: projects[0]?.currency || "USD",
      summary: {
        totalInvoiced: totalProjectBudgets, // mapped for compatibility
        totalProjectBudgets,
        totalCollected,
        pendingReceivables,
        totalExpenses,
        netProfit,
        profitMargin: Math.round(profitMargin * 10) / 10,
        projectCount: projects.length,
        paymentCount: projectPayments.length,
        expenseCount: expenses.length,
      },
      categoryTotals,
      recentProjects: projects.slice(0, 5),
      recentPayments: projectPayments.slice(0, 5),
      recentExpenses: expenses.slice(0, 5),
    }
  } catch (error: any) {
    console.error("getCompanyFinancialOverview error:", error)
    return {
      success: false,
      error: error.message || "Failed to calculate financials",
      currency: "USD",
      summary: {
        totalInvoiced: 0,
        totalProjectBudgets: 0,
        totalCollected: 0,
        pendingReceivables: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        projectCount: 0,
        paymentCount: 0,
        expenseCount: 0,
      },
      categoryTotals: {},
      recentProjects: [],
      recentPayments: [],
      recentExpenses: [],
    }
  }
}
