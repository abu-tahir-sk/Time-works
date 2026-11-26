"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser, getUserCompany } from "@/lib/auth/utils"
import { generateProjectBreakdownWithGemini, FeatureItem } from "@/lib/gemini"

export interface ProjectInput {
  id?: string
  name: string
  code?: string
  clientId: string
  description?: string
  status?: string
  budget: number
  currency?: string
  startDate?: string
  deadline?: string
  notes?: string
  featureBreakdown?: FeatureItem[]
}

export async function getProjects() {
  try {
    const user = await requireUser()
    const company = await getUserCompany()

    const projects = await prisma.project.findMany({
      where: { companyId: company.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            clientCompany: true,
            email: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            paidAt: true,
          },
        },
        paymentLinks: {
          select: {
            id: true,
            token: true,
            type: true,
            amount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formattedProjects = projects.map((p) => {
      // Recalculate paid amount from completed payments
      const totalPaid = p.payments
        .filter((pm) => pm.status === "COMPLETED")
        .reduce((sum, pm) => sum + pm.amount, 0)
      const dueAmount = Math.max(0, p.budget - totalPaid)
      const progressPct = p.budget > 0 ? Math.min(100, Math.round((totalPaid / p.budget) * 100)) : 0

      return {
        ...p,
        paidAmount: totalPaid,
        dueAmount,
        progressPct,
        paymentCount: p.payments.length,
      }
    })

    return { success: true, projects: formattedProjects }
  } catch (error: any) {
    console.error("getProjects error:", error)
    return { success: false, error: error.message || "Failed to fetch projects", projects: [] }
  }
}

export async function getProjectById(id: string) {
  try {
    const company = await getUserCompany()

    const project = await prisma.project.findFirst({
      where: { id, companyId: company.id },
      include: {
        client: true,
        payments: {
          orderBy: { paidAt: "desc" },
        },
        paymentLinks: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!project) {
      return { success: false, error: "Project not found" }
    }

    const totalPaid = project.payments
      .filter((pm) => pm.status === "COMPLETED")
      .reduce((sum, pm) => sum + pm.amount, 0)
    const dueAmount = Math.max(0, project.budget - totalPaid)
    const progressPct = project.budget > 0 ? Math.min(100, Math.round((totalPaid / project.budget) * 100)) : 0

    return {
      success: true,
      project: {
        ...project,
        paidAmount: totalPaid,
        dueAmount,
        progressPct,
      },
    }
  } catch (error: any) {
    console.error("getProjectById error:", error)
    return { success: false, error: error.message || "Failed to fetch project" }
  }
}

export async function createOrUpdateProject(data: ProjectInput) {
  try {
    const user = await requireUser()
    const company = await getUserCompany()

    if (!data.name || !data.clientId) {
      return { success: false, error: "Project name and client are required." }
    }

    const code = data.code?.trim() || `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const budget = Number(data.budget) || 0

    const projectData = {
      name: data.name.trim(),
      code,
      clientId: data.clientId,
      description: data.description?.trim() || null,
      status: data.status || "IN_PROGRESS",
      budget,
      currency: data.currency || "USD",
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      deadline: data.deadline ? new Date(data.deadline) : null,
      notes: data.notes?.trim() || null,
      featureBreakdown: data.featureBreakdown ? JSON.parse(JSON.stringify(data.featureBreakdown)) : null,
    }

    let project
    if (data.id) {
      project = await prisma.project.update({
        where: { id: data.id },
        data: projectData,
      })
    } else {
      project = await prisma.project.create({
        data: {
          ...projectData,
          companyId: company.id,
        },
      })
    }

    revalidatePath("/dashboard/projects")
    revalidatePath(`/dashboard/projects/${project.id}`)
    revalidatePath("/dashboard")
    return { success: true, project }
  } catch (error: any) {
    console.error("createOrUpdateProject error:", error)
    return { success: false, error: error.message || "Failed to save project" }
  }
}

export async function deleteProject(id: string) {
  try {
    const company = await getUserCompany()

    const existing = await prisma.project.findFirst({
      where: { id, companyId: company.id },
    })

    if (!existing) {
      return { success: false, error: "Project not found or unauthorized" }
    }

    await prisma.project.delete({
      where: { id },
    })

    revalidatePath("/dashboard/projects")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("deleteProject error:", error)
    return { success: false, error: error.message || "Failed to delete project" }
  }
}

export async function getAiFeatureBreakdown(
  title: string,
  description: string,
  targetBudget?: number,
  currency: string = "USD"
) {
  try {
    await requireUser()
    const result = await generateProjectBreakdownWithGemini(
      title,
      description,
      targetBudget,
      currency
    )
    return { success: true, data: result }
  } catch (error: any) {
    console.error("getAiFeatureBreakdown error:", error)
    return { success: false, error: error.message || "Failed to generate AI breakdown" }
  }
}
