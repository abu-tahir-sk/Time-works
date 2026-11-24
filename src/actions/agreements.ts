"use server"

import { requireUser } from "@/lib/auth/utils"
import { prisma } from "@/lib/prisma"
import { agreementSchema, AgreementFormValues } from "@/lib/agreements/schema"
import { revalidatePath } from "next/cache"
import { checkUserCanCreateDocument } from "@/lib/subscriptions/limits"

export async function createOrUpdateAgreement(data: AgreementFormValues) {
    try {
        const user = await requireUser()
        const validatedData = agreementSchema.parse(data)

        if (!validatedData.clientId) {
            return { success: false, error: "A client is required to save an agreement" }
        }

        const agreementData = {
            agreementNumber: validatedData.agreementNumber,
            title: validatedData.title,
            type: validatedData.type,
            clientId: validatedData.clientId,
            effectiveDate: new Date(validatedData.effectiveDate),
            expiryDate: new Date(validatedData.expiryDate),
            currency: validatedData.currency,
            value: validatedData.value && !Number.isNaN(Number(validatedData.value))
                ? Number(validatedData.value)
                : null,
            paymentTerms: validatedData.paymentTerms || null,
            scope: validatedData.scope || null,
            clauses: validatedData.clauses || null,
            notes: validatedData.notes || null,
            status: "DRAFT",
        }

        // Locate the company that owns this agreement via the selected client
        const client = await prisma.client.findUnique({
            where: { id: validatedData.clientId },
            select: { companyId: true },
        })
        if (!client) {
            return { success: false, error: "Client not found" }
        }

        const existing = await prisma.agreement.findUnique({
            where: {
                companyId_agreementNumber: {
                    companyId: client.companyId,
                    agreementNumber: validatedData.agreementNumber,
                },
            },
            select: { id: true },
        })

        if (!existing) {
            const limitCheck = await checkUserCanCreateDocument(user.id)
            if (!limitCheck.allowed) {
                return { success: false, error: limitCheck.message }
            }
        }

        if (existing) {
            await prisma.agreement.update({
                where: { id: existing.id },
                data: agreementData,
            })
        } else {
            await prisma.agreement.create({
                data: {
                    ...agreementData,
                    authorId: user.id,
                    companyId: client.companyId,
                },
            })
        }

        revalidatePath("/dashboard/agreements")
        return { success: true }
    } catch (error: any) {
        console.error("Agreement Save Error:", error)
        return { success: false, error: error.message || "Failed to save agreement" }
    }
}

export async function getAgreements() {
    try {
        const user = await requireUser()

        const company = await prisma.company.findFirst({
            where: { ownerId: user.id },
            include: {
                agreements: {
                    include: {
                        client: { select: { id: true, name: true, clientCompany: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        })

        if (!company) {
            return { success: true as const, agreements: [] }
        }

        return {
            success: true as const,
            agreements: company.agreements.map((a) => ({
                ...a,
                effectiveDate: a.effectiveDate.toISOString(),
                expiryDate: a.expiryDate.toISOString(),
                createdAt: a.createdAt.toISOString(),
                updatedAt: a.updatedAt.toISOString(),
            })),
        }
    } catch (error: any) {
        console.error("Get Agreements Error:", error)
        return { success: false as const, error: error.message || "Failed to load agreements", agreements: [] }
    }
}

export async function deleteAgreement(id: string) {
    try {
        const user = await requireUser()

        const agreement = await prisma.agreement.findFirst({
            where: { id, company: { ownerId: user.id } },
            select: { id: true },
        })

        if (!agreement) {
            return { success: false, error: "Agreement not found" }
        }

        await prisma.agreement.delete({ where: { id } })

        revalidatePath("/dashboard/agreements")
        return { success: true }
    } catch (error: any) {
        console.error("Delete Agreement Error:", error)
        return { success: false, error: error.message || "Failed to delete agreement" }
    }
}
