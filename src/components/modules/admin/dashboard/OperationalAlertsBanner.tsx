"use client";

import { Badge } from "@/components/ui/badge";
import { IDashboardOperationalAlerts } from "@/types/analytics.types";
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
    return null;
  }

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-normal text-foreground">
          Operational Attention Needed ({totalCount})
        </span>
        <span className="text-[11px] font-mono text-muted-foreground">Alerts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
        {lowStock > 0 && (
          <Link
            href="/admin/inventory"
            className="flex items-center justify-between p-2.5 rounded border border-border/40 hover:bg-muted/40 transition-colors text-xs font-normal"
          >
            <span className="text-muted-foreground">Low Flacon Stock</span>
            <Badge variant="outline" className="font-normal text-[10px]">
              {lowStock} items
            </Badge>
          </Link>
        )}

        {pendingExchanges > 0 && (
          <Link
            href="/admin/exchanges"
            className="flex items-center justify-between p-2.5 rounded border border-border/40 hover:bg-muted/40 transition-colors text-xs font-normal"
          >
            <span className="text-muted-foreground">Pending Returns &amp; QC</span>
            <Badge variant="outline" className="font-normal text-[10px]">
              {pendingExchanges} tickets
            </Badge>
          </Link>
        )}

        {incompleteOrders > 0 && (
          <Link
            href="/admin/orders"
            className="flex items-center justify-between p-2.5 rounded border border-border/40 hover:bg-muted/40 transition-colors text-xs font-normal"
          >
            <span className="text-muted-foreground">Incomplete Checkout</span>
            <Badge variant="outline" className="font-normal text-[10px]">
              {incompleteOrders} leads
            </Badge>
          </Link>
        )}

        {unreconciled > 0 && (
          <Link
            href="/admin/payments"
            className="flex items-center justify-between p-2.5 rounded border border-border/40 hover:bg-muted/40 transition-colors text-xs font-normal"
          >
            <span className="text-muted-foreground">Unreconciled COD</span>
            <Badge variant="outline" className="font-normal text-[10px]">
              {unreconciled} parcels
            </Badge>
          </Link>
        )}
      </div>
    </div>
  );
}
