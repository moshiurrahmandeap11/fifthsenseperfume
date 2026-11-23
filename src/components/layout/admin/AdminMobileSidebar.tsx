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
import { useBrand } from "@/providers/BrandProvider";
import { Menu } from "lucide-react";
import Image from "next/image";
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
  const brand = useBrand();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "lg:hidden shrink-0 size-8 cursor-pointer"
        )}
        aria-label="Open Navigation Menu"
      >
        <Menu className="size-4" />
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0 flex flex-col">
        <SheetHeader className="h-14 px-5 border-b flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center gap-2 text-left">
            <span className="font-normal text-foreground text-sm uppercase tracking-wide">
              FIFTH SENSE
            </span>
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
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md text-xs font-normal transition-colors",
                          isActive
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className="size-4 shrink-0 text-muted-foreground" />
                          <span>{item.title}</span>
                        </div>

                        {badgeCount !== undefined && badgeCount > 0 && (
                          <Badge
                            variant="outline"
                            className="h-4.5 px-1.5 text-[10px] font-normal rounded border-muted-foreground/30"
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
