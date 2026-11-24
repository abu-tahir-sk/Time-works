import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  FileSignature,
  Handshake,
  Users,
  CreditCard,
  BarChart3,
  Receipt,
  ShieldCheck,
  Building2,
  Wallet,
} from "lucide-react"

export const SIDEBAR_SECTIONS = [
  {
    group: "Overview",
    items: [
      {
        title: "Executive Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Document Hub",
        href: "/dashboard/documents",
        icon: FileText,
      },
    ],
  },
  {
    group: "Sales & Billing",
    items: [
      {
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: FileSpreadsheet,
      },
      {
        title: "Quotations",
        href: "/dashboard/quotations",
        icon: FileSignature,
      },
      {
        title: "Agreements",
        href: "/dashboard/agreements",
        icon: Handshake,
      },
      {
        title: "Clients",
        href: "/dashboard/clients",
        icon: Users,
      },
      {
        title: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    group: "Company Accounts (হিসাব)",
    items: [
      {
        title: "Expenses & Ledger",
        href: "/dashboard/expenses",
        icon: Receipt,
        badge: "Hisab",
      },
      {
        title: "Analytics & P&L",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    group: "Platform Administration",
    items: [
      {
        title: "Admin Center",
        href: "/dashboard/admin",
        icon: ShieldCheck,
        badge: "Admin",
      },
    ],
  },
]

export const SIDEBAR_ITEMS = SIDEBAR_SECTIONS.flatMap((section) => section.items)

