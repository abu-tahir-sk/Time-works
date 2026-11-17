import React from 'react';
import { Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import { WatermarkLayer } from './WatermarkLayer';
import { CompanyInfo, ClientInfo, InvoiceMeta, InvoicePayment, InvoiceTermsAndNotes, InvoiceSignatures, InvoiceFooter, InvoiceTable, InvoiceTotals } from './shared-sections';
import { getFontFamily } from './font-utils';

export function ModernTemplate({ data, company, clients, totals, ds }: any) {
    const selectedClient = clients?.find((c: any) => c.id === data.clientId) || null;
    const colors = ds.colors;
    const sizes = ds.typography.sizes;
    const vis = ds.visibility;

    const styles = StyleSheet.create({
        page: { padding: 0, fontFamily: getFontFamily(ds.typography.fontFamily), backgroundColor: '#ffffff', paddingBottom: 0 },
        logo: { width: Math.min(ds.layout.logoSize || 60, 60), height: 'auto', objectFit: 'contain', marginBottom: 6 },
        topBanner: { backgroundColor: colors.primary, paddingVertical: 24, paddingHorizontal: 36, color: '#ffffff', flexDirection: 'row', justifyContent: 'space-between' },
        companyCol: { flex: 1, paddingRight: 16 },
        invoiceMetaCol: { flex: 1, alignItems: 'flex-end' },
        companyName: { fontSize: Math.min(sizes.sectionHeading, 11), color: '#ffffff', fontWeight: 'bold', marginBottom: 3 },
        textNormal: { fontSize: Math.min(sizes.bodyText, 9), color: '#e2e8f0', marginBottom: 2, lineHeight: 1.4 },
        invoiceTitle: { fontSize: Math.min(sizes.invoiceTitle + 2, 26), fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', marginBottom: 8 },
        metaGrid: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 3, width: '100%' },
        metaLabel: { width: 70, color: '#e2e8f0', fontSize: Math.min(sizes.bodyText, 9), textAlign: 'right', paddingRight: 8 },
        metaValue: { width: 90, fontWeight: 'bold', color: '#ffffff', textAlign: 'right', fontSize: Math.min(sizes.bodyText, 9) },
        contentWrapper: { padding: 36, paddingBottom: 55 },
        infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: `1.5pt solid ${colors.tableHeader}` },
        billToCol: { flex: 1, paddingRight: 16 },
        paymentCol: { flex: 1, paddingLeft: 16 },
        sectionTitle: { fontSize: Math.min(sizes.sectionHeading, 10), color: colors.secondary, marginBottom: 4, textTransform: 'uppercase' },
        textBold: { fontSize: Math.min(sizes.bodyText, 9), color: colors.primary, fontWeight: 'bold', marginBottom: 2 },
        table: { width: '100%', marginBottom: 16 },
        tableHeader: { flexDirection: 'row', paddingVertical: 7, borderBottom: `0.5pt solid ${colors.secondary}` },
        thText: { color: colors.secondary, fontSize: Math.min(sizes.tableText, 9), textTransform: 'uppercase' },
        tableRow: { flexDirection: 'row', paddingVertical: 7, borderBottom: `0.5pt solid ${colors.tableHeader}` },
        tdText: { fontSize: Math.min(sizes.tableText, 9), color: colors.tableText },
        tdTextBold: { fontSize: Math.min(sizes.tableText, 9), color: colors.tableText, fontWeight: 'bold' },
        summaryContainer: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginBottom: 14 },
        summaryBox: { alignSelf: 'flex-end', width: 240, backgroundColor: colors.tableHeader, padding: 14, borderRadius: 6 },
        summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
        grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, marginTop: 4, borderTop: `0.5pt solid ${colors.secondary}` },
        grandTotalText: { fontSize: Math.min(sizes.totalAmount, 14), color: colors.totalAmount, fontWeight: 'bold' },
        footerText: { fontSize: Math.min(sizes.footerText, 8), color: colors.footer, textAlign: 'center' },
    });

    return (
        <Page size="A4" style={styles.page} wrap>
            <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} />

            <View style={styles.topBanner}>
                <View style={styles.companyCol}>
                    <CompanyInfo company={company} vis={vis} styles={styles} />
                </View>
                <View style={styles.invoiceMetaCol}>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <InvoiceMeta data={data} vis={vis} styles={styles} />
                </View>
            </View>

            <View style={styles.contentWrapper}>
                <View style={styles.infoRow}>
                    <View style={styles.billToCol}>
                        <Text style={styles.sectionTitle}>Billed To</Text>
                        <ClientInfo client={selectedClient} vis={vis} styles={{...styles, textNormal: { ...styles.textNormal, color: colors.primary }}} />
                    </View>
                    <View style={styles.paymentCol}>
                        <Text style={styles.sectionTitle}>Payment Details</Text>
                        <InvoicePayment company={company} vis={vis} styles={{...styles, textNormal: { ...styles.textNormal, color: colors.primary }}} />
                    </View>
                </View>

                <InvoiceTable data={data} vis={vis} styles={styles} />
                <InvoiceTotals totals={totals} vis={vis} styles={styles} />

                <InvoiceTermsAndNotes data={data} vis={vis} styles={{...styles, textNormal: { ...styles.textNormal, color: colors.primary }}} />
                <InvoiceSignatures company={company} vis={vis} styles={styles} />

                <View style={{ position: 'absolute', bottom: 25, left: 36, right: 36, paddingTop: 10 }} >
                    <InvoiceFooter company={company} vis={vis} styles={styles} />
                </View>
            </View>
        </Page>
    );
}
