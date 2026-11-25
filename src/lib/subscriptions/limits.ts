/**
 * Document Quota & Usage Controller
 * All users enjoy unmetered, unlimited PDF creation across Invoices, Quotations, and Agreements.
 */

export const FREE_TIER_DOC_LIMIT = Infinity

export async function getUserDocumentUsage(userId?: string) {
  return {
    plan: "ENTERPRISE" as const,
    isUnlimited: true,
    totalDocuments: 0,
    limit: Infinity,
    remaining: Infinity,
    canCreate: true,
    counts: {
      invoices: 0,
      quotations: 0,
      agreements: 0,
    },
  }
}

export async function checkUserCanCreateDocument(userId?: string) {
  return { allowed: true }
}
