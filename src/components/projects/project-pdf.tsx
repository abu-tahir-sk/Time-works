import React from "react"
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: "#c82020",
    paddingBottom: 16,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 9,
    color: "#c82020",
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  brandContact: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 3,
    lineHeight: 1.3,
  },
  docBadgeBlock: {
    alignItems: "flex-end",
  },
  docBadge: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  docCode: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginTop: 3,
  },
  docDate: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  metaCol: {
    width: "48%",
  },
  metaLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  metaValueBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  metaValue: {
    fontSize: 8.5,
    color: "#334155",
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
    marginBottom: 8,
    marginTop: 4,
  },
  summaryText: {
    fontSize: 8.5,
    color: "#334155",
    lineHeight: 1.4,
    marginBottom: 14,
  },
  table: {
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderColIndex: {
    width: "6%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
  },
  tableHeaderColFeature: {
    width: "34%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
  },
  tableHeaderColDesc: {
    width: "42%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
  },
  tableHeaderColCost: {
    width: "18%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowIndex: {
    width: "6%",
    fontSize: 8,
    color: "#64748b",
  },
  tableRowFeature: {
    width: "34%",
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    paddingRight: 6,
  },
  tableRowDesc: {
    width: "42%",
    fontSize: 7.5,
    color: "#475569",
    lineHeight: 1.3,
    paddingRight: 6,
  },
  tableRowCost: {
    width: "18%",
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textAlign: "right",
  },
  financialBlock: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  financialBox: {
    width: "45%",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 10,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  financialRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 6,
    marginTop: 4,
  },
  financialLabel: {
    fontSize: 8,
    color: "#64748b",
  },
  financialValue: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  dueLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
  },
  dueValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
  },
  signaturesBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  signCol: {
    width: "45%",
  },
  signLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#94a3b8",
    marginBottom: 4,
    marginTop: 26,
  },
  signTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  signSubtitle: {
    fontSize: 7,
    color: "#64748b",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 7,
    color: "#94a3b8",
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
  },
})

interface ProjectPdfProps {
  project: any
  company?: any
}

export function ProjectPdf({ project, company }: ProjectPdfProps) {
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

  return (
    <Document title={`Scope-Proposal-${project.code || "Project"}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>{companyName}</Text>
            <Text style={styles.brandSubtitle}>Professional Digital Engineering</Text>
            <Text style={styles.brandContact}>
              {companyAddress}{"\n"}
              Email: {companyEmail} | Phone: {companyPhone}
            </Text>
          </View>
          <View style={styles.docBadgeBlock}>
            <Text style={styles.docBadge}>Scope & Specifications</Text>
            <Text style={styles.docCode}>{project.code || "PRJ-2026-001"}</Text>
            <Text style={styles.docDate}>
              Date: {new Date(project.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </Text>
          </View>
        </View>

        {/* Client & Project Meta Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Client Account / Commissioned By</Text>
            <Text style={styles.metaValueBold}>{client.name || "Client"}</Text>
            {client.company && <Text style={styles.metaValue}>{client.company}</Text>}
            {client.email && <Text style={styles.metaValue}>Email: {client.email}</Text>}
            {client.address && <Text style={styles.metaValue}>{client.address}</Text>}
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Project Overview</Text>
            <Text style={styles.metaValueBold}>{project.name}</Text>
            <Text style={styles.metaValue}>Status: {project.status?.replace(/_/g, " ") || "In Progress"}</Text>
            {project.deadline && (
              <Text style={styles.metaValue}>
                Target Handover: {new Date(project.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </Text>
            )}
          </View>
        </View>

        {/* Executive Summary */}
        <Text style={styles.sectionTitle}>1. Project Scope & Architecture</Text>
        <Text style={styles.summaryText}>
          {project.description ||
            "This document establishes the official technical scope of work, granular feature division, and cost allocations agreed between the client and Times Works. All modules will be engineered according to modern production industry standards."}
        </Text>

        {/* Itemized Feature Division Table */}
        <Text style={styles.sectionTitle}>2. Itemized Feature Breakdown & Investment</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderColIndex}>#</Text>
            <Text style={styles.tableHeaderColFeature}>Feature / Module</Text>
            <Text style={styles.tableHeaderColDesc}>Technical Specifications & Scope</Text>
            <Text style={styles.tableHeaderColCost}>Allocated Cost</Text>
          </View>

          {features.length > 0 ? (
            features.map((f: any, idx: number) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableRowIndex}>{idx + 1}</Text>
                <Text style={styles.tableRowFeature}>{f.feature}</Text>
                <Text style={styles.tableRowDesc}>{f.description || "Production-ready engineering module"}</Text>
                <Text style={styles.tableRowCost}>{fmt(f.cost)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableRowIndex}>1</Text>
              <Text style={styles.tableRowFeature}>Complete Solution Architecture</Text>
              <Text style={styles.tableRowDesc}>Core engineering, API microservices, frontend UI and infrastructure.</Text>
              <Text style={styles.tableRowCost}>{fmt(budget)}</Text>
            </View>
          )}
        </View>

        {/* Financial Calculation Box */}
        <View style={styles.financialBlock}>
          <View style={styles.financialBox}>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Contracted Project Budget:</Text>
              <Text style={styles.financialValue}>{fmt(budget)}</Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Total Collected to Date:</Text>
              <Text style={styles.financialValue}>{fmt(paid)}</Text>
            </View>
            <View style={styles.financialRowTotal}>
              <Text style={styles.dueLabel}>Remaining Due Balance:</Text>
              <Text style={styles.dueValue}>{fmt(due)}</Text>
            </View>
          </View>
        </View>

        {/* Signatures & Execution Block */}
        <View style={styles.signaturesBlock}>
          <View style={styles.signCol}>
            <View style={styles.signLine} />
            <Text style={styles.signTitle}>Authorized Project Director</Text>
            <Text style={styles.signSubtitle}>Times Works Professional Services</Text>
          </View>
          <View style={styles.signCol}>
            <View style={styles.signLine} />
            <Text style={styles.signTitle}>Client Acceptance & Sign-off</Text>
            <Text style={styles.signSubtitle}>{client.name || "Client Representative"}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Times Works Confidential Document • Project Code: {project.code || "PRJ"} • Generated via Enterprise Platform
        </Text>
      </Page>
    </Document>
  )
}
