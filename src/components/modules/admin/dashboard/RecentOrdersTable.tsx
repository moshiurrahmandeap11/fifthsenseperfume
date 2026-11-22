"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDashboardRecentOrder } from "@/types/analytics.types";
import Link from "next/link";
import React from "react";

interface RecentOrdersTableProps {
  orders?: IDashboardRecentOrder[];
}

export default function RecentOrdersTable({
  orders = [],
}: RecentOrdersTableProps) {
  return (
    <Card className="shadow-none border border-border/60 bg-card overflow-hidden">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
          Recent Orders
        </CardTitle>
        <Link
          href="/admin/orders"
          className="text-xs font-normal text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-xs font-normal text-muted-foreground">
            No orders received yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/30 border-b text-muted-foreground font-normal">
                <tr>
                  <th className="py-2.5 px-4 text-left font-normal">Order #</th>
                  <th className="py-2.5 px-4 text-left font-normal">Customer</th>
                  <th className="py-2.5 px-4 text-left font-normal">Status</th>
                  <th className="py-2.5 px-4 text-right font-normal">Amount</th>
                  <th className="py-2.5 px-4 text-right font-normal">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-foreground font-normal">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-foreground font-normal">
                      <div>{order.customerName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-normal text-[10px]">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-foreground font-normal">
                      BDT {order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
