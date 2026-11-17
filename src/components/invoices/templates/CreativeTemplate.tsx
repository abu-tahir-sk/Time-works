import React from 'react';
import { Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import { WatermarkLayer } from './WatermarkLayer';
import { CompanyInfo, ClientInfo, InvoiceMeta, InvoicePayment, InvoiceTermsAndNotes, InvoiceSignatures, InvoiceFooter, InvoiceTable, InvoiceTotals } from './shared-sections';
import { getFontFamily } from './font-utils';

export function CreativeTemplate({ data, company, clients, totals, ds }: any) {
    const selectedClient = clients?.find((c: any) => c.id === data.clientId) || null;
    const colors = {
        primary: '#f97316',
        secondary: '#a855f7',
        background: '#0f172a',
        text: '#f1f5f9',
        textMuted: '#94a3b8',
        border: '#1e293b',
        tableHeader: '#1e293b',
    };
    const sizes = ds.typography.sizes;
    const vis = ds.visibility;

    const styles = StyleSheet.create({
        page: { padding: 36, fontFamily: getFontFamily(ds.typography.fontFamily), backgroundColor: colors.background, paddingBottom: 55 },
        logo: { width: Math.min(ds.layout.logoSize || 70, 70), height: 'auto', objectFit: 'contain', marginBottom: 10 },
        header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
        companyCol: { flex: 1, paddingRight: 16 },
        invoiceMetaCol: { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start' },
        companyName: { fontSize: Math.min(sizes.sectionHeading + 2, 14), color: colors.primary, fontWeight: 'bold', marginBottom: 4 },
        textNormal: { fontSize: Math.min(sizes.bodyText, 9), color: colors.textMuted, marginBottom: 2, lineHeight: 1.4 },
        invoiceTitle: { fontSize: Math.min(sizes.invoiceTitle + 4, 28), fontWeight: 'bold', color: colors.secondary, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 2 },
        metaGrid: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4, width: '100%' },
        metaLabel: { width: 80, color: colors.textMuted, fontSize: Math.min(sizes.bodyText, 9), textAlign: 'right', paddingRight: 10 },
        metaValue: { width: 100, fontWeight: 'bold', color: colors.text, textAlign: 'right', fontSize: Math.min(sizes.bodyText, 9) },

        infoBox: { backgroundColor: colors.border, padding: 14, borderRadius: 8, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' },
        billToCol: { flex: 1, paddingRight: 10 },
        paymentCol: { flex: 1, paddingLeft: 10, borderLeft: `0.5pt solid ${colors.textMuted}` },
        sectionTitle: { fontSize: Math.min(sizes.sectionHeading, 10), color: colors.primary, marginBottom: 5, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1 },
        textBold: { fontSize: Math.min(sizes.bodyText, 9), color: colors.text, fontWeight: 'bold', marginBottom: 2 },

        table: { width: '100%', marginBottom: 16 },
        tableHeader: { flexDirection: 'row', paddingVertical: 8, borderBottom: `1.5pt solid ${colors.secondary}` },
        thText: { color: colors.secondary, fontSize: Math.min(sizes.tableText, 9), textTransform: 'uppercase', fontWeight: 'bold' },
        tableRow: { flexDirection: 'row', paddingVertical: 7, borderBottom: `0.5pt solid ${colors.border}` },
        tdText: { fontSize: Math.min(sizes.tableText, 9), color: colors.text },
        tdTextBold: { fontSize: Math.min(sizes.tableText, 9), color: colors.text, fontWeight: 'bold' },

        summaryContainer: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginBottom: 14 },
        summaryBox: { alignSelf: 'flex-end', width: 260, backgroundColor: colors.border, padding: 14, borderRadius: 8 },
        summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
        grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 5, borderTop: `1.5pt solid ${colors.primary}` },
        grandTotalText: { fontSize: Math.min(sizes.totalAmount, 14), color: colors.primary, fontWeight: 'bold' },

        footerText: { fontSize: Math.min(sizes.footerText, 8), color: colors.textMuted, textAlign: 'center' },
    });

    return (
        <Page size="A4" style={styles.page} wrap>
            <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} />

            <View style={styles.header}>
                <View style={styles.companyCol}>
                    <CompanyInfo company={company} vis={vis} styles={{...styles, textNormal: { ...styles.textNormal, color: colors.textMuted }}} />
                </View>
                <View style={styles.invoiceMetaCol}>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <InvoiceMeta data={data} vis={vis} styles={{...styles, metaValue: { ...styles.metaValue, color: colors.text }}} />
                </View>
            </View>

            <View style={styles.infoBox}>
                <View style={styles.billToCol}>
                    <Text style={styles.sectionTitle}>Billed To</Text>
                    <ClientInfo client={selectedClient} vis={vis} styles={{...styles, textBold: { ...styles.textBold, color: colors.text }}} />
                </View>
                <View style={styles.paymentCol}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <InvoicePayment company={company} vis={vis} styles={{...styles, textBold: { ...styles.textBold, color: colors.text }}} />
                </View>
            </View>

            <InvoiceTable data={data} vis={vis} styles={styles} />
            <InvoiceTotals totals={totals} vis={vis} styles={{...styles, textBold: { ...styles.textBold, color: colors.text }}} />

            <InvoiceTermsAndNotes data={data} vis={vis} styles={styles} />
            <InvoiceSignatures company={company} vis={vis} styles={{...styles, textBold: { ...styles.textBold, color: colors.text }}} />

            <View style={{ position: 'absolute', bottom: 25, left: 36, right: 36, paddingTop: 10, borderTop: `0.5pt solid ${colors.border}` }} >
                <InvoiceFooter company={company} vis={vis} styles={styles} />
            </View>
        </Page>
    );
}
