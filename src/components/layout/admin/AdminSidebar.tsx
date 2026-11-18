"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Footprints, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ADMIN_NAV_GROUPS } from "./adminNavItems";

interface AdminSidebarProps {
  userRole?: string;
  badgeCounts?: {
    pendingOrders?: number;
    pendingExchanges?: number;
    lowStock?: number;
  };
}

export default function AdminSidebar({
  userRole = "SUPER_ADMIN",
  badgeCounts,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card/60 backdrop-blur-md shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b px-5">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
            <Footprints className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-foreground text-base flex items-center gap-1.5">
              EcomBD
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                Admin
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Footwear Operations
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {ADMIN_NAV_GROUPS.map((group) => {
          // Filter items based on staff user role
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(userRole)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.groupLabel} className="space-y-1">
              <h4 className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {group.groupLabel}
              </h4>
              <nav className="space-y-0.5 pt-1">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(item.href));

                  const badgeCount =
                    item.badgeKey && badgeCounts?.[item.badgeKey];

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "size-4 shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          )}
                        />
                        <span>{item.title}</span>
                      </div>

                      {badgeCount !== undefined && badgeCount > 0 && (
                        <Badge
                          variant={isActive ? "secondary" : "destructive"}
                          className="h-5 px-1.5 text-[10px] font-bold rounded-full min-w-5 justify-center"
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Footer / Quick Info */}
      <div className="p-3 border-t bg-muted/20">
        <div className="rounded-lg p-2.5 bg-background/80 border text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-500" />
              Role:
            </span>
            <span className="font-semibold text-primary text-[11px]">
              {userRole}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            D2C Footwear Engine v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
