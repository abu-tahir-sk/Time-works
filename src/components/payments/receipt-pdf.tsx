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
    borderBottomColor: "#10b981", // Emerald for payment success
    paddingBottom: 14,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 8.5,
    color: "#059669",
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
    textTransform: "uppercase",
  },
  brandContact: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 3,
    lineHeight: 1.3,
  },
  receiptBadgeBlock: {
    alignItems: "flex-end",
  },
  receiptBadge: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  receiptNo: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginTop: 3,
  },
  receiptDate: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  // Main receipt voucher container
  voucherBox: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  amountCallout: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 4,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#065f46",
    textTransform: "uppercase",
  },
  amountValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#047857",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  col: {
    width: "48%",
  },
  fieldLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  fieldValueNormal: {
    fontSize: 8.5,
    color: "#334155",
    marginBottom: 8,
  },
  // Mandatory Remark Highlight Box
  remarkBox: {
    backgroundColor: "#f8fafc",
    borderLeftWidth: 3,
    borderLeftColor: "#c82020",
    padding: 10,
    borderRadius: 3,
    marginBottom: 14,
  },
  remarkLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#c82020",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  remarkText: {
    fontSize: 9,
    color: "#1e293b",
    fontFamily: "Helvetica",
    lineHeight: 1.3,
  },
  // Balance status
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  balanceText: {
    fontSize: 8.5,
    color: "#475569",
  },
  balanceAmount: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  // Signatures
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
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
    bottom: 24,
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

interface ReceiptPdfProps {
  payment: any
  project?: any
  client?: any
  company?: any
}

export function ReceiptPdf({ payment, project, client, company }: ReceiptPdfProps) {
  const currency = payment.currency || project?.currency || "USD"
  const amount = Number(payment.amount) || 0

  const companyName = company?.name || "Times Works"
  const companyEmail = company?.email || "billing@timesworks.com"
  const companyPhone = company?.phone || "+1 (800) 555-0199"
  const companyAddress = company?.address || "Times Works Tower, Suite 400, Redmond, WA 98052, USA"

  const clientName = client?.name || payment.client?.name || "Valued Client"
  const clientCompany = client?.company || payment.client?.company || ""
  const clientEmail = client?.email || payment.client?.email || ""

  const projectTitle = project?.name || payment.project?.name || "Direct Account Remittance"
  const projectCode = project?.code || payment.project?.code || "PRJ-GEN"

  const fmt = (amt: number) => {
    return `${currency} ${Number(amt || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const receiptNumber = payment.receiptNumber || `RCT-${new Date().getFullYear()}-${String(payment.id || "101").slice(-6).toUpperCase()}`
  const paidDate = payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleDateString("en-US")

  const budget = Number(project?.budget) || 0
  const paidTotal = Number(project?.paidAmount) || amount
  const dueRemaining = Math.max(0, budget - paidTotal)

  return (
    <Document title={`Payment-Receipt-${receiptNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>{companyName}</Text>
            <Text style={styles.brandSubtitle}>Official Remittance Voucher</Text>
            <Text style={styles.brandContact}>
              {companyAddress}{"\n"}
              Email: {companyEmail} | Phone: {companyPhone}
            </Text>
          </View>
          <View style={styles.receiptBadgeBlock}>
            <Text style={styles.receiptBadge}>Money Receipt</Text>
            <Text style={styles.receiptNo}>{receiptNumber}</Text>
            <Text style={styles.receiptDate}>Date: {paidDate}</Text>
          </View>
        </View>

        {/* Voucher Main Content */}
        <View style={styles.voucherBox}>
          {/* Amount Callout */}
          <View style={styles.amountCallout}>
            <View>
              <Text style={styles.amountLabel}>Total Amount Received</Text>
              <Text style={{ fontSize: 7.5, color: "#065f46", marginTop: 2 }}>Payment Status: Confirmed & Completed</Text>
            </View>
            <Text style={styles.amountValue}>{fmt(amount)}</Text>
          </View>

          {/* Details Grid */}
          <View style={styles.grid}>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>Received From (Payer):</Text>
              <Text style={styles.fieldValue}>{clientName}</Text>
              {clientCompany && <Text style={styles.fieldValueNormal}>Company: {clientCompany}</Text>}
              {clientEmail && <Text style={styles.fieldValueNormal}>Email: {clientEmail}</Text>}
            </View>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>Applied To Project / Account:</Text>
              <Text style={styles.fieldValue}>{projectTitle}</Text>
              <Text style={styles.fieldValueNormal}>Project Ref: {projectCode}</Text>
              <Text style={styles.fieldValueNormal}>
                Method: {payment.method?.replace(/_/g, " ") || "Bank Transfer"}
                {payment.transactionId ? ` • Txn: ${payment.transactionId}` : ""}
              </Text>
            </View>
          </View>

          {/* Mandatory Remark Note (রিমার্ক) */}
          <View style={styles.remarkBox}>
            <Text style={styles.remarkLabel}>Official Payment Remark / Purpose (রিমার্ক):</Text>
            <Text style={styles.remarkText}>
              "{payment.remarks || payment.remark || "Payment credited against agreed project milestones and deliverables."}"
            </Text>
          </View>

          {/* Remaining Balance if Project exists */}
          {budget > 0 && (
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>Total Project Budget: {fmt(budget)}</Text>
              <Text style={styles.balanceText}>Total Paid to Date: {fmt(paidTotal)}</Text>
              <Text style={styles.balanceAmount}>Remaining Due Balance: {fmt(dueRemaining)}</Text>
            </View>
          )}
        </View>

        {/* Signature & Seal */}
        <View style={styles.signatureRow}>
          <View style={styles.signCol}>
            <View style={styles.signLine} />
            <Text style={styles.signTitle}>Authorized Accounts Officer</Text>
            <Text style={styles.signSubtitle}>Times Works Finance Department</Text>
          </View>
          <View style={styles.signCol}>
            <View style={styles.signLine} />
            <Text style={styles.signTitle}>Payer Acknowledgment</Text>
            <Text style={styles.signSubtitle}>{clientName}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This is an official system-generated payment money receipt issued by Times Works. Retain for tax & accounting records.
        </Text>
      </Page>
    </Document>
  )
}
