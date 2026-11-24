import { getAdminOverview, getAdminUsersList } from "@/actions/admin"
import { AdminClient } from "./admin-client"

export const metadata = {
  title: "Admin Center | DocuFlow Enterprise",
  description: "Super Admin Control Center: User management, premium subscriptions, and platform analytics.",
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
