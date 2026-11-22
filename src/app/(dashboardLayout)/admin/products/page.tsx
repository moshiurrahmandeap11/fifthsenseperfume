import FragranceCatalogClient from "@/components/modules/admin/product/FragranceCatalogClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllProducts } from "@/services/product.services";
import { IProduct } from "@/types/product.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Fragrance Catalog | FIFTH SENSE PERFUMES",
  description: "Artisanal perfumes, olfactive pyramids and flacon pricing",
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
    <FluidPage className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
          Fragrance Catalog
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          {products.length} perfumes
        </span>
      </div>

      {/* Main Interactive Catalog Client */}
      <FragranceCatalogClient initialProducts={products} />
    </FluidPage>
  );
}
