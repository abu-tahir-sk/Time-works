import { getAdminOverview, getAdminUsersList } from "@/actions/admin"
import { AdminClient } from "../dashboard/admin/admin-client"

export const metadata = {
  title: "Admin Portal | DocuFlow Enterprise",
  description: "Enterprise Super Admin Control Center: User management, subscription tiers, and platform telemetry.",
}

export default async function AdminPage() {
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
