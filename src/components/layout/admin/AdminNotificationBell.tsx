"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeftRight, Bell, Boxes, PhoneCall } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AdminNotificationBellProps {
  alerts?: {
    lowStockVariantsCount?: number;
    pendingExchangesCount?: number;
    unresolvedIncompleteOrdersCount?: number;
    unreconciledShipmentsCount?: number;
  };
}

export default function AdminNotificationBell({
  alerts,
}: AdminNotificationBellProps) {
  const lowStock = alerts?.lowStockVariantsCount || 0;
  const pendingExchanges = alerts?.pendingExchangesCount || 0;
  const incompleteOrders = alerts?.unresolvedIncompleteOrdersCount || 0;
  const unreconciled = alerts?.unreconciledShipmentsCount || 0;

  const totalAlerts = lowStock + pendingExchanges + incompleteOrders + unreconciled;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "relative size-9 rounded-lg cursor-pointer"
        )}
        aria-label="Operational Notifications"
      >
        <Bell className="size-4.5 text-muted-foreground" />
        {totalAlerts > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-normal text-background">
            {totalAlerts > 9 ? "9+" : totalAlerts}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2 shadow-lg">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5 font-normal">
            <span className="text-xs font-normal text-foreground">
              Operational Alerts
            </span>
            <Badge
              variant={totalAlerts > 0 ? "destructive" : "secondary"}
              className="text-[10px] h-4.5"
            >
              {totalAlerts} Action {totalAlerts === 1 ? "Item" : "Items"}
            </Badge>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="space-y-1 py-1">
          {totalAlerts === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              All systems normal. No pending alerts.
            </div>
          ) : (
            <>
              {lowStock > 0 && (
                <DropdownMenuItem className="p-0 cursor-pointer rounded-md">
                  <Link
                    href="/admin/inventory"
                    className="flex items-start gap-2.5 p-2 w-full"
                  >
                    <div className="size-7 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Boxes className="size-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-foreground">
                        {lowStock} Low Stock {lowStock === 1 ? "Variant" : "Variants"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Broken-size risk. Immediate restocking required.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}

              {pendingExchanges > 0 && (
                <DropdownMenuItem className="p-0 cursor-pointer rounded-md">
                  <Link
                    href="/admin/exchanges"
                    className="flex items-start gap-2.5 p-2 w-full"
                  >
                    <div className="size-7 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowLeftRight className="size-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-foreground">
                        {pendingExchanges} Pending Size {pendingExchanges === 1 ? "Exchange" : "Exchanges"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Doorstep replacement requests awaiting QC approval.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}

              {incompleteOrders > 0 && (
                <DropdownMenuItem className="p-0 cursor-pointer rounded-md">
                  <Link
                    href="/admin/orders?type=incomplete"
                    className="flex items-start gap-2.5 p-2 w-full"
                  >
                    <div className="size-7 rounded bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <PhoneCall className="size-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-foreground">
                        {incompleteOrders} Abandoned {incompleteOrders === 1 ? "Cart" : "Carts"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Assign to call center team for recovery.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}

              {unreconciled > 0 && (
                <DropdownMenuItem className="p-0 cursor-pointer rounded-md">
                  <Link
                    href="/admin/courier"
                    className="flex items-start gap-2.5 p-2 w-full"
                  >
                    <div className="size-7 rounded bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="size-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-foreground">
                        {unreconciled} Unreconciled Courier {unreconciled === 1 ? "Shipment" : "Shipments"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Reconcile courier COD cash settlements.
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
