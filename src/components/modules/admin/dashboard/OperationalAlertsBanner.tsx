"use client";

import { Badge } from "@/components/ui/badge";
import { IDashboardOperationalAlerts } from "@/types/analytics.types";
import {
  AlertTriangle,
  ArrowLeftRight,
  Boxes,
  ChevronRight,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface OperationalAlertsBannerProps {
  alerts?: IDashboardOperationalAlerts;
}

export default function OperationalAlertsBanner({
  alerts,
}: OperationalAlertsBannerProps) {
  const lowStock = alerts?.lowStockVariantsCount ?? 0;
  const pendingExchanges = alerts?.pendingExchangesCount ?? 0;
  const incompleteOrders = alerts?.unresolvedIncompleteOrdersCount ?? 0;
  const unreconciled = alerts?.unreconciledShipmentsCount ?? 0;

  const totalCount = lowStock + pendingExchanges + incompleteOrders + unreconciled;

  if (totalCount === 0) {
    return (
      <div className="rounded-xl border bg-emerald-500/5 border-emerald-500/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="size-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
              All Operations Normal
            </h4>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
              No broken-size risks, pending exchanges, or unreconciled courier payments.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-[11px]">
          All Clear
        </Badge>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-amber-500/5 border-amber-500/20 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="size-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
              Operational Alerts (Action Required)
              <Badge variant="destructive" className="text-[10px] h-4 px-1.5 font-bold">
                {totalCount} {totalCount === 1 ? "Item" : "Items"}
              </Badge>
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Size inventory shortages, pending customer size exchanges, or courier COD reconciliation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {lowStock > 0 && (
          <Link
            href="/admin/inventory"
            className="group flex items-center justify-between p-2.5 rounded-lg bg-background border hover:border-primary/40 transition-colors text-xs"
          >
            <div className="flex items-center gap-2">
              <Boxes className="size-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-semibold text-foreground">
                  {lowStock} Low Stock
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Broken-size risk
                </p>
              </div>
            </div>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        )}

        {pendingExchanges > 0 && (
          <Link
            href="/admin/exchanges"
            className="group flex items-center justify-between p-2.5 rounded-lg bg-background border hover:border-primary/40 transition-colors text-xs"
          >
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="size-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-semibold text-foreground">
                  {pendingExchanges} Exchanges
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Doorstep swap requests
                </p>
              </div>
            </div>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        )}

        {incompleteOrders > 0 && (
          <Link
            href="/admin/orders?type=incomplete"
            className="group flex items-center justify-between p-2.5 rounded-lg bg-background border hover:border-primary/40 transition-colors text-xs"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="size-4 text-purple-600 shrink-0" />
              <div>
                <span className="font-semibold text-foreground">
                  {incompleteOrders} Abandoned Carts
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Call center follow-up
                </p>
              </div>
            </div>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        )}

        {unreconciled > 0 && (
          <Link
            href="/admin/courier"
            className="group flex items-center justify-between p-2.5 rounded-lg bg-background border hover:border-primary/40 transition-colors text-xs"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-semibold text-foreground">
                  {unreconciled} Unreconciled
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Courier COD remittance
                </p>
              </div>
            </div>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        )}
      </div>
    </div>
  );
}
