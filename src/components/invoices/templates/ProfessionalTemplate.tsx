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

  const companyName = company?.name || data.companyDetails?.name || "Times Works"
  const companyAddress = company?.address || data.companyDetails?.address || "Times Works Tower, Redmond, WA"
  const companyEmail = company?.email || data.companyDetails?.email || "billing@timesworks.com"

  const issueDateFormatted = data.issueDate ? format(new Date(data.issueDate), "MMMM d, yyyy") : ""
  const dueDateFormatted = data.dueDate ? format(new Date(data.dueDate), "MMMM d, yyyy") : ""

  const items = data.items || []

  const styles = StyleSheet.create({
    page: {
      padding: 36,
      fontFamily: getFontFamily(ds?.typography?.fontFamily),
      backgroundColor: "#ffffff",
      fontSize: 9,
      color: colors.primary,
      lineHeight: 1.4,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 20,
    },
    brandLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logoBox: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.brand,
      alignItems: "center",
      justifyContent: "center",
    },
    companyName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
    },
    companySubtitle: {
      fontSize: 8,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginTop: 2,
    },
    headerRight: {
      alignItems: "flex-end",
    },
    documentTitle: {
      fontSize: 28,
      fontFamily: "Times-Roman",
      fontWeight: "normal",
      letterSpacing: 2,
      color: colors.primary,
    },
    invoiceNumber: {
      fontSize: 10,
      fontWeight: "bold",
      color: colors.brand,
      marginTop: 3,
      letterSpacing: 1,
    },
    metaGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    metaCol: {
      width: "23%",
    },
    metaLabel: {
      fontSize: 7.5,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: colors.textMuted,
      marginBottom: 4,
      letterSpacing: 0.5,
    },
    metaValueBold: {
      fontSize: 9,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 2,
    },
    metaValueNormal: {
      fontSize: 8,
      color: colors.textMuted,
      lineHeight: 1.3,
    },
    metaValueBrand: {
      fontSize: 8,
      color: colors.brand,
      fontWeight: "bold",
      marginTop: 2,
    },
    table: {
      width: "100%",
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      overflow: "hidden",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: colors.tableHeader,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 7,
      paddingHorizontal: 10,
    },
    thText: {
      fontSize: 7.5,
      fontWeight: "bold",
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
      fontSize: 8.5,
      color: colors.primary,
    },
    summarySection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    notesCol: {
      width: "48%",
    },
    notesBox: {
      backgroundColor: "#f8fafc",
      padding: 10,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
    },
    notesTitle: {
      fontSize: 7.5,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: colors.textMuted,
      marginBottom: 4,
    },
    notesContent: {
      fontSize: 8,
      color: colors.textMuted,
      lineHeight: 1.4,
    },
    securityBadge: {
      fontSize: 7.5,
      color: "#059669",
      fontWeight: "bold",
    },
    totalsCol: {
      width: "42%",
    },
    totalsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    totalLabel: {
      fontSize: 8.5,
      color: colors.textMuted,
    },
    totalVal: {
      fontSize: 8.5,
      fontWeight: "bold",
      color: colors.primary,
    },
    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 8,
      borderTopWidth: 1.5,
      borderTopColor: colors.primary,
      marginTop: 4,
    },
    grandTotalLabel: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.primary,
    },
    grandTotalVal: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.brand,
    },
    termsSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
      marginTop: 10,
    },
    termsTitle: {
      fontSize: 7.5,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: colors.textMuted,
      marginBottom: 4,
    },
    termsContent: {
      fontSize: 8,
      color: colors.textMuted,
      lineHeight: 1.4,
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} companyName={companyName} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandLeft}>
          {company?.logoUrl ? (
            <Image src={company.logoUrl} style={{ width: 44, height: 44, objectFit: "contain" }} />
          ) : (
            <View style={styles.logoBox}>
              <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>TW</Text>
            </View>
          )}
          <View>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.companySubtitle}>Professional Services & Invoicing</Text>
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
          <Text style={[styles.metaLabel, { marginTop: 8 }]}>DUE</Text>
          <Text style={styles.metaValueBold}>{dueDateFormatted || "Due Date"}</Text>
          <Text style={styles.metaValueNormal}>{data.paymentTerms || "NET 15 days"}</Text>
        </View>

        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>P.O. NUMBER</Text>
          <Text style={styles.metaValueBold}>PO-{documentNumber}</Text>
          <Text style={[styles.metaLabel, { marginTop: 8 }]}>STATUS</Text>
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
              <Text style={[styles.tdText, { flex: 5, fontWeight: "bold" }]}>
                {item.description || "Service deliverable"}
              </Text>
              <Text style={[styles.tdText, { flex: 2, textAlign: "center", color: colors.textMuted }]}>
                {qty} {item.unit || ""}
              </Text>
              <Text style={[styles.tdText, { flex: 2, textAlign: "right", color: colors.textMuted }]}>
                {fmt(rate)}
              </Text>
              <Text style={[styles.tdText, { flex: 2, textAlign: "right", fontWeight: "bold" }]}>
                {fmt(amount)}
              </Text>
            </View>
          )
        })}
      </View>

      {/* Totals & Notes */}
      <View style={styles.summarySection}>
        <View style={styles.notesCol}>
          {data.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>Client Notes</Text>
              <Text style={styles.notesContent}>{data.notes}</Text>
            </View>
          ) : null}
          <Text style={styles.securityBadge}>✓ Times Works Anti-Counterfeit Protected</Text>
        </View>

        <View style={styles.totalsCol}>
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
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalVal}>+{fmt(totals.taxTotal)}</Text>
            </View>
          ) : null}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL DUE</Text>
            <Text style={styles.grandTotalVal}>{fmt(totals?.total || 0)}</Text>
          </View>
        </View>
      </View>

      {/* Payment Instructions / Terms */}
      {data.terms ? (
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Payment Instructions & Terms</Text>
          <Text style={styles.termsContent}>{data.terms}</Text>
        </View>
      ) : null}
    </Page>
  )
}
