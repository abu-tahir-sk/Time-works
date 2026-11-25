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
  Settings,
} from "lucide-react"

export interface SidebarItem {
  title: string
  href: string
  icon: any
  badge?: string
}

export interface SidebarSection {
  group: string
  items: SidebarItem[]
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
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
    group: "Finance & Accounts",
    items: [
      {
        title: "Company Ledger",
        href: "/dashboard/expenses",
        icon: Receipt,
      },
      {
        title: "Financial Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    group: "Administration",
    items: [
      {
        title: "Workspace Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
]

export const SIDEBAR_ITEMS = SIDEBAR_SECTIONS.flatMap((section) => section.items)

