import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
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
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    fontSize: 9,
    lineHeight: 1.5,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: "#c82020",
    paddingBottom: 16,
    marginBottom: 20,
  },
  companyLogo: {
    width: 65,
    height: "auto",
    maxHeight: 50,
    objectFit: "contain",
    marginBottom: 6,
  },
  companyName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  companyText: {
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.3,
  },
  metaRight: {
    alignItems: "flex-end",
  },
  docBadge: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#c82020",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  docBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  agreementTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
    textAlign: "right",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 8,
    color: "#64748b",
    width: 80,
    textAlign: "right",
    paddingRight: 6,
  },
  metaValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    width: 90,
    textAlign: "right",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 0.75,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 3,
    marginBottom: 8,
  },
  partiesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 0.75,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 10,
    marginBottom: 14,
  },
  partyBox: {
    flex: 1,
    paddingRight: 10,
  },
  partyHeader: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  partyName: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  partyDetail: {
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.3,
  },
  scopeText: {
    fontSize: 8.5,
    color: "#334155",
    lineHeight: 1.5,
  },
  commercialBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0fdf4",
    borderWidth: 0.75,
    borderColor: "#bbf7d0",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  commercialItem: {
    flex: 1,
  },
  commercialLabel: {
    fontSize: 7.5,
    color: "#166534",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  commercialValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#15803d",
    marginTop: 2,
  },
  clausesList: {
    marginTop: 4,
  },
  clauseItem: {
    marginBottom: 8,
    lineHeight: 1.45,
  },
  signaturesContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sigBlock: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#94a3b8",
    paddingTop: 6,
  },
  sigTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  sigSub: {
    fontSize: 7.5,
    color: "#64748b",
    lineHeight: 1.3,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#cbd5e1",
    paddingTop: 5,
  },
  footerText: {
    fontSize: 7.5,
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

  // Process clauses into clean paragraphs or numbered list
  const clausesText: string = data?.clauses || ""
  const clauseLines = clausesText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const agreementTypeLabel =
    (data?.type || "SERVICE_AGREEMENT").replace(/_/g, " ")

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Security Watermark Layer */}
        <WatermarkLayer
          ds={defaultDesignSettings}
          companyLogo={companyInfo?.logoUrl}
          companyName={companyInfo?.name || "CONFIDENTIAL"}
        />

        {/* Corporate Header */}
        <View style={styles.header}>
          <View style={{ flex: 1, paddingRight: 15 }}>
            {companyInfo?.logoUrl && (
              <Image src={companyInfo.logoUrl} style={styles.companyLogo} />
            )}
            <Text style={styles.companyName}>
              {companyInfo?.name || "Times Digitals"}
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

          <View style={styles.metaRight}>
            <View style={styles.docBadge}>
              <Text style={styles.docBadgeText}>{agreementTypeLabel}</Text>
            </View>
            <Text style={styles.agreementTitle}>
              {data?.title || "Legal Agreement"}
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
              {companyInfo?.name || "Service Provider"}
            </Text>
            <Text style={styles.partyDetail}>
              {companyInfo?.address || "Registered Corporate Office"}
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

        {/* Section 2: Terms & Conditions / Clauses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            2. Terms, Conditions & Covenants
          </Text>
          <View style={styles.clausesList}>
            {clauseLines.length > 0 ? (
              clauseLines.map((clause, idx) => (
                <Text key={idx} style={styles.clauseItem}>
                  {clause}
                </Text>
              ))
            ) : (
              <Text style={styles.scopeText}>
                The parties agree to perform all obligations in good faith in
                accordance with standard enterprise terms.
              </Text>
            )}
          </View>
        </View>

        {/* Signatures & Execution */}
        <View style={styles.signaturesContainer} wrap={false}>
          <View style={styles.sigBlock}>
            <Text style={styles.sigTitle}>
              For {companyInfo?.name || "Service Provider"}
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
            {companyInfo?.name || "DocuFlow"} • {data?.agreementNumber}
          </Text>
          <Text style={styles.footerText}>Legally Binding Agreement</Text>
        </View>
      </Page>
    </Document>
  )
}
