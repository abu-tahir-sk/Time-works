import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer"
import type { AgreementFormValues } from "@/lib/agreements/schema"
import { AGREEMENT_TYPES } from "@/lib/agreements/schema"

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontFamily: "Helvetica",
        fontSize: 9,
        color: "#1f2937",
        lineHeight: 1.4,
        backgroundColor: "#ffffff",
    },
    headerBand: {
        backgroundColor: "#ffffff",
        color: "#111827",
        paddingVertical: 20,
        paddingHorizontal: 44,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    headerLeft: {
        flexDirection: "column",
    },
    headerKicker: {
        fontSize: 8,
        color: "#9ca3af",
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
        textTransform: "uppercase",
    },
    companyName: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
        textAlign: "right",
        marginBottom: 2,
    },
    companyMeta: {
        fontSize: 8,
        color: "#6b7280",
        textAlign: "right",
    },
    body: {
        paddingHorizontal: 44,
        paddingTop: 18,
        paddingBottom: 48,
    },
    refRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    refCell: {
        flexDirection: "column",
    },
    refLabel: {
        fontSize: 7.5,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 2,
    },
    refValue: {
        fontSize: 9.5,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
    },
    sectionHeading: {
        fontSize: 9.5,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
        textTransform: "uppercase",
        letterSpacing: 1.2,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingBottom: 3,
        marginBottom: 8,
        marginTop: 12,
    },
    partiesRow: {
        flexDirection: "row",
        gap: 12,
    },
    partyCard: {
        flex: 1,
        borderWidth: 0,
        borderRadius: 0,
        padding: 9,
        backgroundColor: "#ffffff",
    },
    partyRole: {
        fontSize: 7.5,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },
    partyName: {
        fontSize: 10.5,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
        marginBottom: 3,
    },
    partyMeta: {
        fontSize: 8.5,
        color: "#4b5563",
    },
    detailRow: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    detailItem: {
        width: "25%",
        marginBottom: 6,
        paddingRight: 12,
    },
    detailLabel: {
        fontSize: 7.5,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 9.5,
        fontFamily: "Helvetica-Bold",
        color: "#111827",
    },
    bodyText: {
        fontSize: 9.5,
        color: "#374151",
        textAlign: "justify",
    },
    clauseText: {
        fontSize: 8.5,
        color: "#374151",
        textAlign: "justify",
        whiteSpace: "pre-line",
        lineHeight: 1.35,
    },
    signatureRow: {
        flexDirection: "row",
        gap: 24,
        marginTop: 22,
    },
    signatureCol: {
        flex: 1,
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        marginTop: 28,
        paddingTop: 5,
        fontSize: 8,
        color: "#374151",
    },
    signatureName: {
        fontFamily: "Helvetica-Bold",
        color: "#111827",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 44,
        right: 44,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingTop: 8,
    },
    footerText: {
        fontSize: 7.5,
        color: "#9ca3af",
    },
    logo: {
        width: 90,
        objectFit: "contain",
        objectPosition: "right",
        maxHeight: 36,
    },
})

function formatDate(value: string | undefined): string {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function formatValue(value: string | undefined, currency: string): string {
    if (!value || Number.isNaN(Number(value))) return "—"
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number(value))
}

export function AgreementPdf({ data }: { data: AgreementFormValues }) {
    const typeLabel =
        AGREEMENT_TYPES.find((t) => t.value === data.type)?.label ?? "Agreement"

    return (
        <Document
            title={data.title}
            author={data.companyDetails?.name || "DocuFlow"}
            subject={typeLabel}
        >
            <Page size="A4" style={styles.page}>
                {/* Header band */}
                <View style={styles.headerBand} fixed>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerKicker}>
                            {data.agreementNumber}
                        </Text>
                        <Text style={styles.headerTitle}>{data.title}</Text>
                    </View>
                    <View>
                        {data.companyDetails?.logoUrl ? (
                            <Image src={data.companyDetails.logoUrl} style={styles.logo} />
                        ) : null}
                        <Text style={styles.companyName}>
                            {data.companyDetails?.name}
                        </Text>
                        {data.companyDetails?.email || data.companyDetails?.phone ? (
                            <Text style={styles.companyMeta}>
                                {[data.companyDetails.email, data.companyDetails.phone]
                                    .filter(Boolean)
                                    .join("  •  ")}
                            </Text>
                        ) : null}
                    </View>
                </View>

                <View style={styles.body}>
                    {/* Reference row */}
                    <View style={styles.refRow}>
                        <View style={styles.refCell}>
                            <Text style={styles.refLabel}>Agreement Type</Text>
                            <Text style={styles.refValue}>{typeLabel}</Text>
                        </View>
                        <View style={styles.refCell}>
                            <Text style={styles.refLabel}>Agreement No.</Text>
                            <Text style={styles.refValue}>{data.agreementNumber}</Text>
                        </View>
                        <View style={styles.refCell}>
                            <Text style={styles.refLabel}>Date Issued</Text>
                            <Text style={styles.refValue}>{formatDate(data.effectiveDate)}</Text>
                        </View>
                    </View>

                    {/* Parties */}
                    <Text style={styles.sectionHeading}>Parties</Text>
                    <View style={styles.partiesRow}>
                        <View style={styles.partyCard}>
                            <Text style={styles.partyRole}>Between — The Company</Text>
                            <Text style={styles.partyName}>
                                {data.companyDetails?.name || "—"}
                            </Text>
                            {data.companyDetails?.address ? (
                                <Text style={styles.partyMeta}>
                                    {data.companyDetails.address}
                                </Text>
                            ) : null}
                            {data.companyDetails?.taxId ? (
                                <Text style={styles.partyMeta}>
                                    Tax ID: {data.companyDetails.taxId}
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.partyCard}>
                            <Text style={styles.partyRole}>And — The Client</Text>
                            <Text style={styles.partyName}>
                                {data.clientCompany || data.clientName}
                            </Text>
                            {data.clientCompany && data.clientName ? (
                                <Text style={styles.partyMeta}>
                                    Attn: {data.clientName}
                                </Text>
                            ) : null}
                            {data.clientAddress ? (
                                <Text style={styles.partyMeta}>{data.clientAddress}</Text>
                            ) : null}
                            {data.clientEmail ? (
                                <Text style={styles.partyMeta}>{data.clientEmail}</Text>
                            ) : null}
                        </View>
                    </View>

                    {/* Key details */}
                    <Text style={styles.sectionHeading}>Agreement Details</Text>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Effective Date</Text>
                            <Text style={styles.detailValue}>
                                {formatDate(data.effectiveDate)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Expiry Date</Text>
                            <Text style={styles.detailValue}>
                                {formatDate(data.expiryDate)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Agreement Value</Text>
                            <Text style={styles.detailValue}>
                                {formatValue(data.value, data.currency)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Payment Terms</Text>
                            <Text style={styles.detailValue}>{data.paymentTerms || "—"}</Text>
                        </View>
                    </View>

                    {/* Scope */}
                    {data.scope ? (
                        <>
                            <Text style={styles.sectionHeading}>Scope of Work</Text>
                            <Text style={styles.clauseText}>{data.scope}</Text>
                        </>
                    ) : null}

                    {/* Clauses */}
                    {data.clauses ? (
                        <>
                            <Text style={styles.sectionHeading}>Terms &amp; Conditions</Text>
                            <Text style={styles.clauseText}>{data.clauses}</Text>
                        </>
                    ) : null}

                    {/* Notes */}
                    {data.notes ? (
                        <>
                            <Text style={styles.sectionHeading}>Additional Notes</Text>
                            <Text style={styles.clauseText}>{data.notes}</Text>
                        </>
                    ) : null}

                    {/* Signatures */}
                    <Text style={styles.sectionHeading}>Signatures</Text>
                    <View style={styles.signatureRow}>
                        <View style={styles.signatureCol}>
                            <Text style={styles.signatureLine}>
                                For <Text style={styles.signatureName}>
                                    {data.companyDetails?.name || "The Company"}
                                </Text>
                                {"\n"}Authorised Signatory
                            </Text>
                        </View>
                        <View style={styles.signatureCol}>
                            <Text style={styles.signatureLine}>
                                For <Text style={styles.signatureName}>
                                    {data.clientCompany || data.clientName || "The Client"}
                                </Text>
                                {"\n"}Authorised Signatory
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        {data.companyDetails?.name} • {data.agreementNumber} • Confidential
                    </Text>
                    <Text
                        style={styles.footerText}
                        render={({ pageNumber, totalPages }) =>
                            `Page ${pageNumber} of ${totalPages}`
                        }
                    />
                </View>
            </Page>
        </Document>
    )
}
