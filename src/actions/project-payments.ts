"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser, getUserCompany } from "@/lib/auth/utils"

export interface RecordPaymentInput {
  projectId?: string
  clientId?: string
  amount: number
  currency?: string
  method?: string
  remark: string // রিমার্ক আবশ্যক (MANDATORY from audio)
  transactionId?: string
  paidAt?: string
}

export interface CreatePaymentLinkInput {
  projectId?: string
  clientId?: string
  title: string
  type: "FIXED" | "OPEN"
  amount?: number
  currency?: string
  description?: string
}

export async function getCompanyPayments() {
  try {
    const company = await getUserCompany()

    const payments = await prisma.projectPayment.findMany({
      where: { companyId: company.id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
            budget: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            clientCompany: true,
          },
        },
        paymentLink: {
          select: {
            token: true,
            title: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
    })

    const paymentLinks = await prisma.paymentLink.findMany({
      where: { companyId: company.id },
      include: {
        project: {
          select: { id: true, name: true, budget: true },
        },
        client: {
          select: { id: true, name: true },
        },
        payments: {
          select: { id: true, amount: true, paidAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, payments, paymentLinks }
  } catch (error: any) {
    console.error("getCompanyPayments error:", error)
    return { success: false, error: error.message || "Failed to fetch payments", payments: [], paymentLinks: [] }
  }
}

export async function recordProjectPayment(data: RecordPaymentInput) {
  try {
    const user = await requireUser()
    const company = await getUserCompany()

    if (!data.amount || data.amount <= 0) {
      return { success: false, error: "A valid positive payment amount is required." }
    }

    if (!data.remark || !data.remark.trim()) {
      return { success: false, error: "Payment Remark (রিমার্ক) is strictly required." }
    }

    // Auto-resolve client from project if not directly provided
    let clientId = data.clientId
    if (data.projectId && !clientId) {
      const proj = await prisma.project.findUnique({
        where: { id: data.projectId },
        select: { clientId: true },
      })
      if (proj) clientId = proj.clientId
    }

    const payment = await prisma.projectPayment.create({
      data: {
        companyId: company.id,
        projectId: data.projectId || null,
        clientId: clientId || null,
        amount: Number(data.amount),
        currency: data.currency || "USD",
        method: data.method || "BANK_TRANSFER",
        status: "COMPLETED",
        transactionId: data.transactionId?.trim() || null,
        remark: data.remark.trim(),
        paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
      },
    })

    // Update Project paidAmount if linked to a project
    if (data.projectId) {
      const allProjectPayments = await prisma.projectPayment.findMany({
        where: { projectId: data.projectId, status: "COMPLETED" },
        select: { amount: true },
      })
      const totalPaid = allProjectPayments.reduce((acc, curr) => acc + curr.amount, 0)

      await prisma.project.update({
        where: { id: data.projectId },
        data: { paidAmount: totalPaid },
      })
    }

    revalidatePath("/dashboard/payments")
    revalidatePath("/dashboard/projects")
    if (data.projectId) {
      revalidatePath(`/dashboard/projects/${data.projectId}`)
    }
    revalidatePath("/dashboard")
    return { success: true, payment }
  } catch (error: any) {
    console.error("recordProjectPayment error:", error)
    return { success: false, error: error.message || "Failed to record payment" }
  }
}

export async function createPaymentLink(data: CreatePaymentLinkInput) {
  try {
    const user = await requireUser()
    const company = await getUserCompany()

    if (!data.title || !data.title.trim()) {
      return { success: false, error: "Payment link title is required." }
    }

    if (data.type === "FIXED" && (!data.amount || data.amount <= 0)) {
      return { success: false, error: "A valid positive amount is required for a Fixed payment link." }
    }

    // Auto-resolve client from project
    let clientId = data.clientId
    if (data.projectId && !clientId) {
      const proj = await prisma.project.findUnique({
        where: { id: data.projectId },
        select: { clientId: true },
      })
      if (proj) clientId = proj.clientId
    }

    const link = await prisma.paymentLink.create({
      data: {
        companyId: company.id,
        projectId: data.projectId || null,
        clientId: clientId || null,
        title: data.title.trim(),
        type: data.type,
        amount: data.type === "FIXED" ? Number(data.amount) : null,
        currency: data.currency || "USD",
        description: data.description?.trim() || null,
        status: "ACTIVE",
      },
    })

    revalidatePath("/dashboard/payments")
    if (data.projectId) {
      revalidatePath(`/dashboard/projects/${data.projectId}`)
    }
    return { success: true, link }
  } catch (error: any) {
    console.error("createPaymentLink error:", error)
    return { success: false, error: error.message || "Failed to create payment link" }
  }
}

// -----------------------------------------------------------------------------
// PUBLIC PAYMENT GATEWAY LOGIC (Accessible by clients without logging in)
// -----------------------------------------------------------------------------

export async function getPublicPaymentLinkData(token: string) {
  try {
    const link = await prisma.paymentLink.findUnique({
      where: { token },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
            email: true,
            phone: true,
            bankName: true,
            accountName: true,
            accountNumber: true,
            ifsc: true,
            upiId: true,
            paymentInstructions: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            code: true,
            budget: true,
            paidAmount: true,
            currency: true,
          },
        },
        client: {
          select: {
            name: true,
            clientCompany: true,
            email: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            method: true,
            paidAt: true,
            remark: true,
          },
          orderBy: { paidAt: "desc" },
        },
      },
    })

    if (!link) {
      return { success: false, error: "Payment link not found or invalid." }
    }

    let dueAmount = 0
    if (link.project) {
      dueAmount = Math.max(0, link.project.budget - link.project.paidAmount)
    }

    return {
      success: true,
      link: {
        ...link,
        dueAmount,
      },
    }
  } catch (error: any) {
    console.error("getPublicPaymentLinkData error:", error)
    return { success: false, error: error.message || "Failed to retrieve payment link" }
  }
}

export async function submitClientPayment(
  token: string,
  data: {
    amount: number
    method: string
    transactionId?: string
    clientNote?: string
    payerName?: string
  }
) {
  try {
    const link = await prisma.paymentLink.findUnique({
      where: { token },
      include: { project: true },
    })

    if (!link) {
      return { success: false, error: "Payment link not found." }
    }

    let finalAmount = data.amount
    if (link.type === "FIXED" && link.amount) {
      finalAmount = link.amount
    }

    if (!finalAmount || finalAmount <= 0) {
      return { success: false, error: "A valid positive payment amount is required." }
    }

    const payer = data.payerName ? `Payer: ${data.payerName.trim()}` : ""
    const note = data.clientNote ? `Note: ${data.clientNote.trim()}` : ""
    const remark = `Online Remittance via Link (${link.title}). ${payer} ${note}`.trim()

    const payment = await prisma.projectPayment.create({
      data: {
        companyId: link.companyId,
        projectId: link.projectId,
        clientId: link.clientId,
        paymentLinkId: link.id,
        amount: finalAmount,
        currency: link.currency,
        method: data.method || "ONLINE",
        status: "COMPLETED",
        transactionId: data.transactionId?.trim() || `TXN-${Date.now().toString(36).toUpperCase()}`,
        remark,
        paidAt: new Date(),
      },
    })

    // Deduct from project balance automatically! (From audio: "অটোমেটিক ওখান থেকে মাইনাস আসবে এবং হিস্ট্রিটা একবারে পাই টু পাই সেভ থাকবে")
    if (link.projectId) {
      const allProjectPayments = await prisma.projectPayment.findMany({
        where: { projectId: link.projectId, status: "COMPLETED" },
        select: { amount: true },
      })
      const totalPaid = allProjectPayments.reduce((acc, curr) => acc + curr.amount, 0)

      await prisma.project.update({
        where: { id: link.projectId },
        data: { paidAmount: totalPaid },
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/payments")
    revalidatePath("/dashboard/projects")
    if (link.projectId) {
      revalidatePath(`/dashboard/projects/${link.projectId}`)
    }

    return { success: true, paymentId: payment.id, amount: finalAmount }
  } catch (error: any) {
    console.error("submitClientPayment error:", error)
    return { success: false, error: error.message || "Failed to process payment." }
  }
}
