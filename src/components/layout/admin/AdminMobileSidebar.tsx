"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Footprints, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ADMIN_NAV_GROUPS } from "./adminNavItems";

interface AdminMobileSidebarProps {
  userRole?: string;
  badgeCounts?: {
    pendingOrders?: number;
    pendingExchanges?: number;
    lowStock?: number;
  };
}

export default function AdminMobileSidebar({
  userRole = "SUPER_ADMIN",
  badgeCounts,
}: AdminMobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "lg:hidden shrink-0 size-9 cursor-pointer"
        )}
        aria-label="Open Navigation Menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="h-16 px-5 border-b flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center gap-2.5 text-left">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Footprints className="size-4.5" />
            </div>
            <div>
              <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                EcomBD Admin
              </div>
              <span className="text-[10px] text-muted-foreground font-normal">
                Footwear Operations
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {ADMIN_NAV_GROUPS.map((group) => {
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
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
      </SheetContent>
    </Sheet>
  );
}
