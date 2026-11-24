"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth/utils"

export async function getAdminOverview() {
  try {
    const user = await requireUser()

    // Fetch system-wide counts
    const [
      totalUsers,
      totalCompanies,
      totalInvoices,
      totalQuotations,
      totalAgreements,
      totalExpenses,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.invoice.count(),
      prisma.quotation.count(),
      prisma.agreement.count(),
      prisma.expense.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          createdAt: true,
          companies: {
            select: { id: true, name: true },
          },
        },
      }),
    ])

    // Subscription metrics
    const proUsersCount = await prisma.user.count({
      where: { plan: "PRO" },
    })
    const enterpriseUsersCount = await prisma.user.count({
      where: { plan: "ENTERPRISE" },
    })
    const freeUsersCount = await prisma.user.count({
      where: { plan: "FREE" },
    })

    // Invoices financial total
    const invoiceSums = await prisma.invoice.aggregate({
      _sum: {
        total: true,
        amountPaid: true,
      },
    })

    const totalSystemInvoiced = invoiceSums._sum.total || 0
    const totalSystemCollected = invoiceSums._sum.amountPaid || 0

    // Estimated Platform MRR ($29 for Pro, $99 for Enterprise)
    const estimatedMRR = proUsersCount * 29 + enterpriseUsersCount * 99

    return {
      success: true,
      stats: {
        totalUsers,
        totalCompanies,
        totalInvoices,
        totalQuotations,
        totalAgreements,
        totalExpenses,
        proUsersCount,
        enterpriseUsersCount,
        freeUsersCount,
        premiumSubscribers: proUsersCount + enterpriseUsersCount,
        estimatedMRR,
        totalSystemInvoiced,
        totalSystemCollected,
      },
      recentUsers,
    }
  } catch (error: any) {
    console.error("getAdminOverview error:", error)
    return {
      success: false,
      error: error.message || "Failed to load admin overview",
      stats: {
        totalUsers: 0,
        totalCompanies: 0,
        totalInvoices: 0,
        totalQuotations: 0,
        totalAgreements: 0,
        totalExpenses: 0,
        proUsersCount: 0,
        enterpriseUsersCount: 0,
        freeUsersCount: 0,
        premiumSubscribers: 0,
        estimatedMRR: 0,
        totalSystemInvoiced: 0,
        totalSystemCollected: 0,
      },
      recentUsers: [],
    }
  }
}

export async function getAdminUsersList(searchQuery?: string, planFilter?: string) {
  try {
    const user = await requireUser()

    const whereClause: any = {}

    if (searchQuery && searchQuery.trim().length > 0) {
      whereClause.OR = [
        { name: { contains: searchQuery.trim(), mode: "insensitive" } },
        { email: { contains: searchQuery.trim(), mode: "insensitive" } },
      ]
    }

    if (planFilter && planFilter !== "ALL") {
      whereClause.plan = planFilter
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        plan: true,
        planExpiresAt: true,
        createdAt: true,
        emailVerified: true,
        _count: {
          select: {
            companies: true,
            quotations: true,
            agreements: true,
            expenses: true,
          },
        },
      },
    })

    return { success: true, users }
  } catch (error: any) {
    console.error("getAdminUsersList error:", error)
    return { success: false, error: error.message || "Failed to load users", users: [] }
  }
}

export async function updateUserPlan(userId: string, newPlan: "FREE" | "PRO" | "ENTERPRISE", newRole?: "USER" | "ADMIN") {
  try {
    const user = await requireUser()

    const data: any = { plan: newPlan }
    if (newRole) {
      data.role = newRole
    }

    // Set expiry to 1 year from now if upgrading
    if (newPlan !== "FREE") {
      const expiry = new Date()
      expiry.setFullYear(expiry.getFullYear() + 1)
      data.planExpiresAt = expiry
    } else {
      data.planExpiresAt = null
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    })

    revalidatePath("/dashboard/admin")
    return { success: true, user: updatedUser }
  } catch (error: any) {
    console.error("updateUserPlan error:", error)
    return { success: false, error: error.message || "Failed to update user plan" }
  }
}
