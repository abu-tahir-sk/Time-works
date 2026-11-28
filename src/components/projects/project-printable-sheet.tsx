"use client"

import React from "react"
import { Printer, Download, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectPrintableSheetProps {
  project: any
  company?: any
  onClose?: () => void
}

export function ProjectPrintableSheet({ project, company, onClose }: ProjectPrintableSheetProps) {
  const currency = project.currency || "USD"
  const budget = Number(project.budget) || 0
  const paid = Number(project.paidAmount) || 0
  const due = Math.max(0, budget - paid)
  const features = Array.isArray(project.featureBreakdown) ? project.featureBreakdown : []
  const client = project.client || {}

  const companyName = company?.name || "Times Works"
  const companyEmail = company?.email || "billing@timesworks.com"
  const companyPhone = company?.phone || "+1 (800) 555-0199"
  const companyAddress = company?.address || "Times Works Tower, Suite 400, Redmond, WA 98052, USA"

  const fmt = (amt: number) => {
    return `${currency} ${Number(amt || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm print:bg-white print:p-0 print:static print:inset-auto">
      {/* Top action toolbar (Hidden when printing) */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/80 bg-background/95 px-6 py-3 shadow-sm backdrop-blur-md print:hidden">
        <div className="flex items-center gap-3">
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Project
            </Button>
          )}
          <span className="text-xs font-semibold text-muted-foreground">
            Official Scope & Proposal Document (A4 Printable)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs bg-[#c82020] hover:bg-[#a81a1a] text-white font-semibold gap-1.5 shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Document (A4)
          </Button>
        </div>
      </div>

      {/* Printable Sheet Canvas: 210mm x 297mm (Standard A4) */}
      <div className="py-8 px-4 flex justify-center print:p-0 print:m-0 print:block">
        <div className="w-full max-w-[850px] bg-white text-slate-900 rounded-xl shadow-2xl p-10 sm:p-14 border border-slate-200 print:border-none print:shadow-none print:p-0 print:w-full print:max-w-none print:rounded-none">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-[#c82020] pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">{companyName}</h1>
              <p className="text-xs font-bold text-[#c82020] uppercase tracking-wider mt-0.5">
                Professional Digital Engineering
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {companyAddress}
                <br />
                Email: {companyEmail} | Phone: {companyPhone}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-50 text-[#c82020] border border-rose-200 rounded">
                Scope & Specifications
              </span>
              <p className="text-sm font-black font-mono text-slate-900 mt-2">{project.code || "PRJ-2026-001"}</p>
              <p className="text-xs text-slate-500 mt-1">
                Date: {new Date(project.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Client & Project Meta Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Client Account / Commissioned By
              </p>
              <p className="text-sm font-bold text-slate-900">{client.name || "Client"}</p>
              {client.company && <p className="text-slate-600 mt-0.5">{client.company}</p>}
              {client.email && <p className="text-slate-600 mt-0.5">Email: {client.email}</p>}
              {client.address && <p className="text-slate-500 mt-0.5">{client.address}</p>}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Project Overview & Status
              </p>
              <p className="text-sm font-bold text-slate-900">{project.name}</p>
              <p className="text-slate-600 mt-0.5">
                Status: <span className="font-semibold">{project.status?.replace(/_/g, " ") || "In Progress"}</span>
              </p>
              {project.deadline && (
                <p className="text-slate-600 mt-0.5">
                  Target Handover: {new Date(project.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
            </div>
          </div>

          {/* Section 1: Overview Scope */}
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-2">
              1. Project Scope & Architecture Overview
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {project.description ||
                "This document establishes the official technical scope of work, granular feature division, and commercial allocations agreed between the client and Times Works. All modules will be engineered according to modern industry standards."}
            </p>
          </div>

          {/* Section 2: Itemized Feature Breakdown Table */}
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
              2. Itemized Feature Breakdown & Deliverables
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 w-1/3">Feature / Module</th>
                    <th className="py-2.5 px-3">Technical Specifications</th>
                    <th className="py-2.5 px-3 text-right w-28">Allocated Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {features.length > 0 ? (
                    features.map((f: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{f.feature}</td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px] leading-relaxed">
                          {f.description || "Production engineering module"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{fmt(f.cost)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3 px-3 text-center text-slate-400">1</td>
                      <td className="py-3 px-3 font-bold text-slate-900">Complete System Architecture</td>
                      <td className="py-3 px-3 text-slate-600">Core engineering, frontend UI, APIs and infrastructure.</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{fmt(budget)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Financial Summary Box */}
          <div className="flex justify-end mb-12">
            <div className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Contracted Project Budget:</span>
                <span className="font-mono font-bold text-slate-900">{fmt(budget)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Collected to Date:</span>
                <span className="font-mono font-bold text-emerald-600">{fmt(paid)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                <span className="text-[#c82020]">Remaining Due Balance:</span>
                <span className="font-mono text-[#c82020]">{fmt(due)}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200 text-xs">
            <div>
              <div className="h-16 border-b border-slate-400 mb-2" />
              <p className="font-bold text-slate-900">Authorized Project Director</p>
              <p className="text-[11px] text-slate-500">Times Works Professional Services</p>
            </div>
            <div>
              <div className="h-16 border-b border-slate-400 mb-2" />
              <p className="font-bold text-slate-900">Client Acceptance & Sign-off</p>
              <p className="text-[11px] text-slate-500">{client.name || "Client Representative"}</p>
            </div>
          </div>

          {/* Bottom document notice */}
          <p className="text-[10px] text-center text-slate-400 mt-12 border-t border-slate-100 pt-4">
            Times Works Confidential • Official Project Scope & Specifications • System Generated Document
          </p>
        </div>
      </div>
    </div>
  )
}
