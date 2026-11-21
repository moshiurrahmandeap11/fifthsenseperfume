import FragranceCatalogClient from "@/components/modules/admin/product/FragranceCatalogClient";
import { getAllProducts } from "@/services/product.services";
import { IProduct } from "@/types/product.types";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Fragrance Catalog | FIFTH SENSE PERFUMES",
  description: "Manage artisanal perfumes, olfactive pyramids, flacon volumes and formula pricing",
};

export default async function AdminProductsPage() {
  await connection();
  let products: IProduct[] = [];

  try {
    const res = await getAllProducts({ limit: 100 });
    if (res?.data) {
      products = res.data;
    }
  } catch (err) {
    console.error("Failed to load fragrance catalog server-side:", err);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Fragrance Catalog
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Curate Haute Parfumerie extraits, olfactory notes, flacon sizes and formulas
          </p>
        </div>
      </div>

      {/* Main Interactive Catalog Client */}
      <FragranceCatalogClient initialProducts={products} />
    </div>
  );
}
