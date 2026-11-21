import OrderManagementClient, { AdminOrder } from "@/components/modules/admin/order/OrderManagementClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllOrders } from "@/services/order.services";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Orders | FIFTH SENSE PERFUMES",
  description: "Fragrance customer orders, dispatch, and verification",
};

export default async function AdminOrdersPage() {
  await connection();
  let orders: AdminOrder[] = [];

  try {
    const res = await getAllOrders({ limit: 100 });
    if (res?.data) {
      orders = res.data as unknown as AdminOrder[];
    }
  } catch (err) {
    console.error("Failed to load orders server-side:", err);
  }

  return (
    <FluidPage className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
          Orders &amp; Call Center
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          {orders.length} total
        </span>
      </div>

      {/* Main Interactive Orders Client */}
      <OrderManagementClient initialOrders={orders} />
    </FluidPage>
  );
}
