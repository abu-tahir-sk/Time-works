import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { WatermarkLayer } from './WatermarkLayer';
import { CompanyInfo, ClientInfo, InvoiceMeta, InvoicePayment, InvoiceTermsAndNotes, InvoiceSignatures, InvoiceFooter, InvoiceTable, InvoiceTotals } from './shared-sections';
import { getFontFamily } from './font-utils';

export function MinimalPremiumTemplate({ data, company, clients, totals, ds }: any) {
    const selectedClient = clients?.find((c: any) => c.id === data.clientId) || null;
    const colors = ds.colors;
    const sizes = ds.typography.sizes;
    const vis = ds.visibility;

    const styles = StyleSheet.create({
        page: {
            padding: 40,
            fontFamily: getFontFamily(ds.typography.fontFamily),
            backgroundColor: '#ffffff',
            color: '#111827',
            paddingBottom: 55,
        },
        logo: { width: Math.min(ds.layout.logoSize || 60, 60), height: 'auto', objectFit: 'contain', marginBottom: 6 },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
        },
        companyContainer: { flex: 1 },
        companyName: {
            fontSize: Math.min(sizes.invoiceTitle - 8, 16),
            fontWeight: 'bold',
            letterSpacing: -0.5,
            marginBottom: 3,
        },
        textNormal: {
            fontSize: Math.min(sizes.bodyText, 9),
            color: '#4b5563',
            marginBottom: 2,
            lineHeight: 1.4,
        },
        textBold: {
            fontSize: Math.min(sizes.bodyText, 9),
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: 2,
        },
        invoiceTag: {
            fontSize: Math.min(sizes.invoiceTitle - 10, 12),
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginTop: 6,
        },
        metaGridContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
        },
        metaCol: { flex: 1 },
        sectionTitle: {
            fontSize: Math.min(sizes.sectionHeading, 10),
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 5,
        },
        metaGrid: { flexDirection: 'row', marginBottom: 3 },
        metaLabel: { width: 80, color: '#6b7280', fontSize: Math.min(sizes.bodyText, 9) },
        metaValue: { flex: 1, color: '#111827', fontSize: Math.min(sizes.bodyText, 9), fontWeight: 'bold' },
        table: { width: '100%', marginBottom: 16 },
        tableHeader: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            paddingBottom: 6,
            marginBottom: 4,
        },
        thText: {
            fontSize: Math.min(sizes.tableText - 1, 8),
            color: '#6b7280',
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        tableRow: {
            flexDirection: 'row',
            paddingVertical: 7,
            borderBottomWidth: 0.5,
            borderBottomColor: '#f3f4f6',
        },
        tdTextBold: { fontSize: Math.min(sizes.tableText, 9), fontWeight: 'bold', color: '#111827' },
        tdText: { fontSize: Math.min(sizes.tableText, 9), color: '#4b5563' },
        summaryContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
            marginBottom: 14,
        },
        summaryBox: { width: '45%' },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 4,
        },
        grandTotalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            marginTop: 5,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
        },
        grandTotalText: {
            fontSize: Math.min(sizes.totalAmount, 14),
            fontWeight: 'bold',
            color: '#0f172a',
        },
        footerText: {
            fontSize: Math.min(sizes.footerText, 8),
            color: '#9ca3af',
            textAlign: 'center',
        },
    });

    return (
        <Page size="A4" style={styles.page} wrap>
            <WatermarkLayer ds={ds} companyLogo={company?.logoUrl} companyName={company?.name} />

            <View style={styles.header}>
                <View style={styles.companyContainer}>
                    <CompanyInfo company={company} vis={vis} styles={styles} />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.invoiceTag}>INVOICE {data.invoiceNumber || 'DRAFT'}</Text>
                </View>
            </View>

            <View style={styles.metaGridContainer}>
                <View style={styles.metaCol}>
                    <Text style={styles.sectionTitle}>Billed To</Text>
                    <ClientInfo client={selectedClient} vis={vis} styles={styles} />
                </View>
                <View style={styles.metaCol}>
                    <Text style={styles.sectionTitle}>Details</Text>
                    <InvoiceMeta data={data} vis={vis} styles={styles} />
                </View>
            </View>

            <InvoiceTable data={data} vis={vis} styles={styles} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <View style={{ flex: 1, paddingRight: 30 }}>
                    <Text style={styles.sectionTitle}>Payment Info</Text>
                    <InvoicePayment company={company} vis={vis} styles={styles} />
                </View>
                <View style={{ flex: 1 }}>
                    <InvoiceTotals totals={totals} vis={vis} styles={styles} />
                </View>
            </View>

            <InvoiceTermsAndNotes data={data} vis={vis} styles={styles} />
            <InvoiceSignatures company={company} vis={vis} styles={styles} />

            <View style={{ position: 'absolute', bottom: 25, left: 40, right: 40, paddingTop: 10 }} >
                <InvoiceFooter company={company} vis={vis} styles={styles} />
            </View>
        </Page>
    );
}
