"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireSuperAdmin } from "@/lib/auth/utils"

export async function getAdminOverview() {
  try {
    await requireSuperAdmin()

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

    // Invoices financial total
    const invoiceSums = await prisma.invoice.aggregate({
      _sum: {
        total: true,
        amountPaid: true,
      },
    })

    const totalSystemInvoiced = invoiceSums._sum.total || 0
    const totalSystemCollected = invoiceSums._sum.amountPaid || 0

    return {
      success: true,
      stats: {
        totalUsers,
        totalCompanies,
        totalInvoices,
        totalQuotations,
        totalAgreements,
        totalExpenses,
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
        totalSystemInvoiced: 0,
        totalSystemCollected: 0,
      },
      recentUsers: [],
    }
  }
}

export async function getAdminUsersList(searchQuery?: string, roleFilter?: string) {
  try {
    await requireSuperAdmin()

    const whereClause: any = {}

    if (searchQuery && searchQuery.trim().length > 0) {
      whereClause.OR = [
        { name: { contains: searchQuery.trim(), mode: "insensitive" } },
        { email: { contains: searchQuery.trim(), mode: "insensitive" } },
      ]
    }

    if (roleFilter && roleFilter !== "ALL") {
      whereClause.role = roleFilter
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

export async function updateUserRole(userId: string, newRole: "USER" | "ADMIN") {
  try {
    await requireSuperAdmin()

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    revalidatePath("/dashboard/admin")
    return { success: true, user: updatedUser }
  } catch (error: any) {
    console.error("updateUserRole error:", error)
    return { success: false, error: error.message || "Failed to update user role" }
  }
}

// Retained for backward compatibility
export async function updateUserPlan(userId: string, newPlan?: string, newRole?: "USER" | "ADMIN") {
  if (newRole) {
    return updateUserRole(userId, newRole)
  }
  return { success: true }
}
