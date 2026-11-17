import React from 'react';
import { Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import { WatermarkLayer } from './WatermarkLayer';
import { CompanyInfo, ClientInfo, InvoicePayment, InvoiceTermsAndNotes, InvoiceSignatures, InvoiceFooter, InvoiceTable, InvoiceTotals } from './shared-sections';
import { getFontFamily } from './font-utils';

export function PremiumQuotationTemplate({ data, company, clients, totals, ds }: any) {
    const selectedClient = clients?.find((c: any) => c.id === data.clientId) || null;

    const colors = {
        primary: ds.colors?.primary || '#0f172a',
        secondary: '#3b82f6',
        background: '#ffffff',
        text: '#334155',
        textMuted: '#64748b',
        border: '#e2e8f0',
        tableHeader: '#f8fafc',
        tableText: '#334155',
        totalAmount: '#3b82f6',
    };

    const sizes = ds.typography?.sizes || {
        invoiceTitle: 24,
        sectionHeading: 10,
        bodyText: 9,
        tableText: 9,
        totalAmount: 13,
        footerText: 8,
    };
    const vis = ds.visibility || {};

    const isQuotation = !!data.quotationNumber;
    const documentTitle = isQuotation ? 'QUOTATION' : 'INVOICE';

    const styles = StyleSheet.create({
        page: {
            padding: 36,
            fontFamily: getFontFamily(ds.typography?.fontFamily),
            backgroundColor: colors.background,
            paddingBottom: 55,
        },
        logo: {
            width: Math.min(ds.layout?.logoSize || 70, 80),
            height: 'auto',
            objectFit: 'contain',
            marginBottom: 10,
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
        },
        companyCol: { flex: 1, paddingRight: 16 },
        titleCol: { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start' },
        companyName: {
            fontSize: Math.min(sizes.sectionHeading + 2, 14),
            color: colors.primary,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        textNormal: {
            fontSize: Math.min(sizes.bodyText, 9),
            color: colors.textMuted,
            marginBottom: 2,
            lineHeight: 1.4,
        },
        invoiceTitle: {
            fontSize: Math.min(sizes.invoiceTitle, 24),
            fontWeight: 'bold',
            color: colors.secondary,
            textTransform: 'uppercase',
            marginBottom: 10,
            letterSpacing: 2,
        },
        metaGrid: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 4,
            width: '100%',
        },
        metaLabel: {
            width: 80,
            color: colors.textMuted,
            fontSize: Math.min(sizes.bodyText, 9),
            textAlign: 'right',
            paddingRight: 10,
        },
        metaValue: {
            width: 100,
            fontWeight: 'bold',
            color: colors.primary,
            textAlign: 'right',
            fontSize: Math.min(sizes.bodyText, 9),
        },
        infoBox: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingTop: 14,
            borderTop: `1.5pt solid ${colors.border}`,
        },
        billToCol: { flex: 1, paddingRight: 10 },
        paymentCol: { flex: 1, paddingLeft: 16, borderLeft: `0.5pt solid ${colors.border}` },
        sectionTitle: {
            fontSize: Math.min(sizes.sectionHeading, 10),
            color: colors.secondary,
            marginBottom: 6,
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: 1,
        },
        textBold: {
            fontSize: Math.min(sizes.bodyText, 9),
            color: colors.primary,
            fontWeight: 'bold',
            marginBottom: 2,
        },
        table: { width: '100%', marginBottom: 20 },
        tableHeader: {
            flexDirection: 'row',
            paddingVertical: 8,
            paddingHorizontal: 8,
            backgroundColor: colors.tableHeader,
            borderBottom: `1.5pt solid ${colors.secondary}`,
            borderRadius: 3,
        },
        thText: {
            color: colors.primary,
            fontSize: Math.min(sizes.tableText, 9),
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
        tableRow: {
            flexDirection: 'row',
            paddingVertical: 7,
            paddingHorizontal: 8,
            borderBottom: `0.5pt solid ${colors.border}`,
        },
        tdText: { fontSize: Math.min(sizes.tableText, 9), color: colors.text },
        tdTextBold: { fontSize: Math.min(sizes.tableText, 9), color: colors.primary, fontWeight: 'bold' },
        summaryContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
            marginBottom: 14,
        },
        summaryBox: {
            width: 280,
            backgroundColor: colors.tableHeader,
            padding: 16,
            borderRadius: 6,
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 5,
        },
        grandTotalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 10,
            marginTop: 5,
            borderTop: `1.5pt solid ${colors.secondary}`,
        },
        grandTotalText: {
            fontSize: Math.min(sizes.totalAmount, 14),
            color: colors.secondary,
            fontWeight: 'bold',
        },
        footerText: {
            fontSize: Math.min(sizes.footerText, 8),
            color: colors.textMuted,
            textAlign: 'center',
        },
    });

    return (
        <Page size="A4" style={styles.page} wrap>
            <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} />

            <View style={styles.headerContainer}>
                <View style={styles.companyCol}>
                    <CompanyInfo company={company} vis={vis} styles={styles} />
                </View>
                <View style={styles.titleCol}>
                    <Text style={styles.invoiceTitle}>{documentTitle}</Text>
                    {/* Custom Meta for quotation fields */}
                    <View style={styles.metaGrid}>
                        <Text style={styles.metaLabel}>{isQuotation ? 'Quote No:' : 'Invoice No:'}</Text>
                        <Text style={styles.metaValue}>{data.invoiceNumber || data.quotationNumber || 'DRAFT'}</Text>
                    </View>
                    {vis.showIssueDate !== false && data.issueDate && (
                        <View style={styles.metaGrid}>
                            <Text style={styles.metaLabel}>{isQuotation ? 'Quote Date:' : 'Issue Date:'}</Text>
                            <Text style={styles.metaValue}>{new Date(data.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                        </View>
                    )}
                    {vis.showDueDate !== false && data.dueDate && (
                        <View style={styles.metaGrid}>
                            <Text style={styles.metaLabel}>{isQuotation ? 'Valid Until:' : 'Due Date:'}</Text>
                            <Text style={styles.metaValue}>{new Date(data.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                        </View>
                    )}
                    {vis.showStatus !== false && vis.status !== false && data.status && (
                        <View style={styles.metaGrid}>
                            <Text style={styles.metaLabel}>Status:</Text>
                            <Text style={styles.metaValue}>{data.status}</Text>
                        </View>
                    )}
                    {vis.showPO !== false && data.poReference && (
                        <View style={styles.metaGrid}>
                            <Text style={styles.metaLabel}>PO Ref:</Text>
                            <Text style={styles.metaValue}>{data.poReference}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.infoBox}>
                <View style={styles.billToCol}>
                    <Text style={styles.sectionTitle}>{isQuotation ? 'Prepared For' : 'Billed To'}</Text>
                    <ClientInfo client={selectedClient} vis={vis} styles={styles} />
                </View>
                <View style={styles.paymentCol}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <InvoicePayment company={company} vis={vis} styles={styles} />
                </View>
            </View>

            <InvoiceTable data={data} vis={vis} styles={styles} />
            <InvoiceTotals totals={totals} vis={vis} styles={styles} />

            <InvoiceTermsAndNotes data={data} vis={vis} styles={styles} />
            <InvoiceSignatures company={company} vis={vis} styles={styles} />

            <View style={{ position: 'absolute', bottom: 25, left: 36, right: 36, paddingTop: 10, borderTop: `0.5pt solid ${colors.border}` }} fixed>
                <InvoiceFooter company={company} vis={vis} styles={styles} />
            </View>
        </Page>
    );
}
