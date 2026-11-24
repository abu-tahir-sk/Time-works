import { prisma } from "@/lib/prisma"
import { SUPER_ADMIN_EMAIL } from "@/lib/auth/utils"

export const FREE_TIER_DOC_LIMIT = 20

export interface UserUsageQuota {
  plan: "FREE" | "PRO" | "ENTERPRISE"
  isUnlimited: boolean
  totalDocuments: number
  limit: number
  remaining: number
  canCreate: boolean
  counts: {
    invoices: number
    quotations: number
    agreements: number
  }
}

/**
 * Calculates current document usage and checks whether user can generate more documents.
 */
export async function getUserDocumentUsage(userId: string): Promise<UserUsageQuota> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, plan: true, role: true, email: true },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const isSuperAdmin =
    user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && user.role === "ADMIN"
  const isUnlimited = isSuperAdmin || user.plan === "PRO" || user.plan === "ENTERPRISE"

  const [invoices, quotations, agreements] = await Promise.all([
    prisma.invoice.count({
      where: { company: { ownerId: userId } },
    }),
    prisma.quotation.count({
      where: { authorId: userId },
    }),
    prisma.agreement.count({
      where: { authorId: userId },
    }),
  ])

  const totalDocuments = invoices + quotations + agreements
  const limit = FREE_TIER_DOC_LIMIT
  const remaining = isUnlimited ? Infinity : Math.max(0, limit - totalDocuments)
  const canCreate = isUnlimited || totalDocuments < limit

  return {
    plan: (user.plan as any) || "FREE",
    isUnlimited,
    totalDocuments,
    limit,
    remaining,
    canCreate,
    counts: {
      invoices,
      quotations,
      agreements,
    },
  }
}

/**
 * Validates document creation limit for a user.
 */
export async function checkUserCanCreateDocument(
  userId: string
): Promise<{ allowed: boolean; message?: string; usage?: UserUsageQuota }> {
  const usage = await getUserDocumentUsage(userId)
  if (!usage.canCreate) {
    return {
      allowed: false,
      message: `You have reached the Free Plan limit of ${FREE_TIER_DOC_LIMIT} PDF documents (${usage.totalDocuments}/${FREE_TIER_DOC_LIMIT} used). Upgrade to Pro for unlimited PDF generation, logo tiling watermarks, and full accounting.`,
      usage,
    }
  }
  return { allowed: true, usage }
}
