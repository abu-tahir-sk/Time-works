import { Metadata } from "next"
import { getProjects } from "@/actions/projects"
import { requireUser } from "@/lib/auth/utils"
import { ProjectListClient } from "./project-list-client"

export const metadata: Metadata = {
  title: "Projects & Deliverables | Times Works",
  description: "Enterprise project management, client contracts, and feature-by-feature cost allocations.",
}

export default async function ProjectsPage() {
  await requireUser()

  const res = await getProjects()
  const projects = res.success && res.projects ? res.projects : []

  return <ProjectListClient initialProjects={projects} />
}
