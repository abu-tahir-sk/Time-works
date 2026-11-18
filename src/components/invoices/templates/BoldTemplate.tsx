import React from 'react';
import { Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import { WatermarkLayer } from './WatermarkLayer';
import { CompanyInfo, ClientInfo, InvoiceMeta, InvoicePayment, InvoiceTermsAndNotes, InvoiceSignatures, InvoiceFooter, InvoiceTable, InvoiceTotals } from './shared-sections';
import { getFontFamily } from './font-utils';

export function BoldTemplate({ data, company, clients, totals, ds }: any) {
    const selectedClient = clients?.find((c: any) => c.id === data.clientId) || null;
    const colors = {
        primary: ds.colors.primary || '#3b82f6',
        secondary: ds.colors.secondary || '#64748b',
        background: '#1e293b',
        cardBg: '#0f172a',
        text: '#f8fafc',
        textMuted: '#cbd5e1',
        border: '#334155',
        tableHeader: '#334155',
    };
    const sizes = ds.typography.sizes;
    const vis = ds.visibility;

    const styles = StyleSheet.create({
        page: { padding: 36, fontFamily: getFontFamily(ds.typography.fontFamily), backgroundColor: colors.background, color: colors.text, paddingBottom: 55 },
        header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
        headerLeft: { flex: 1, paddingRight: 16 },
        headerRight: { flex: 1, alignItems: 'flex-end' },

        logo: { width: Math.min(ds.layout.logoSize || 70, 70), height: 'auto', objectFit: 'contain', marginBottom: 10 },
        companyName: { fontSize: Math.min(sizes.sectionHeading + 2, 14), color: colors.text, fontWeight: 'bold', marginBottom: 4 },
        textNormal: { fontSize: Math.min(sizes.bodyText, 9), color: colors.textMuted, marginBottom: 2, lineHeight: 1.4 },
        textBold: { fontSize: Math.min(sizes.bodyText, 9), color: colors.text, fontWeight: 'bold', marginBottom: 2 },

        invoiceTitle: { fontSize: Math.min(sizes.invoiceTitle + 6, 30), fontWeight: 'bold', color: colors.primary, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 },
        sectionTitle: { fontSize: Math.min(sizes.sectionHeading, 10), color: colors.primary, marginBottom: 5, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1 },

        metaGrid: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4, width: '100%' },
        metaLabel: { width: 80, color: colors.textMuted, fontSize: Math.min(sizes.bodyText, 9), paddingRight: 8, textAlign: 'right' },
        metaValue: { width: 100, fontWeight: 'bold', color: colors.text, fontSize: Math.min(sizes.bodyText, 9), textAlign: 'right' },

        infoCard: { backgroundColor: colors.cardBg, padding: 16, borderRadius: 6, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', border: `0.5pt solid ${colors.border}` },
        infoCol: { flex: 1 },

        table: { width: '100%', marginBottom: 16 },
        tableHeader: { flexDirection: 'row', paddingVertical: 8, borderBottom: `1.5pt solid ${colors.primary}`, backgroundColor: colors.cardBg, paddingHorizontal: 8, borderRadius: 3 },
        thText: { color: colors.primary, fontSize: Math.min(sizes.tableText, 9), textTransform: 'uppercase', fontWeight: 'bold' },
        tableRow: { flexDirection: 'row', paddingVertical: 7, borderBottom: `0.5pt solid ${colors.border}`, paddingHorizontal: 8 },
        tdText: { fontSize: Math.min(sizes.tableText, 9), color: colors.text },
        tdTextBold: { fontSize: Math.min(sizes.tableText, 9), color: colors.text, fontWeight: 'bold' },

        summaryContainer: { flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginBottom: 14 },
        summaryBox: { alignSelf: 'flex-end', width: '45%', backgroundColor: colors.cardBg, padding: 14, borderRadius: 6, border: `0.5pt solid ${colors.border}` },
        summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
        grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, marginTop: 5, borderTop: `0.5pt solid ${colors.border}` },
        grandTotalText: { fontSize: Math.min(sizes.totalAmount, 14), color: colors.primary, fontWeight: 'bold' },

        footerText: { fontSize: Math.min(sizes.footerText, 8), color: colors.textMuted, textAlign: 'center' },
    });

    return (
        <Page size="A4" style={styles.page} wrap>
            <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} companyName={company?.name} />

            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <CompanyInfo company={company} vis={vis} styles={{...styles, textNormal: { ...styles.textNormal, color: colors.textMuted }}} />
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <InvoiceMeta data={data} vis={vis} styles={{...styles, metaValue: { ...styles.metaValue, color: colors.text }}} />
                </View>
            </View>

            <View style={styles.infoCard}>
                <View style={[styles.infoCol, { paddingRight: 16 }]}>
                    <Text style={styles.sectionTitle}>Billed To</Text>
                    <ClientInfo client={selectedClient} vis={vis} styles={{...styles, textBold: { ...styles.textBold, color: colors.text }}} />
                </View>
                <View style={[styles.infoCol, { paddingLeft: 16, borderLeft: `0.5pt solid ${colors.border}` }]}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <InvoicePayment company={company} vis={vis} styles={{...styles, textBold: { ...styles.textBold, color: colors.text }}} />
                </View>
            </View>

            <InvoiceTable data={data} vis={vis} styles={styles} />
            <InvoiceTotals totals={totals} vis={vis} styles={{...styles, textBold: { ...styles.textBold, color: colors.text }}} />

            <InvoiceTermsAndNotes data={data} vis={vis} styles={styles} />
            <InvoiceSignatures company={company} vis={vis} styles={{...styles, textBold: { ...styles.textBold, color: colors.text }}} />

            <View style={{ position: 'absolute', bottom: 25, left: 36, right: 36, paddingTop: 10, borderTop: `0.5pt solid ${colors.border}` }} >
                <InvoiceFooter company={company} vis={vis} styles={{...styles, footerText: { ...styles.footerText, color: colors.textMuted }}} />
            </View>
        </Page>
    );
}
