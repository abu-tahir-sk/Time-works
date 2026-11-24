"use server"

import { requireUser, getUserCompany } from "@/lib/auth/utils"
import { prisma } from "@/lib/prisma"
import { quotationSchema, QuotationFormValues } from "@/lib/quotations/schema"
import { revalidatePath } from "next/cache"
import { checkUserCanCreateDocument } from "@/lib/subscriptions/limits"

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
                            discountType: item.discountType,
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
                            discountType: item.discountType,
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