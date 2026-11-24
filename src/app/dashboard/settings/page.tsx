import { Metadata } from "next"
import { getCompanySettings } from "@/actions/company"
import { getCurrentUser } from "@/lib/auth/utils"
import { SettingsClient } from "./settings-client"

export const metadata: Metadata = {
  title: "Workspace Settings | Times Works",
  description: "Company profile, tax settings, bank accounts, and invoice templates.",
}

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const [companyRes, user] = await Promise.all([
    getCompanySettings(),
    getCurrentUser(),
  ])

  const company = companyRes.success && companyRes.company ? companyRes.company : null

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <SettingsClient initialCompany={company} user={user} />
    </div>
  )
}
