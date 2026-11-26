import { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireUser } from "@/lib/auth/utils"
import { getProjectById } from "@/actions/projects"
import { ProjectDetailClient } from "./project-detail-client"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const res = await getProjectById(params.id)
  return {
    title: res.success && res.project ? `${res.project.name} | Times Works` : "Project Details",
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  await requireUser()

  const res = await getProjectById(params.id)
  if (!res.success || !res.project) {
    notFound()
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <ProjectDetailClient project={res.project} />
    </div>
  )
}
