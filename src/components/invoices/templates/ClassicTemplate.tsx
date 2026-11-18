import React from 'react';
import { Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import { WatermarkLayer } from './WatermarkLayer';
import { CompanyInfo, ClientInfo, InvoiceMeta, InvoicePayment, InvoiceTermsAndNotes, InvoiceSignatures, InvoiceFooter, InvoiceTable, InvoiceTotals } from './shared-sections';
import { getFontFamily } from './font-utils';

export function ClassicTemplate({ data, company, clients, totals, ds }: any) {
    const selectedClient = clients?.find((c: any) => c.id === data.clientId) || null;
    const colors = ds.colors;
    const sizes = ds.typography.sizes;
    const vis = ds.visibility;

    const styles = StyleSheet.create({
        page: {
            padding: 36,
            fontFamily: getFontFamily(ds.typography.fontFamily),
            backgroundColor: '#ffffff',
            paddingBottom: 60,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 14,
            borderBottom: `1.5pt solid ${colors.primary}`,
            marginBottom: 18,
        },
        logo: { width: Math.min(ds.layout.logoSize || 70, 70), height: 'auto', objectFit: 'contain', marginBottom: 6 },
        companyCol: { flex: 1, paddingRight: 16 },
        invoiceMetaCol: { flex: 1, alignItems: 'flex-end' },
        companyName: { fontSize: Math.min(sizes.sectionHeading + 2, 14), fontWeight: 'bold', color: colors.primary, marginBottom: 3 },
        invoiceTitle: { fontSize: Math.min(sizes.invoiceTitle, 24), fontWeight: 'bold', color: colors.invoiceTitle, letterSpacing: 2, marginBottom: 8 },
        textNormal: { fontSize: Math.min(sizes.bodyText, 9), color: colors.primary, marginBottom: 2, lineHeight: 1.4 },
        textBold: { fontSize: Math.min(sizes.bodyText, 9), color: colors.primary, fontWeight: 'bold', marginBottom: 2 },
        metaGrid: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 3, width: '100%' },
        metaLabel: { width: 70, color: colors.secondary, fontSize: Math.min(sizes.bodyText, 9), textAlign: 'right', paddingRight: 8 },
        metaValue: { width: 90, fontWeight: 'bold', color: colors.primary, textAlign: 'right', fontSize: Math.min(sizes.bodyText, 9) },
        sectionTitle: { fontSize: Math.min(sizes.sectionHeading, 10), fontWeight: 'bold', color: colors.secondary, textTransform: 'uppercase', marginBottom: 5, borderBottom: `0.5pt solid ${colors.secondary}`, paddingBottom: 3 },
        infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
        billToCol: { flex: 1, paddingRight: 16 },
        paymentCol: { flex: 1, paddingLeft: 16 },
        table: { width: '100%', marginBottom: 16 },
        tableHeader: { flexDirection: 'row', backgroundColor: colors.tableHeader, padding: 6, borderBottom: `1pt solid ${colors.primary}` },
        thText: { fontWeight: 'bold', color: colors.tableText, fontSize: Math.min(sizes.tableText, 9), textTransform: 'uppercase' },
        tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 6, borderBottom: '0.5pt solid #e2e8f0' },
        tdText: { fontSize: Math.min(sizes.tableText, 9), color: colors.tableText },
        tdTextBold: { fontSize: Math.min(sizes.tableText, 9), color: colors.tableText, fontWeight: 'bold' },
        summaryContainer: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginBottom: 14 },
        summaryBox: { width: 220 },
        summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottom: '0.5pt solid #f1f5f9' },
        grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTop: `1.5pt solid ${colors.totalAmount}`, marginTop: 3 },
        grandTotalText: { fontWeight: 'bold', fontSize: Math.min(sizes.totalAmount, 14), color: colors.totalAmount },
        footerText: { fontSize: Math.min(sizes.footerText, 8), color: colors.footer, textAlign: 'center' },
    });

    return (
        <Page size="A4" style={styles.page} wrap>
            <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} companyName={company?.name} />

            <View style={styles.headerRow}>
                <View style={styles.companyCol}>
                    <CompanyInfo company={company} vis={vis} styles={styles} />
                </View>
                <View style={styles.invoiceMetaCol}>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <InvoiceMeta data={data} vis={vis} styles={styles} />
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.billToCol}>
                    <Text style={styles.sectionTitle}>Bill To</Text>
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
            <InvoiceFooter company={company} vis={vis} styles={styles} />
        </Page>
    );
}
