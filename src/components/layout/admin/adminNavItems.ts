import {
  ArrowLeftRight,
  BarChart3,
  Boxes,
  CreditCard,
  Droplets,
  Layers,
  LayoutDashboard,
  LucideIcon,
  Settings,
  ShoppingBag,
  Sparkles,
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
    groupLabel: "Operations & Sales",
    items: [
      {
        title: "Executive Overview",
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
        title: "Damages & Returns QC",
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
    groupLabel: "Fragrance & Inventory",
    items: [
      {
        title: "Fragrance Catalog",
        href: "/admin/products",
        icon: Sparkles,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "INVENTORY_STAFF"],
      },
      {
        title: "Inventory & Batch Stock",
        href: "/admin/inventory",
        icon: Boxes,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "INVENTORY_STAFF"],
        badgeKey: "lowStock",
      },
      {
        title: "Fragrance Collections",
        href: "/admin/categories",
        icon: Layers,
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
      },
      {
        title: "Concentration & Volume",
        href: "/admin/size-charts",
        icon: Droplets,
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
        title: "Staff & Customer CRM",
        href: "/admin/users",
        icon: Users,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Olfactory Analytics",
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
