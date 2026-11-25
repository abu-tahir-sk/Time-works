"use server"

import { requireUser, getUserCompany } from "@/lib/auth/utils"
import { prisma } from "@/lib/prisma"
import { quotationSchema, QuotationFormValues } from "@/lib/quotations/schema"
import { revalidatePath } from "next/cache"
import { checkUserCanCreateDocument } from "@/lib/subscriptions/limits"
import { calculateInvoiceTotals, InvoiceItemData } from "@/lib/invoices/calculations"

export async function createOrUpdateQuotation(data: QuotationFormValues) {
    try {
        const user = await requireUser()
        const validatedData = quotationSchema.parse(data)

        // Generate a quotation number if not provided
        const quoteNumber = validatedData.quotationNumber || `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

        const quotationData = {
            quotationNumber: quoteNumber,
            clientId: validatedData.clientId,
            authorId: user.id,
            issueDate: validatedData.issueDate,
            validUntil: validatedData.validUntil,
            currency: validatedData.currency,
            status: validatedData.status,
            discountType: validatedData.discountType,
            discountValue: validatedData.discountValue,
            notes: validatedData.notes,
            terms: validatedData.terms,
            template: validatedData.template,
            designSettings: validatedData.designSettings ? JSON.parse(JSON.stringify(validatedData.designSettings)) : null,
        }

        // Update company details if provided
        if (validatedData.companyDetails) {
            const company = await getUserCompany()
            await prisma.company.update({
                where: { id: company.id },
                data: {
                    name: validatedData.companyDetails.name || company.name,
                    address: validatedData.companyDetails.address,
                    email: validatedData.companyDetails.email,
                    phone: validatedData.companyDetails.phone,
                    taxId: validatedData.companyDetails.taxId,
                    logoUrl: validatedData.companyDetails.logoUrl,
                }
            })
        }

        if (!validatedData.id) {
            const limitCheck = await checkUserCanCreateDocument(user.id)
            if (!limitCheck.allowed) {
                return { success: false, error: limitCheck.message }
            }
        }

        if (validatedData.id) {
            // Update existing
            await prisma.quotation.update({
                where: { id: validatedData.id, authorId: user.id },
                data: {
                    ...quotationData,
                    items: {
                        deleteMany: {}, // Clear old items
                        create: validatedData.items.map(item => ({
                            description: item.description,
                            quantity: item.quantity,
                            unit: item.unit,
                            unitPrice: item.unitPrice,
                            discountType: (item.discountType === "PERCENTAGE" || item.discountType === "FIXED") ? item.discountType : undefined,
                            discountValue: item.discountValue,
                            taxRate: item.taxRate,
                        }))
                    }
                }
            })
        } else {
            // Create new
            await prisma.quotation.create({
                data: {
                    ...quotationData,
                    items: {
                        create: validatedData.items.map(item => ({
                            description: item.description,
                            quantity: item.quantity,
                            unit: item.unit,
                            unitPrice: item.unitPrice,
                            discountType: (item.discountType === "PERCENTAGE" || item.discountType === "FIXED") ? item.discountType : undefined,
                            discountValue: item.discountValue,
                            taxRate: item.taxRate,
                        }))
                    }
                }
            })
        }

        revalidatePath("/dashboard/quotations")
        return { success: true }
    } catch (error: any) {
        console.error("Quotation Save Error:", error)
        return { success: false, error: error.message || "Failed to save quotation" }
    }
}

export async function convertQuotationToInvoice(quotationId: string) {
    try {
        const user = await requireUser()
        const company = await getUserCompany()

        const quotation = await prisma.quotation.findUnique({
            where: { id: quotationId, authorId: user.id },
            include: { items: true, client: true }
        })

        if (!quotation) {
            return { success: false, error: "Quotation not found" }
        }

        const limitCheck = await checkUserCanCreateDocument(user.id)
        if (!limitCheck.allowed) {
            return { success: false, error: limitCheck.message }
        }

        // Calculate totals
        const normalizedItems: InvoiceItemData[] = quotation.items.map(i => ({
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            discountValue: i.discountValue || 0,
            discountType: (i.discountType === "PERCENTAGE" || i.discountType === "FIXED" ? i.discountType : undefined) as ("PERCENTAGE" | "FIXED" | undefined),
            taxRate: i.taxRate || 0,
        }))

        const invoiceDiscountType = (quotation.discountType === "PERCENTAGE" || quotation.discountType === "FIXED"
            ? quotation.discountType
            : undefined) as ("PERCENTAGE" | "FIXED" | undefined)

        const totals = calculateInvoiceTotals(
            normalizedItems,
            quotation.discountValue || 0,
            invoiceDiscountType
        )

        // Generate Invoice Number
        const currentYear = new Date().getFullYear()
        const count = await prisma.invoice.count({ where: { companyId: company.id } })
        const invoiceNumber = `INV-${currentYear}-${String(count + 1).padStart(4, '0')}`

        const invoice = await prisma.invoice.create({
            data: {
                companyId: company.id,
                clientId: quotation.clientId,
                invoiceNumber,
                issueDate: new Date(),
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Default NET 15
                currency: quotation.currency,
                status: "DRAFT",
                discountType: invoiceDiscountType,
                discountValue: quotation.discountValue,
                notes: quotation.notes,
                terms: quotation.terms,
                template: quotation.template || "professional",
                designSettings: quotation.designSettings ? JSON.parse(JSON.stringify(quotation.designSettings)) : undefined,
                subtotal: totals.subtotal,
                taxAmount: totals.taxTotal,
                total: totals.grandTotal,
                amountPaid: 0,
                items: {
                    create: quotation.items.map((item, i) => ({
                        description: item.description,
                        quantity: item.quantity,
                        unit: item.unit,
                        unitPrice: item.unitPrice,
                        discountType: (item.discountType === "PERCENTAGE" || item.discountType === "FIXED") ? item.discountType : undefined,
                        discountValue: item.discountValue,
                        taxRate: item.taxRate,
                        amount: (item.quantity * item.unitPrice) - (item.discountValue || 0),
                        sortOrder: i
                    }))
                }
            }
        })

        // Mark quotation as CONVERTED or ACCEPTED
        await prisma.quotation.update({
            where: { id: quotationId },
            data: { status: "ACCEPTED" }
        })

        revalidatePath("/dashboard/quotations")
        revalidatePath("/dashboard/invoices")
        revalidatePath("/dashboard")

        return { success: true, invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber }
    } catch (error: any) {
        console.error("Convert Quotation Error:", error)
        return { success: false, error: error.message || "Failed to convert quotation to invoice" }
    }
}

export async function deleteQuotation(id: string) {
    try {
        const user = await requireUser()
        await prisma.quotation.delete({
            where: { id, authorId: user.id }
        })
        revalidatePath("/dashboard/quotations")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete quotation" }
    }
}