"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBrand } from "@/providers/BrandProvider";
import { motion } from "motion/react";
import Image from "next/image";
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
  const brand = useBrand();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card/80 backdrop-blur-md shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b px-5 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src={brand.logoUrl}
            alt={brand.brandName}
            width={128}
            height={38}
            priority
            className="h-5 w-auto max-w-[130px] object-contain dark:invert"
          />
          <span className="text-[10px] font-normal text-muted-foreground border px-1.5 py-0.5 rounded shrink-0">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {ADMIN_NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(userRole)
          );

          if (visibleItems.length === 0) return null;

          return (
            <motion.div
              key={group.groupLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <h4 className="px-3 text-[11px] font-normal text-muted-foreground tracking-wide">
                {group.groupLabel}
              </h4>
              <nav className="space-y-0.5 pt-0.5">
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
                        "relative flex items-center justify-between px-3 py-2 rounded-md text-xs font-normal transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {/* Fluid Active Sliding Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActivePill"
                          className="absolute inset-0 bg-muted rounded-md -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}

                      <div className="flex items-center gap-2.5 z-10">
                        <item.icon className="size-4 shrink-0 text-muted-foreground" />
                        <span>{item.title}</span>
                      </div>

                      {badgeCount !== undefined && badgeCount > 0 && (
                        <Badge
                          variant="outline"
                          className="h-4.5 px-1.5 text-[10px] font-normal rounded border-muted-foreground/30 z-10"
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          );
        })}
      </div>

      {/* Footer / Quick Info */}
      <div className="p-3 border-t">
        <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground font-normal">
          <span>Role</span>
          <span className="font-mono text-[11px]">{userRole}</span>
        </div>
      </div>
    </aside>
  );
}
