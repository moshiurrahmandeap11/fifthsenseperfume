import InventoryManagementClient from "@/components/modules/admin/inventory/InventoryManagementClient";
import { getSizeMatrix } from "@/services/inventory.services";
import { ISizeMatrixProduct } from "@/types/inventory.types";
import { Boxes } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Inventory & Batch Stock | FIFTH SENSE PERFUMES",
  description: "Monitor fragrance flacon stock, batch variations, and warehouse reserves",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Boxes className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Inventory &amp; Batch Stock
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Monitor perfume flacon volumes, stock health levels, and atelier reserves
          </p>
        </div>
      </div>

      {/* Main Interactive Inventory Client */}
      <InventoryManagementClient initialProducts={products} />
    </div>
  );
}
