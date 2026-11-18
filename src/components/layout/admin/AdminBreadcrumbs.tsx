"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ROUTE_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Overview",
  orders: "Orders",
  products: "Catalog",
  inventory: "Inventory",
  exchanges: "Size Exchanges",
  categories: "Categories",
  "size-charts": "Size Charts",
  courier: "Courier",
  coupons: "Coupons & Offers",
  payments: "Payments",
  users: "Staff & CRM",
  analytics: "Analytics",
  system: "Settings",
};

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Home className="size-3.5 text-primary" />
        <span>Admin</span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-semibold">Overview</span>
      </div>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <Home className="size-3.5" />
        <span>Admin</span>
      </Link>

      {segments.slice(1).map((segment, index) => {
        const isLast = index === segments.length - 2;
        const href = `/${segments.slice(0, index + 2).join("/")}`;
        const label =
          ROUTE_LABELS[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <React.Fragment key={href}>
            <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-40">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium truncate max-w-32"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
