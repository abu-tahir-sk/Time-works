import React from "react"
import { Document } from "@react-pdf/renderer"
import { INVOICE_TEMPLATES } from "./templates/registry"
import { defaultDesignSettings } from "@/lib/design-system/schema"
import { calculateInvoiceTotals } from "@/lib/invoices/calculations"

export function InvoicePdf({ data, company, clients }: any) {
  // Resolve Template
  const templateId = data?.template || "classic"
  const selectedTemplate =
    INVOICE_TEMPLATES.find((t) => t.id === templateId) || INVOICE_TEMPLATES[0]
  const TemplateComponent = selectedTemplate.component

  // Global calculations
  const items = data?.items || []
  const discountValue = parseFloat(data?.discountValue) || 0
  const totals = calculateInvoiceTotals(
    items.map((i: any) => ({
      quantity: parseFloat(i.quantity) || 0,
      unitPrice: parseFloat(i.unitPrice) || 0,
      discountValue: parseFloat(i.discountValue) || 0,
      discountType: i.discountType,
      taxRate: parseFloat(i.taxRate) || 0,
    })),
    discountValue,
    data?.discountType
  )

  // Ensure deep merge of design settings to guarantee all defaults are present
  const baseSettings = data?.designSettings || {}
  const ds = {
    ...defaultDesignSettings,
    ...baseSettings,
    watermark: {
      ...defaultDesignSettings.watermark,
      ...(baseSettings.watermark || {}),
      text: {
        ...defaultDesignSettings.watermark.text,
        ...(baseSettings.watermark?.text || {}),
      },
      logo: {
        ...defaultDesignSettings.watermark.logo,
        ...(baseSettings.watermark?.logo || {}),
      },
    },
    colors: {
      ...defaultDesignSettings.colors,
      ...(baseSettings.colors || {}),
    },
    typography: {
      ...defaultDesignSettings.typography,
      ...(baseSettings.typography || {}),
      sizes: {
        ...defaultDesignSettings.typography.sizes,
        ...(baseSettings.typography?.sizes || {}),
      },
    },
    layout: {
      ...defaultDesignSettings.layout,
      ...(baseSettings.layout || {}),
      spacing: {
        ...defaultDesignSettings.layout.spacing,
        ...(baseSettings.layout?.spacing || {}),
      },
    },
    visibility: {
      ...defaultDesignSettings.visibility,
      ...(baseSettings.visibility || {}),
    },
  }

  return (
    <Document>
      <TemplateComponent
        data={data}
        company={{ ...company, ...(data?.companyDetails || {}) }}
        clients={clients}
        totals={totals}
        ds={ds}
      />
    </Document>
  )
}
