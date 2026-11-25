import React from "react"
import { Document } from "@react-pdf/renderer"
import { INVOICE_TEMPLATES } from "./templates/registry"
import { defaultDesignSettings } from "@/lib/design-system/schema"
import { calculateInvoiceTotals } from "@/lib/invoices/calculations"

export function InvoicePdf({ data, company, clients }: any) {
  // Resolve Template
  const templateId = data?.template || "professional"
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

  const companyDetails = data?.companyDetails || {}
  const rawCompanyName = companyDetails.name || company?.name || ""
  const resolvedCompanyName =
    (!rawCompanyName || rawCompanyName.toLowerCase().includes("tigitail") || rawCompanyName.toLowerCase().includes("times digital") || rawCompanyName.includes("'s Company"))
      ? "Times Works"
      : rawCompanyName

  const rawEmail = companyDetails.email || company?.email || ""
  const resolvedEmail = (!rawEmail || rawEmail.includes("timesdigitals.com")) ? "billing@timesworks.com" : rawEmail

  const mergedCompany = {
    ...company,
    ...companyDetails,
    name: resolvedCompanyName,
    address:
      companyDetails.address ||
      company?.address ||
      "Times Works Tower, Suite 400, Redmond, WA 98052, USA",
    email: resolvedEmail,
    phone:
      companyDetails.phone ||
      company?.phone ||
      "+1 (800) 555-0199",
    logoUrl:
      companyDetails.logoUrl ||
      company?.logoUrl ||
      "/logo-v3.jpg",
  }

  return (
    <Document>
      <TemplateComponent
        data={data}
        company={mergedCompany}
        clients={clients}
        totals={totals}
        ds={ds}
      />
    </Document>
  )
}
