import InventoryManagementClient from "@/components/modules/admin/inventory/InventoryManagementClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getSizeMatrix } from "@/services/inventory.services";
import { ISizeMatrixProduct } from "@/types/inventory.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Inventory | FIFTH SENSE PERFUMES",
  description: "Monitor fragrance flacon stock and warehouse reserves",
};

export default async function AdminInventoryPage() {
  await connection();
  let products: ISizeMatrixProduct[] = [];

  try {
    const res = await getSizeMatrix({ limit: 100 });
    if (res?.data) {
      products = res.data;
    }
  } catch (err) {
    console.error("Failed to load fragrance inventory server-side:", err);
  }

  return (
    <FluidPage className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
          Inventory &amp; Batch Stock
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          {products.length} formulations
        </span>
      </div>

      {/* Main Interactive Inventory Client */}
      <InventoryManagementClient initialProducts={products} />
    </FluidPage>
  );
}
