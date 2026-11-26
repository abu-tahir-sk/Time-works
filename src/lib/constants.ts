import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CreditCard,
  BarChart3,
  Receipt,
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
    ],
  },
  {
    group: "Projects & Clients",
    items: [
      {
        title: "Projects",
        href: "/dashboard/projects",
        icon: FolderKanban,
      },
      {
        title: "Clients",
        href: "/dashboard/clients",
        icon: Users,
      },
    ],
  },
  {
    group: "Finance & Accounts",
    items: [
      {
        title: "Payments & Links",
        href: "/dashboard/payments",
        icon: CreditCard,
      },
      {
        title: "Office Expenses",
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

export const SIDEBAR_ITEMS: SidebarItem[] = SIDEBAR_SECTIONS.flatMap((s) => s.items)

