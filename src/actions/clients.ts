"use server"

import { prisma } from "@/lib/prisma"
import { getUserCompany } from "@/lib/auth/utils"
import { clientSchema } from "@/lib/clients/schema"
import { revalidatePath } from "next/cache"

export async function createOrUpdateClient(data: any) {
  try {
    const company = await getUserCompany()
    
    // Validate data
    const parsedData = clientSchema.parse(data)
    
    let client;
    if (parsedData.id) {
      // Update existing client, ensure it belongs to the company
      const existing = await prisma.client.findFirst({
        where: { id: parsedData.id, companyId: company.id }
      })
      if (!existing) throw new Error("Client not found or unauthorized")
      
      client = await prisma.client.update({
        where: { id: parsedData.id },
        data: {
          name: parsedData.name,
          clientCompany: parsedData.clientCompany,
          email: parsedData.email,
          phone: parsedData.phone,
          address: parsedData.address,
          taxId: parsedData.taxId,
        }
      })
    } else {
      // Create new client
      client = await prisma.client.create({
        data: {
          companyId: company.id,
          name: parsedData.name,
          clientCompany: parsedData.clientCompany,
          email: parsedData.email,
          phone: parsedData.phone,
          address: parsedData.address,
          taxId: parsedData.taxId,
        }
      })
    }
    
    revalidatePath("/dashboard/clients")
    revalidatePath("/dashboard/invoices")
    return { success: true, client }
  } catch (error: any) {
    console.error("Failed to save client:", error)
    return { success: false, error: error.message || "Failed to save client" }
  }
}

export async function getClients() {
  try {
    const company = await getUserCompany()
    const clients = await prisma.client.findMany({
      where: { companyId: company.id },
      orderBy: { name: "asc" }
    })
    return { success: true, clients }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteClient(id: string) {
  try {
    const company = await getUserCompany()
    
    // Ensure client belongs to the company
    const existing = await prisma.client.findFirst({
      where: { id, companyId: company.id }
    })
    if (!existing) throw new Error("Client not found or unauthorized")
    
    // Prisma will throw an error if this client has invoices and onDelete is Restricted.
    // In our schema, Client -> Invoices is Restrict.
    await prisma.client.delete({
      where: { id }
    })
    
    revalidatePath("/dashboard/clients")
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { success: false, error: "Cannot delete this client because they have existing invoices." }
    }
    return { success: false, error: error.message || "Failed to delete client" }
  }
}

export async function getClientsWithLedger() {
  try {
    const company = await getUserCompany()

    const rawClients = await prisma.client.findMany({
      where: { companyId: company.id },
      include: {
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            amountPaid: true,
            currency: true,
            status: true,
            issueDate: true,
            dueDate: true,
          },
          orderBy: { issueDate: "desc" },
        },
        quotations: {
          select: {
            id: true,
            quotationNumber: true,
            status: true,
            issueDate: true,
          },
          orderBy: { issueDate: "desc" },
        },
        agreements: {
          select: {
            id: true,
            agreementNumber: true,
            title: true,
            status: true,
            effectiveDate: true,
          },
          orderBy: { effectiveDate: "desc" },
        },
      },
      orderBy: { name: "asc" },
    })

    const clients = rawClients.map((c) => {
      let totalInvoiced = 0
      let totalPaid = 0

      c.invoices.forEach((inv) => {
        totalInvoiced += inv.total || 0
        totalPaid += inv.amountPaid || 0
      })

      const balanceDue = Math.max(0, totalInvoiced - totalPaid)
      const pendingInvoices = c.invoices.filter((i) => i.status !== "PAID" && i.status !== "CANCELLED").length

      return {
        ...c,
        totalInvoiced,
        totalPaid,
        balanceDue,
        pendingInvoices,
      }
    })

    return { success: true, clients }
  } catch (error: any) {
    console.error("Failed to fetch clients ledger:", error)
    return { success: false, error: error.message || "Failed to fetch clients ledger", clients: [] }
  }
}
