"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IDashboardRecentOrder } from "@/types/analytics.types";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

interface RecentOrdersTableProps {
  orders?: IDashboardRecentOrder[];
}

const STATUS_VARIANTS: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "PENDING",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  SHIPPED: {
    label: "SHIPPED",
    className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  DELIVERED: {
    label: "DELIVERED",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  CANCELLED: {
    label: "CANCELLED",
    className: "bg-muted text-muted-foreground border-border",
  },
  RETURNED: {
    label: "RETURNED",
    className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
};

export default function RecentOrdersTable({
  orders = [],
}: RecentOrdersTableProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShoppingBag className="size-4 text-primary" />
            <span>Recent Customer Orders</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Live order lifecycle and fulfillment tracking
          </p>
        </div>
        <Link
          href="/admin/orders"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-xs gap-1"
          )}
        >
          <span>View All</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No customer orders recorded yet. Recent orders will appear here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/30 text-muted-foreground">
                  <th className="py-2.5 px-4 font-semibold">Order ID</th>
                  <th className="py-2.5 px-4 font-semibold">Customer</th>
                  <th className="py-2.5 px-4 font-semibold">Phone</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Total (BDT)</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const statusInfo = STATUS_VARIANTS[order.status] || {
                    label: order.status,
                    className: "bg-muted text-muted-foreground border-border",
                  };

                  const dateStr = new Date(order.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-primary">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono">
                        {order.customerPhone}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-foreground">
                        BDT {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground whitespace-nowrap">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
