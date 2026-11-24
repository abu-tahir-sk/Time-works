import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/prisma"

export const SUPER_ADMIN_EMAIL = "abutahir2626@gmail.com"

export function isSuperAdmin(user?: { email?: string | null; role?: string | null } | null): boolean {
  if (!user?.email) return false
  return user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && user.role === "ADMIN"
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user || !user.email) {
    throw new Error("Unauthorized")
  }
  
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })
  
  if (!dbUser) {
    throw new Error("User not found")
  }
  
  return dbUser
}

export async function requireSuperAdmin() {
  const user = await requireUser()
  if (user.email?.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase() || user.role !== "ADMIN") {
    throw new Error("Forbidden: Super Admin access required.")
  }
  return user
}

/**
 * Gets or creates a default company for the user.
 * In a real SaaS, users might select which company they are currently acting as.
 * For this implementation, we assume a 1-to-1 or default first company.
 */
export async function getUserCompany() {
  const user = await requireUser()
  
  let company = await prisma.company.findFirst({
    where: { ownerId: user.id }
  })
  
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "Times Digitals",
        address: "Times Digitals Tower, Suite 400, Redmond, WA 98052, USA",
        email: "billing@timesdigitals.com",
        phone: "+1 (800) 555-0199",
        website: "https://timesdigitals.com",
        logoUrl: "/logo-v3.jpg",
        ownerId: user.id,
      }
    })
  } else if (company.name.includes("'s Company") || company.name.includes("My Company") || company.name.toLowerCase().includes("sufian")) {
    company = await prisma.company.update({
      where: { id: company.id },
      data: {
        name: "Times Digitals",
        address: company.address || "Times Digitals Tower, Suite 400, Redmond, WA 98052, USA",
        email: company.email || "billing@timesdigitals.com",
        phone: company.phone || "+1 (800) 555-0199",
        website: company.website || "https://timesdigitals.com",
        logoUrl: company.logoUrl || "/logo-v3.jpg",
      }
    })
  }
  
  return company
}
