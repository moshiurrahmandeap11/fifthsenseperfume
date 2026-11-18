import {
  ArrowLeftRight,
  BarChart3,
  Boxes,
  CreditCard,
  Footprints,
  Layers,
  LayoutDashboard,
  LucideIcon,
  Ruler,
  Settings,
  ShoppingBag,
  Tag,
  Truck,
  Users,
} from "lucide-react";

export interface IAdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
  badgeKey?: "pendingOrders" | "pendingExchanges" | "lowStock";
}

export interface IAdminNavGroup {
  groupLabel: string;
  items: IAdminNavItem[];
}

export const ADMIN_NAV_GROUPS: IAdminNavGroup[] = [
  {
    groupLabel: "Operations & Dashboard",
    items: [
      {
        title: "Overview",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
      },
      {
        title: "Orders & Call Center",
        href: "/admin/orders",
        icon: ShoppingBag,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "MODERATOR"],
        badgeKey: "pendingOrders",
      },
      {
        title: "Size Exchange & QC",
        href: "/admin/exchanges",
        icon: ArrowLeftRight,
        roles: [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "MODERATOR",
          "INVENTORY_STAFF",
        ],
        badgeKey: "pendingExchanges",
      },
    ],
  },
  {
    groupLabel: "Catalog & Inventory",
    items: [
      {
        title: "Shoe Catalog",
        href: "/admin/products",
        icon: Footprints,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "INVENTORY_STAFF"],
      },
      {
        title: "Inventory & Barcode",
        href: "/admin/inventory",
        icon: Boxes,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "INVENTORY_STAFF"],
        badgeKey: "lowStock",
      },
      {
        title: "Categories & Styles",
        href: "/admin/categories",
        icon: Layers,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
      },
      {
        title: "Dynamic Size Charts",
        href: "/admin/size-charts",
        icon: Ruler,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
      },
    ],
  },
  {
    groupLabel: "Logistics & Marketing",
    items: [
      {
        title: "Courier & Fraud Check",
        href: "/admin/courier",
        icon: Truck,
        roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
      },
      {
        title: "Marketing & Coupons",
        href: "/admin/coupons",
        icon: Tag,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
      },
      {
        title: "Accounts & Payments",
        href: "/admin/payments",
        icon: CreditCard,
        roles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"],
      },
    ],
  },
  {
    groupLabel: "System & Administration",
    items: [
      {
        title: "Staff & CRM",
        href: "/admin/users",
        icon: Users,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Analytics & Reports",
        href: "/admin/analytics",
        icon: BarChart3,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "ACCOUNTANT"],
      },
      {
        title: "Settings & CMS",
        href: "/admin/system",
        icon: Settings,
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];
