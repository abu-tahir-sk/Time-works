import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer"
import { format } from "date-fns"
import { WatermarkLayer } from "../invoices/templates/WatermarkLayer"
import { defaultDesignSettings } from "@/lib/design-system/schema"

interface AgreementPdfProps {
  data: any
  company?: any
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 32,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    fontSize: 8,
    lineHeight: 1.3,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.2,
    borderBottomColor: "#c82020",
    paddingBottom: 10,
    marginBottom: 10,
  },
  companyCol: {
    width: "52%",
    paddingRight: 10,
  },
  companyLogo: {
    width: 48,
    height: "auto",
    maxHeight: 32,
    objectFit: "contain",
    marginBottom: 3,
  },
  companyName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
    lineHeight: 1.2,
  },
  companyText: {
    fontSize: 7.5,
    color: "#64748b",
    lineHeight: 1.25,
  },
  metaCol: {
    width: "46%",
    alignItems: "flex-end",
  },
  docBadge: {
    backgroundColor: "#fef2f2",
    borderWidth: 0.75,
    borderColor: "#c82020",
    borderRadius: 3,
    paddingVertical: 1.5,
    paddingHorizontal: 6,
    marginBottom: 3,
  },
  docBadgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  agreementTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
    textAlign: "right",
    lineHeight: 1.2,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 7.5,
    color: "#64748b",
    width: 75,
    textAlign: "right",
    paddingRight: 5,
  },
  metaValue: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    width: 90,
    textAlign: "right",
  },
  partiesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 0.75,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 7,
    marginBottom: 8,
  },
  partyBox: {
    flex: 1,
    paddingRight: 6,
  },
  partyHeader: {
    fontSize: 6.8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  partyName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 1.5,
  },
  partyDetail: {
    fontSize: 7.2,
    color: "#475569",
    lineHeight: 1.25,
  },
  commercialBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0fdf4",
    borderWidth: 0.75,
    borderColor: "#bbf7d0",
    borderRadius: 4,
    padding: 6,
    marginBottom: 8,
  },
  commercialItem: {
    flex: 1,
  },
  commercialLabel: {
    fontSize: 6.8,
    color: "#166534",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.4,
  },
  commercialValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#15803d",
    marginTop: 1,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    borderBottomWidth: 0.75,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 2,
    marginBottom: 4,
  },
  scopeText: {
    fontSize: 7.5,
    color: "#334155",
    lineHeight: 1.3,
  },
  clausesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clauseCol: {
    width: "48.5%",
  },
  clauseCard: {
    marginBottom: 4.5,
  },
  clauseHeading: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 1,
  },
  clauseBody: {
    fontSize: 7,
    color: "#334155",
    lineHeight: 1.25,
  },
  witnessText: {
    fontSize: 7,
    fontFamily: "Helvetica-Oblique",
    color: "#64748b",
    marginTop: 4,
    marginBottom: 6,
    textAlign: "center",
  },
  signaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  sigBlock: {
    width: "46%",
    borderTopWidth: 0.75,
    borderTopColor: "#94a3b8",
    paddingTop: 4,
  },
  sigTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 1,
  },
  sigSub: {
    fontSize: 7,
    color: "#64748b",
    lineHeight: 1.2,
  },
  footer: {
    position: "absolute",
    bottom: 12,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#cbd5e1",
    paddingTop: 3,
  },
  footerText: {
    fontSize: 6.5,
    color: "#94a3b8",
  },
})

export function AgreementPdf({ data, company }: AgreementPdfProps) {
  const companyInfo = { ...company, ...(data?.companyDetails || {}) }
  const effectiveDateStr = data?.effectiveDate
    ? format(new Date(data.effectiveDate), "MMMM dd, yyyy")
    : "Upon Execution"
  const expiryDateStr = data?.expiryDate
    ? format(new Date(data.expiryDate), "MMMM dd, yyyy")
    : "Until Terminated"

  // Process clauses into structured title + body items and split into 2 columns for a single page fit
  const clausesText: string = data?.clauses || ""
  const rawLines = clausesText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  interface ClauseItem {
    title?: string
    body: string
  }

  const clausesList: ClauseItem[] = []
  let pendingTitle = ""
  let pendingBody: string[] = []

  for (const line of rawLines) {
    const isHeading =
      /^\d+\.\s+[A-Z0-9\s,&/'-]+$/.test(line) ||
      (/^[A-Z0-9\s,&/'-]{4,}$/.test(line) && line.length < 50)

    if (isHeading) {
      if (pendingTitle || pendingBody.length > 0) {
        clausesList.push({
          title: pendingTitle,
          body: pendingBody.join(" "),
        })
      }
      pendingTitle = line
      pendingBody = []
    } else {
      pendingBody.push(line)
    }
  }

  if (pendingTitle || pendingBody.length > 0) {
    clausesList.push({
      title: pendingTitle,
      body: pendingBody.join(" "),
    })
  }

  const midPoint = Math.ceil(clausesList.length / 2)
  const col1Clauses = clausesList.slice(0, midPoint)
  const col2Clauses = clausesList.slice(midPoint)

  const agreementTypeLabel =
    (data?.type || "SERVICE_AGREEMENT").replace(/_/g, " ")

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Security Watermark Layer */}
        <WatermarkLayer
          ds={defaultDesignSettings}
          companyLogo={companyInfo?.logoUrl}
          companyName={companyInfo?.name || "TIMES WORKS"}
        />

        {/* Corporate Header */}
        <View style={styles.header}>
          <View style={styles.companyCol}>
            {companyInfo?.logoUrl && (
              <Image src={companyInfo.logoUrl} style={styles.companyLogo} />
            )}
            <Text style={styles.companyName}>
              {companyInfo?.name || "Times Works"}
            </Text>
            {companyInfo?.address && (
              <Text style={styles.companyText}>{companyInfo.address}</Text>
            )}
            {companyInfo?.email && (
              <Text style={styles.companyText}>{companyInfo.email}</Text>
            )}
            {companyInfo?.taxId && (
              <Text style={styles.companyText}>
                Tax ID / GSTIN: {companyInfo.taxId}
              </Text>
            )}
          </View>

          <View style={styles.metaCol}>
            <View style={styles.docBadge}>
              <Text style={styles.docBadgeText}>{agreementTypeLabel}</Text>
            </View>
            <Text style={styles.agreementTitle}>
              {data?.title || "Master Services Agreement"}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Agreement #:</Text>
              <Text style={styles.metaValue}>
                {data?.agreementNumber || "AGR-2026-001"}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Effective Date:</Text>
              <Text style={styles.metaValue}>{effectiveDateStr}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Valid Until:</Text>
              <Text style={styles.metaValue}>{expiryDateStr}</Text>
            </View>
          </View>
        </View>

        {/* Parties Box */}
        <View style={styles.partiesGrid}>
          <View style={styles.partyBox}>
            <Text style={styles.partyHeader}>Party 1 (Service Provider)</Text>
            <Text style={styles.partyName}>
              {companyInfo?.name || "Times Works"}
            </Text>
            <Text style={styles.partyDetail}>
              {companyInfo?.address || "Times Works Tower, Redmond, WA 98052"}
            </Text>
            {companyInfo?.email && (
              <Text style={styles.partyDetail}>{companyInfo.email}</Text>
            )}
          </View>

          <View style={styles.partyBox}>
            <Text style={styles.partyHeader}>Party 2 (Client / Counterparty)</Text>
            <Text style={styles.partyName}>
              {data?.clientName || "Client Organization"}
            </Text>
            {data?.clientCompany && (
              <Text style={styles.partyDetail}>{data.clientCompany}</Text>
            )}
            {data?.clientAddress && (
              <Text style={styles.partyDetail}>{data.clientAddress}</Text>
            )}
            {data?.clientEmail && (
              <Text style={styles.partyDetail}>{data.clientEmail}</Text>
            )}
          </View>
        </View>

        {/* Commercial Terms (If value specified) */}
        {(data?.value || data?.paymentTerms) && (
          <View style={styles.commercialBox}>
            {data?.value && (
              <View style={styles.commercialItem}>
                <Text style={styles.commercialLabel}>Contract Value</Text>
                <Text style={styles.commercialValue}>
                  {data?.currency || "USD"} {Number(data.value).toLocaleString()}
                </Text>
              </View>
            )}
            {data?.paymentTerms && (
              <View style={styles.commercialItem}>
                <Text style={styles.commercialLabel}>Payment Terms</Text>
                <Text style={styles.commercialValue}>{data.paymentTerms}</Text>
              </View>
            )}
          </View>
        )}

        {/* Section 1: Scope of Work */}
        {data?.scope && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Scope of Work & Services</Text>
            <Text style={styles.scopeText}>{data.scope}</Text>
          </View>
        )}

        {/* Section 2: Terms & Conditions / Clauses (2-Column Grid) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            2. Terms, Conditions & Covenants
          </Text>
          {clausesList.length > 0 ? (
            <View style={styles.clausesGrid}>
              <View style={styles.clauseCol}>
                {col1Clauses.map((c, idx) => (
                  <View key={`c1-${idx}`} style={styles.clauseCard}>
                    {c.title ? (
                      <Text style={styles.clauseHeading}>{c.title}</Text>
                    ) : null}
                    <Text style={styles.clauseBody}>{c.body}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.clauseCol}>
                {col2Clauses.map((c, idx) => (
                  <View key={`c2-${idx}`} style={styles.clauseCard}>
                    {c.title ? (
                      <Text style={styles.clauseHeading}>{c.title}</Text>
                    ) : null}
                    <Text style={styles.clauseBody}>{c.body}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.scopeText}>
              The parties agree to perform all obligations in good faith in
              accordance with standard enterprise terms.
            </Text>
          )}
        </View>

        {/* Witness Execution Statement */}
        <Text style={styles.witnessText}>
          IN WITNESS WHEREOF, the duly authorized representatives of the Parties have executed this Agreement as of the Effective Date.
        </Text>

        {/* Signatures & Execution */}
        <View style={styles.signaturesContainer}>
          <View style={styles.sigBlock}>
            <Text style={styles.sigTitle}>
              For {companyInfo?.name || "Times Works"}
            </Text>
            <Text style={styles.sigSub}>Authorized Representative</Text>
            <Text style={styles.sigSub}>Date: {effectiveDateStr}</Text>
          </View>

          <View style={styles.sigBlock}>
            <Text style={styles.sigTitle}>
              For {data?.clientName || "Client"}
            </Text>
            <Text style={styles.sigSub}>Authorized Representative</Text>
            <Text style={styles.sigSub}>Date: ____________________</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {companyInfo?.name || "Times Works"} • {data?.agreementNumber || "AGR-2026-001"}
          </Text>
          <Text style={styles.footerText}>Legally Binding Agreement • Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  )
}
