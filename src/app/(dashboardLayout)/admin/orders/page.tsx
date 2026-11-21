import OrderManagementClient, { AdminOrder } from "@/components/modules/admin/order/OrderManagementClient";
import { getAllOrders } from "@/services/order.services";
import { ShoppingBag } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Orders & Call Center | FIFTH SENSE PERFUMES",
  description: "Manage perfume customer orders, dispatch, and call center verification",
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Orders &amp; Call Center
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Real-time fragrance order management, call center confirmation, and parcel dispatch
          </p>
        </div>
      </div>

      {/* Main Interactive Orders Client */}
      <OrderManagementClient initialOrders={orders} />
    </div>
  );
}
