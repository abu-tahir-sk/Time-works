import React from 'react';
import { Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import { WatermarkLayer } from './WatermarkLayer';
import { CompanyInfo, ClientInfo, InvoiceMeta, InvoicePayment, InvoiceTermsAndNotes, InvoiceSignatures, InvoiceFooter, InvoiceTable, InvoiceTotals } from './shared-sections';
import { getFontFamily } from './font-utils';

export function MinimalTemplate({ data, company, clients, totals, ds }: any) {
    const selectedClient = clients?.find((c: any) => c.id === data.clientId) || null;
    const colors = ds.colors;
    const sizes = ds.typography.sizes;
    const vis = ds.visibility;

    const styles = StyleSheet.create({
        page: {
            padding: 44,
            fontFamily: getFontFamily(ds.typography.fontFamily),
            backgroundColor: '#ffffff',
            paddingBottom: 55,
        },
        logo: { width: Math.min(ds.layout.logoSize || 60, 60), height: 'auto', objectFit: 'contain', marginBottom: 6 },
        topSection: { marginBottom: 24 },
        invoiceTitle: { fontSize: Math.min(sizes.invoiceTitle, 24), color: colors.invoiceTitle, letterSpacing: -0.5, marginBottom: 10 },
        gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
        col: { flex: 1, paddingRight: 16 },
        sectionTitle: { fontSize: Math.min(sizes.sectionHeading - 1, 9), color: colors.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
        textNormal: { fontSize: Math.min(sizes.bodyText, 9), color: colors.primary, marginBottom: 2, lineHeight: 1.4 },
        textBold: { fontSize: Math.min(sizes.bodyText, 9), color: colors.primary, fontWeight: 'bold', marginBottom: 2 },
        companyName: { fontSize: Math.min(sizes.bodyText, 9), color: colors.primary, fontWeight: 'bold', marginBottom: 2 },
        metaGrid: { flexDirection: 'row', marginBottom: 3 },
        metaLabel: { width: 70, color: colors.secondary, fontSize: Math.min(sizes.bodyText, 9) },
        metaValue: { flex: 1, color: colors.primary, fontSize: Math.min(sizes.bodyText, 9) },
        table: { width: '100%', marginBottom: 16 },
        tableHeader: { flexDirection: 'row', paddingBottom: 6, borderBottom: '0.5pt solid #f1f5f9', marginBottom: 4 },
        thText: { color: colors.secondary, fontSize: Math.min(sizes.tableText - 1, 8), textTransform: 'uppercase', letterSpacing: 1 },
        tableRow: { flexDirection: 'row', paddingVertical: 6 },
        tdText: { fontSize: Math.min(sizes.tableText, 9), color: colors.primary },
        tdTextBold: { fontSize: Math.min(sizes.tableText, 9), color: colors.primary, fontWeight: 'bold' },
        summaryContainer: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginBottom: 14 },
        summaryBox: { alignSelf: 'flex-end', width: 180, marginTop: 10 },
        summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
        grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, marginTop: 5, borderTop: '1pt solid #000000' },
        grandTotalText: { fontWeight: 'bold', fontSize: Math.min(sizes.totalAmount, 14), color: colors.primary },
        footerText: { fontSize: Math.min(sizes.footerText, 8), color: colors.footer, textAlign: 'center' },
    });

    return (
        <Page size="A4" style={styles.page} wrap>
            <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} companyName={company?.name} />

            <View style={styles.topSection}>
                <Text style={styles.invoiceTitle}>Invoice</Text>
                <CompanyInfo company={company} vis={vis} styles={styles} />
            </View>

            <View style={styles.gridRow}>
                <View style={styles.col}>
                    <Text style={styles.sectionTitle}>Billed To</Text>
                    <ClientInfo client={selectedClient} vis={vis} styles={styles} />
                </View>
                <View style={styles.col}>
                    <Text style={styles.sectionTitle}>Invoice Details</Text>
                    <InvoiceMeta data={data} vis={vis} styles={styles} />
                </View>
            </View>

            <InvoiceTable data={data} vis={vis} styles={styles} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ flex: 1, paddingRight: 30 }}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <InvoicePayment company={company} vis={vis} styles={styles} />
                </View>
                <View style={{ flex: 1 }}>
                    <InvoiceTotals totals={totals} vis={vis} styles={styles} />
                </View>
            </View>

            <InvoiceTermsAndNotes data={data} vis={vis} styles={styles} />
            <InvoiceSignatures company={company} vis={vis} styles={styles} />

            <View style={{ position: 'absolute', bottom: 25, left: 44, right: 44, paddingTop: 10 }} >
                <InvoiceFooter company={company} vis={vis} styles={styles} />
            </View>
        </Page>
    );
}
