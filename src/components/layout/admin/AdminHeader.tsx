"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/auth.types";
import { ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import AdminBreadcrumbs from "./AdminBreadcrumbs";
import AdminMobileSidebar from "./AdminMobileSidebar";
import AdminNotificationBell from "./AdminNotificationBell";
import AdminUserMenu from "./AdminUserMenu";

interface AdminHeaderProps {
  user?: IUser | null;
  alerts?: {
    lowStockVariantsCount?: number;
    pendingExchangesCount?: number;
    unresolvedIncompleteOrdersCount?: number;
    unreconciledShipmentsCount?: number;
  };
}

export default function AdminHeader({ user, alerts }: AdminHeaderProps) {
  const userRole = user?.role || "SUPER_ADMIN";

  return (
    <header className="h-16 border-b bg-card/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Sidebar Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <AdminMobileSidebar
          userRole={userRole}
          badgeCounts={{
            lowStock: alerts?.lowStockVariantsCount,
            pendingExchanges: alerts?.pendingExchangesCount,
          }}
        />
        <AdminBreadcrumbs />
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search Trigger Button (Desktop) */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-2 h-9 px-3 text-xs text-muted-foreground hover:text-foreground rounded-lg"
          onClick={() => {
            const input = document.getElementById("admin-global-search");
            if (input) input.focus();
          }}
        >
          <Search className="size-3.5 text-muted-foreground" />
          <span>Search orders, fragrances, SKUs...</span>
          <kbd className="pointer-events-none inline-flex h-4.5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
            ⌘K
          </kbd>
        </Button>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "hidden sm:inline-flex items-center gap-1.5 h-9 text-xs text-muted-foreground hover:text-foreground rounded-lg"
          )}
        >
          <ExternalLink className="size-3.5" />
          <span>Storefront</span>
        </Link>

        {/* Live Operational Alerts Bell */}
        <AdminNotificationBell alerts={alerts} />

        {/* Staff User Avatar & Dropdown Menu */}
        <AdminUserMenu user={user} />
      </div>
    </header>
  );
}
