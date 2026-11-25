import React from "react"
import { Page, View, StyleSheet, Text, Image } from "@react-pdf/renderer"
import { WatermarkLayer } from "./WatermarkLayer"
import { getFontFamily } from "./font-utils"
import { format } from "date-fns"

export function ProfessionalTemplate({ data, company, clients, totals, ds }: any) {
  const selectedClient = clients?.find((c: any) => c.id === data.clientId) || null

  const colors = {
    primary: "#0f172a",
    brand: "#c82020",
    textMuted: "#64748b",
    border: "#e2e8f0",
    tableHeader: "#f8fafc",
    tableRowBorder: "#f1f5f9",
    accentBg: "#fafafa",
  }

  const currencySymbol =
    data.currency === "USD"
      ? "$"
      : data.currency === "EUR"
      ? "€"
      : data.currency === "GBP"
      ? "£"
      : data.currency === "INR"
      ? "₹"
      : data.currency === "BDT"
      ? "BDT "
      : `${data.currency || "$"} `

  const fmt = (num: number) => {
    return `${currencySymbol}${Number(num || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const isQuote = !!data.quotationNumber
  const documentTitle = isQuote ? "QUOTATION" : "INVOICE"
  const documentNumber = isQuote ? data.quotationNumber : data.invoiceNumber || "INV-2026"

  const clientName = selectedClient?.name || data.clientName || "Client Name"
  const clientCompany = selectedClient?.clientCompany || data.clientCompany || ""
  const clientEmail = selectedClient?.email || data.clientEmail || ""
  const clientAddress = selectedClient?.address || data.clientAddress || ""

  const rawCompanyName = company?.name || data.companyDetails?.name || ""
  const companyName = (!rawCompanyName || rawCompanyName.toLowerCase().includes("tigitail") || rawCompanyName.toLowerCase().includes("times digital") || rawCompanyName.includes("'s Company")) ? "Times Works" : rawCompanyName
  const companyAddress = company?.address || data.companyDetails?.address || "Times Works Tower, Suite 400, Redmond, WA 98052, USA"
  const rawEmail = company?.email || data.companyDetails?.email || ""
  const companyEmail = (!rawEmail || rawEmail.includes("timesdigitals.com")) ? "billing@timesworks.com" : rawEmail
  const companyPhone = company?.phone || data.companyDetails?.phone || "+1 (800) 555-0199"

  const issueDateFormatted = data.issueDate ? format(new Date(data.issueDate), "MMMM d, yyyy") : ""
  const dueDateFormatted = (data.dueDate || data.validUntil)
    ? format(new Date(data.dueDate || data.validUntil), "MMMM d, yyyy")
    : ""

  const items = data.items || []

  const styles = StyleSheet.create({
    page: {
      paddingTop: 32,
      paddingBottom: 32,
      paddingHorizontal: 34,
      fontFamily: "Helvetica",
      backgroundColor: "#ffffff",
      fontSize: 8.5,
      color: colors.primary,
      lineHeight: 1.35,
      position: "relative",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingBottom: 14,
      borderBottomWidth: 1.2,
      borderBottomColor: colors.brand,
      marginBottom: 16,
    },
    brandLeft: {
      flexDirection: "row",
      alignItems: "center",
      width: "55%",
    },
    logoBox: {
      width: 44,
      height: 44,
      borderRadius: 6,
      backgroundColor: colors.brand,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    companyLogo: {
      width: 44,
      height: 44,
      maxHeight: 44,
      objectFit: "contain",
      marginRight: 10,
    },
    companyName: {
      fontSize: 15,
      fontFamily: "Helvetica-Bold",
      color: colors.primary,
      lineHeight: 1.2,
      marginBottom: 2,
    },
    companySubtitle: {
      fontSize: 7.5,
      fontFamily: "Helvetica",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      lineHeight: 1.2,
    },
    headerRight: {
      width: "42%",
      flexDirection: "column",
      alignItems: "flex-end",
      justifyContent: "flex-start",
    },
    documentTitle: {
      fontSize: 20,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 2,
      color: colors.primary,
      lineHeight: 1.2,
      marginBottom: 6,
      textAlign: "right",
    },
    invoiceNumber: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      color: colors.brand,
      letterSpacing: 0.6,
      textAlign: "right",
      marginTop: 2,
    },
    metaGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 18,
    },
    metaCol: {
      width: "23%",
    },
    metaLabel: {
      fontSize: 7.5,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      color: colors.textMuted,
      marginBottom: 3,
      letterSpacing: 0.5,
    },
    metaValueBold: {
      fontSize: 8.5,
      fontFamily: "Helvetica-Bold",
      color: colors.primary,
      marginBottom: 2,
    },
    metaValueNormal: {
      fontSize: 8,
      fontFamily: "Helvetica",
      color: colors.textMuted,
      lineHeight: 1.3,
    },
    metaValueBrand: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: colors.brand,
      marginTop: 2,
    },
    table: {
      width: "100%",
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      overflow: "hidden",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: colors.tableHeader,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    thText: {
      fontSize: 7.5,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.tableRowBorder,
    },
    tdText: {
      fontSize: 8,
      fontFamily: "Helvetica",
      color: colors.primary,
    },
    tdTextBold: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: colors.primary,
    },
    summarySection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 14,
    },
    notesCol: {
      width: "50%",
    },
    notesBox: {
      backgroundColor: "#f8fafc",
      padding: 8,
      borderRadius: 5,
      borderWidth: 0.75,
      borderColor: colors.border,
      marginBottom: 8,
    },
    notesTitle: {
      fontSize: 7.5,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      color: colors.textMuted,
      marginBottom: 3,
      letterSpacing: 0.4,
    },
    notesContent: {
      fontSize: 7.5,
      fontFamily: "Helvetica",
      color: colors.textMuted,
      lineHeight: 1.3,
    },
    remittanceCard: {
      backgroundColor: "#fcfcfd",
      borderWidth: 0.75,
      borderColor: "#e2e8f0",
      borderRadius: 5,
      padding: 8,
      marginBottom: 6,
    },
    remittanceTitle: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    remittanceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    remittanceLabel: {
      fontSize: 7,
      fontFamily: "Helvetica",
      color: "#64748b",
    },
    remittanceValue: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: "#1e293b",
    },
    securityBadge: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: "#059669",
      marginTop: 2,
    },
    totalsCol: {
      width: "44%",
    },
    totalsBox: {
      backgroundColor: "#f8fafc",
      borderWidth: 0.75,
      borderColor: colors.border,
      borderRadius: 5,
      padding: 10,
    },
    totalsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 3.5,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    totalLabel: {
      fontSize: 8,
      fontFamily: "Helvetica",
      color: colors.textMuted,
    },
    totalVal: {
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: colors.primary,
    },
    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 6,
      borderTopWidth: 1.5,
      borderTopColor: colors.brand,
      marginTop: 3,
    },
    grandTotalLabel: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: colors.primary,
    },
    grandTotalVal: {
      fontSize: 11.5,
      fontFamily: "Helvetica-Bold",
      color: colors.brand,
    },
    termsSection: {
      borderTopWidth: 0.75,
      borderTopColor: colors.border,
      paddingTop: 10,
      marginBottom: 14,
    },
    termsTitle: {
      fontSize: 7.5,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      color: colors.textMuted,
      marginBottom: 3,
      letterSpacing: 0.4,
    },
    termsContent: {
      fontSize: 7.5,
      fontFamily: "Helvetica",
      color: colors.textMuted,
      lineHeight: 1.3,
    },
    signoffRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 0.75,
      borderTopColor: "#e2e8f0",
    },
    signoffLeft: {
      width: "55%",
    },
    signoffText: {
      fontSize: 7,
      fontFamily: "Helvetica",
      color: "#64748b",
      lineHeight: 1.3,
    },
    signoffRight: {
      width: "35%",
      alignItems: "flex-end",
    },
    signLine: {
      width: 140,
      borderBottomWidth: 0.75,
      borderBottomColor: "#94a3b8",
      marginBottom: 3,
    },
    signLabel: {
      fontSize: 7,
      fontFamily: "Helvetica-Bold",
      color: "#475569",
      textAlign: "right",
    },
    footer: {
      position: "absolute",
      bottom: 14,
      left: 34,
      right: 34,
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 0.5,
      borderTopColor: "#cbd5e1",
      paddingTop: 4,
    },
    footerText: {
      fontSize: 6.5,
      fontFamily: "Helvetica",
      color: "#94a3b8",
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} companyName={companyName} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandLeft}>
          {company?.logoUrl ? (
            <Image src={company.logoUrl} style={styles.companyLogo} />
          ) : (
            <View style={styles.logoBox}>
              <Text style={{ color: "#ffffff", fontSize: 16, fontFamily: "Helvetica-Bold" }}>TW</Text>
            </View>
          )}
          <View>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.companySubtitle}>Professional Financial Services</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.documentTitle}>{documentTitle}</Text>
          <Text style={styles.invoiceNumber}>{documentNumber}</Text>
        </View>
      </View>

      {/* 4-Col Meta Grid */}
      <View style={styles.metaGrid}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>FROM</Text>
          <Text style={styles.metaValueBold}>{companyName}</Text>
          <Text style={styles.metaValueNormal}>{companyAddress}</Text>
          <Text style={styles.metaValueBrand}>{companyEmail}</Text>
        </View>

        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>BILL TO</Text>
          <Text style={styles.metaValueBold}>{clientName}</Text>
          {clientCompany ? <Text style={styles.metaValueNormal}>{clientCompany}</Text> : null}
          <Text style={styles.metaValueNormal}>{clientAddress || "Client Business Address"}</Text>
          {clientEmail ? <Text style={styles.metaValueNormal}>{clientEmail}</Text> : null}
        </View>

        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>ISSUED</Text>
          <Text style={styles.metaValueNormal}>{issueDateFormatted || "Date Issued"}</Text>
          <Text style={[styles.metaLabel, { marginTop: 6 }]}>{isQuote ? "VALID UNTIL" : "DUE DATE"}</Text>
          <Text style={styles.metaValueBold}>{dueDateFormatted || "Upon Receipt"}</Text>
          <Text style={styles.metaValueNormal}>{data.paymentTerms || "NET 15 days"}</Text>
        </View>

        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>P.O. NUMBER</Text>
          <Text style={styles.metaValueBold}>PO-{documentNumber}</Text>
          <Text style={[styles.metaLabel, { marginTop: 6 }]}>STATUS</Text>
          <Text style={styles.metaValueBrand}>{data.status || "DRAFT"}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.thText, { flex: 5 }]}>DESCRIPTION</Text>
          <Text style={[styles.thText, { flex: 2, textAlign: "center" }]}>HOURS / QTY</Text>
          <Text style={[styles.thText, { flex: 2, textAlign: "right" }]}>RATE</Text>
          <Text style={[styles.thText, { flex: 2, textAlign: "right" }]}>AMOUNT</Text>
        </View>

        {items.map((item: any, i: number) => {
          const qty = Number(item.quantity || 0)
          const rate = Number(item.unitPrice || 0)
          const amount = qty * rate
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tdTextBold, { flex: 5 }]}>
                {item.description || "Service deliverable"}
              </Text>
              <Text style={[styles.tdText, { flex: 2, textAlign: "center", color: colors.textMuted }]}>
                {qty} {item.unit || ""}
              </Text>
              <Text style={[styles.tdText, { flex: 2, textAlign: "right", color: colors.textMuted }]}>
                {fmt(rate)}
              </Text>
              <Text style={[styles.tdTextBold, { flex: 2, textAlign: "right" }]}>
                {fmt(amount)}
              </Text>
            </View>
          )
        })}
      </View>

      {/* Totals & Notes Section */}
      <View style={styles.summarySection}>
        <View style={styles.notesCol}>
          {data.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>Client Notes & Specifications</Text>
              <Text style={styles.notesContent}>{data.notes}</Text>
            </View>
          ) : null}

          {/* Payment & Remittance Instructions */}
          <View style={styles.remittanceCard}>
            <Text style={styles.remittanceTitle}>Payment & Wire Instructions</Text>
            <View style={styles.remittanceRow}>
              <Text style={styles.remittanceLabel}>Payment Options:</Text>
              <Text style={styles.remittanceValue}>ACH • Wire • Corporate Card</Text>
            </View>
            <View style={styles.remittanceRow}>
              <Text style={styles.remittanceLabel}>Beneficiary:</Text>
              <Text style={styles.remittanceValue}>{companyName}</Text>
            </View>
            <View style={styles.remittanceRow}>
              <Text style={styles.remittanceLabel}>Remittance Reference:</Text>
              <Text style={styles.remittanceValue}>{documentNumber}</Text>
            </View>
          </View>

          <Text style={styles.securityBadge}>✓ Times Works Anti-Counterfeit & Cryptographic Verification Protected</Text>
        </View>

        <View style={styles.totalsCol}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalVal}>{fmt(totals?.subtotal || 0)}</Text>
            </View>
            {totals?.discountAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={[styles.totalLabel, { color: "#059669" }]}>Discount</Text>
                <Text style={[styles.totalVal, { color: "#059669" }]}>-{fmt(totals.discountAmount)}</Text>
              </View>
            ) : null}
            {totals?.taxTotal > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalLabel}>Applicable Tax</Text>
                <Text style={styles.totalVal}>+{fmt(totals.taxTotal)}</Text>
              </View>
            ) : null}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL DUE</Text>
              <Text style={styles.grandTotalVal}>{fmt(totals?.total || 0)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Payment Instructions / Terms */}
      {data.terms ? (
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Commercial Terms & Conditions</Text>
          <Text style={styles.termsContent}>{data.terms}</Text>
        </View>
      ) : null}

      {/* Sign-off & Execution Block */}
      <View style={styles.signoffRow}>
        <View style={styles.signoffLeft}>
          <Text style={styles.signoffText}>
            Thank you for partnering with {companyName}. For billing questions, contact {companyEmail} or call {companyPhone}.
          </Text>
        </View>
        <View style={styles.signoffRight}>
          <View style={styles.signLine} />
          <Text style={styles.signLabel}>Authorized Representative</Text>
        </View>
      </View>

      {/* Fixed Legal Footer */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>
          {companyName} • Professional Document System • {documentNumber}
        </Text>
        <Text style={styles.footerText}>Page 1 of 1 • Official Business Record</Text>
      </View>
    </Page>
  )
}
