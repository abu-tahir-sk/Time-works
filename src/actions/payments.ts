"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getUserCompany } from "@/lib/auth/utils"

export async function getPayments() {
  try {
    const company = await getUserCompany()

    const payments = await prisma.payment.findMany({
      where: {
        invoice: {
          companyId: company.id,
        },
      },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            amountPaid: true,
            currency: true,
            status: true,
            client: {
              select: {
                id: true,
                name: true,
                clientCompany: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        paidAt: "desc",
      },
    })

    return { success: true, payments }
  } catch (error: any) {
    console.error("Failed to fetch payments:", error)
    return { success: false, error: error.message || "Failed to fetch payments", payments: [] }
  }
}

export async function getInvoicesForPayment() {
  try {
    const company = await getUserCompany()

    const invoices = await prisma.invoice.findMany({
      where: {
        companyId: company.id,
        status: {
          notIn: ["CANCELLED", "REFUNDED"],
        },
      },
      select: {
        id: true,
        invoiceNumber: true,
        total: true,
        amountPaid: true,
        currency: true,
        status: true,
        dueDate: true,
        client: {
          select: {
            id: true,
            name: true,
            clientCompany: true,
          },
        },
      },
      orderBy: {
        issueDate: "desc",
      },
    })

    return { success: true, invoices }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch invoices", invoices: [] }
  }
}

export async function recordPayment(data: {
  invoiceId: string
  amount: number
  method: string
  transactionId?: string
  notes?: string
  paidAt?: Date | string
}) {
  try {
    const company = await getUserCompany()

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: data.invoiceId,
        companyId: company.id,
      },
    })

    if (!invoice) {
      throw new Error("Invoice not found or unauthorized")
    }

    const payAmount = Number(data.amount)
    if (isNaN(payAmount) || payAmount <= 0) {
      throw new Error("Payment amount must be greater than zero")
    }

    const paidAtDate = data.paidAt ? new Date(data.paidAt) : new Date()

    // Create payment entry
    const payment = await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: payAmount,
        method: data.method || "BANK_TRANSFER",
        status: "COMPLETED",
        transactionId: data.transactionId || null,
        notes: data.notes || null,
        paidAt: paidAtDate,
      },
    })

    // Update invoice balance and status
    const newAmountPaid = invoice.amountPaid + payAmount
    const isFullyPaid = newAmountPaid >= invoice.total
    const newStatus = isFullyPaid ? "PAID" : "PARTIALLY_PAID"

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        amountPaid: newAmountPaid,
        status: newStatus,
      },
    })

    revalidatePath("/dashboard/payments")
    revalidatePath("/dashboard/invoices")
    revalidatePath("/dashboard/expenses")
    revalidatePath("/dashboard")
    revalidatePath(`/dashboard/invoices/${invoice.id}`)

    return { success: true, payment }
  } catch (error: any) {
    console.error("Failed to record payment:", error)
    return { success: false, error: error.message || "Failed to record payment" }
  }
}

export async function deletePayment(paymentId: string) {
  try {
    const company = await getUserCompany()

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: true,
      },
    })

    if (!payment || payment.invoice.companyId !== company.id) {
      throw new Error("Payment record not found or unauthorized")
    }

    // Revert invoice amountPaid
    const invoice = payment.invoice
    const revertedAmountPaid = Math.max(0, invoice.amountPaid - payment.amount)
    let revertedStatus = invoice.status
    if (revertedAmountPaid <= 0) {
      revertedStatus = "SENT"
    } else if (revertedAmountPaid < invoice.total) {
      revertedStatus = "PARTIALLY_PAID"
    }

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        amountPaid: revertedAmountPaid,
        status: revertedStatus,
      },
    })

    await prisma.payment.delete({
      where: { id: paymentId },
    })

    revalidatePath("/dashboard/payments")
    revalidatePath("/dashboard/invoices")
    revalidatePath("/dashboard/expenses")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete payment:", error)
    return { success: false, error: error.message || "Failed to delete payment" }
  }
}
