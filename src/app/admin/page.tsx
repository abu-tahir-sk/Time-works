import { redirect } from "next/navigation"
import { getAdminOverview, getAdminUsersList } from "@/actions/admin"
import { getCurrentUser, SUPER_ADMIN_EMAIL } from "@/lib/auth/utils"
import { AdminClient } from "../dashboard/admin/admin-client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin Portal | DocuFlow Enterprise",
  description: "Enterprise Super Admin Control Center: User management, subscription tiers, and platform telemetry.",
}

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (
    !user ||
    !user.email ||
    user.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase() ||
    (user as any).role !== "ADMIN"
  ) {
    redirect("/dashboard")
  }

  const [overviewRes, usersRes] = await Promise.all([
    getAdminOverview(),
    getAdminUsersList(),
  ])

  return (
    <AdminClient
      stats={overviewRes.stats}
      initialUsers={usersRes.users || []}
    />
  )
}
