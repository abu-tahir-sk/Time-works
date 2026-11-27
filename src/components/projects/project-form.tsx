"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Loader2,
  Layers,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ClientSearchSelect } from "@/components/projects/client-search-select"
import { toast } from "sonner"
import { createOrUpdateProject, getAiFeatureBreakdown } from "@/actions/projects"
import { FeatureItem } from "@/lib/gemini"

interface ProjectFormProps {
  clients: any[]
  initialData?: any
}

export function ProjectForm({ clients, initialData }: ProjectFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)

  // Form State
  const [name, setName] = useState(initialData?.name || "")
  const [code, setCode] = useState(
    initialData?.code || `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  )
  const [clientId, setClientId] = useState(initialData?.clientId || clients[0]?.id || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [status, setStatus] = useState(initialData?.status || "IN_PROGRESS")
  const [currency, setCurrency] = useState(initialData?.currency || "USD")
  const [budget, setBudget] = useState<number>(initialData?.budget || 45000)
  const [startDate, setStartDate] = useState(
    initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [deadline, setDeadline] = useState(
    initialData?.deadline
      ? new Date(initialData.deadline).toISOString().slice(0, 10)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  )
  const [notes, setNotes] = useState(initialData?.notes || "")

  // Feature Breakdown List (Granular feature-by-feature)
  const [features, setFeatures] = useState<FeatureItem[]>(
    Array.isArray(initialData?.featureBreakdown) && initialData.featureBreakdown.length > 0
      ? initialData.featureBreakdown
      : [
          {
            feature: "Authentication, Multi-Tenant Roles & Security",
            description: "Secure session management, role-based authorization, and profile controls.",
            cost: 6500,
          },
          {
            feature: "Interactive Executive Dashboard & Analytics",
            description: "Responsive frontend interface with high-density data tables and filters.",
            cost: 9500,
          },
          {
            feature: "Digital Payment Links & QR Remittance Engine",
            description: "Digital payment links, QR remittance generation, and transaction ledger.",
            cost: 12000,
          },
          {
            feature: "Cloud Database, API Microservices & Integrations",
            description: "PostgreSQL schema, optimized queries, indexing, and REST service endpoints.",
            cost: 11000,
          },
          {
            feature: "Automated Testing, CI/CD Deployment & Launch",
            description: "End-to-end regression validation, automated build pipelines, and production SSL.",
            cost: 6000,
          },
        ]
  )

  // Handle Feature Changes
  const handleFeatureChange = (index: number, field: keyof FeatureItem, value: any) => {
    setFeatures((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addFeature = () => {
    setFeatures((prev) => [
      ...prev,
      {
        feature: "",
        description: "",
        cost: 5000,
      },
    ])
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  // Sync total budget with features sum
  const featureSum = features.reduce((sum, f) => sum + (Number(f.cost) || 0), 0)

  const handleSyncBudgetFromFeatures = () => {
    setBudget(featureSum)
    toast.success(`Project budget synced to total of features: ${currency} ${featureSum.toLocaleString()}`)
  }

  // Trigger Gemini AI Breakdown
  const handleGenerateAiBreakdown = async () => {
    if (!name.trim()) {
      toast.error("Please enter a Project Name first to generate AI breakdown")
      return
    }

    setIsGeneratingAi(true)
    try {
      const res = await getAiFeatureBreakdown(name, description, budget, currency)
      if (res.success && res.data) {
        setFeatures(res.data.features)
        if (res.data.suggestedTotalBudget) {
          setBudget(res.data.suggestedTotalBudget)
        }
        toast.success("AI granular feature breakdown generated successfully!")
      } else {
        toast.error(res.error || "Failed to generate AI breakdown")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred with Gemini AI")
    } finally {
      setIsGeneratingAi(false)
    }
  }

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Project Name is required")
      return
    }
    if (!clientId) {
      toast.error("Please select a Client for this project")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        id: initialData?.id,
        name: name.trim(),
        code: code.trim(),
        clientId,
        description: description.trim() || undefined,
        status,
        budget: Number(budget) || featureSum,
        currency,
        startDate,
        deadline,
        notes: notes.trim() || undefined,
        featureBreakdown: features.filter((f) => f.feature.trim() !== ""),
      }

      const res = await createOrUpdateProject(payload)
      if (res.success && res.project) {
        toast.success(initialData ? "Project updated successfully!" : "Project created successfully!")
        router.push(`/dashboard/projects/${res.project.id}`)
      } else {
        toast.error(res.error || "Failed to save project")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {initialData ? `Edit Project: ${name}` : "Create New Project"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure project scope, select client, and generate AI feature-by-feature cost estimations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/projects")}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving}
            className="bg-[#c82020] hover:bg-[#a81a1a] text-white text-xs font-semibold shadow-xs"
          >
            {isSaving ? "Saving..." : initialData ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2 Columns: Project Info & Feature Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Core Project Information */}
          <Card className="border border-border/80 rounded-xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#c82020]" />
                Project Details
              </CardTitle>
              <CardDescription className="text-xs">
                Enter primary project identity and client assignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Project Title *</Label>
                <Input
                  required
                  placeholder="e.g. Cloud Dynamics 365 Architecture & Workflow Transformation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9.5 text-xs rounded-xl font-medium"
                />
              </div>

              {/* Client Searchable Dropdown */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Client (Searchable Dropdown) *</Label>
                <ClientSearchSelect
                  clients={clients}
                  value={clientId}
                  onChange={setClientId}
                />
                <p className="text-[11px] text-muted-foreground">
                  Select an existing client or click &quot;Add New Client&quot; to create one on the fly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Project Code / Identifier</Label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="PRJ-2026-001"
                    className="h-9 text-xs rounded-xl font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Project Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-border/80 bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#c82020]"
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="PLANNING">Planning</option>
                    <option value="REVIEW">Review / Testing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Scope & Description</Label>
                <Textarea
                  rows={3}
                  placeholder="Briefly describe what this project covers, technical requirements, deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Granular Feature Breakdown & Gemini AI Generator */}
          <Card className="border border-border/80 rounded-xl shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 flex-wrap">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#c82020]" />
                  Granular Feature Breakdown & Cost Allocation
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Itemized features divided into granular milestones (as requested in audio: no lump-sum &quot;Frontend 1L, Backend 1L&quot;).
                </CardDescription>
              </div>

              {/* Gemini AI Auto-Breakdown Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isGeneratingAi}
                onClick={handleGenerateAiBreakdown}
                className="text-xs font-semibold border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Gemini AI Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
                    AI Feature Breakdown (Gemini)
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-2.5">
                {features.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 p-2.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1 w-full space-y-1">
                      <Input
                        placeholder="Feature Title (e.g. Authentication, Dashboard UI, Gateway)"
                        value={item.feature}
                        onChange={(e) => handleFeatureChange(idx, "feature", e.target.value)}
                        className="h-8 text-xs font-semibold rounded-lg"
                      />
                      <Input
                        placeholder="Short scope / deliverables description"
                        value={item.description}
                        onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                        className="h-7 text-[11px] rounded-lg text-muted-foreground"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-1 w-32">
                        <span className="text-xs text-muted-foreground font-mono">{currency}</span>
                        <Input
                          type="number"
                          placeholder="Cost"
                          value={item.cost}
                          onChange={(e) => handleFeatureChange(idx, "cost", Number(e.target.value))}
                          className="h-8 text-xs font-mono font-bold text-right rounded-lg"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(idx)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="text-xs w-full sm:w-auto"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Custom Feature
                </Button>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">
                    Features Total:{" "}
                    <strong className="font-mono text-foreground font-bold">
                      {currency} {featureSum.toLocaleString()}
                    </strong>
                  </span>
                  {featureSum !== budget && (
                    <button
                      type="button"
                      onClick={handleSyncBudgetFromFeatures}
                      className="text-[11px] font-semibold text-[#c82020] hover:underline"
                    >
                      Sync with Project Budget
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Column: Financials & Dates */}
        <div className="space-y-6">
          <Card className="border border-border/80 rounded-xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Financials & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Total Project Budget *</Label>
                <div className="flex items-center gap-2">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-9 rounded-xl border border-border/80 bg-background px-2 text-xs font-mono font-semibold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="BDT">BDT</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                  <Input
                    required
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="h-9 text-xs font-mono font-bold text-foreground rounded-xl flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Target Deadline</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Internal Notes</Label>
                <Textarea
                  rows={3}
                  placeholder="Private internal milestone notes or payment guidelines..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
