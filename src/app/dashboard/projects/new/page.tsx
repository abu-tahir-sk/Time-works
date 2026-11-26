import { Metadata } from "next"
import { requireUser } from "@/lib/auth/utils"
import { getClients } from "@/actions/clients"
import { ProjectForm } from "@/components/projects/project-form"

export const metadata: Metadata = {
  title: "New Project | Times Works",
  description: "Create a new project and generate AI feature-by-feature cost estimations.",
}

export default async function NewProjectPage() {
  await requireUser()

  const res = await getClients()
  const clients = res.success && res.clients ? res.clients : []

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <ProjectForm clients={clients} />
    </div>
  )
}
