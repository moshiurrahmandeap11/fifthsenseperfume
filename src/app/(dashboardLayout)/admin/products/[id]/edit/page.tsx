import FragranceFormClient from "@/components/modules/admin/product/FragranceFormClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllCategories } from "@/services/category.services";
import { getProductByIdOrSlug } from "@/services/product.services";
import { ICategory } from "@/types/category.types";
import { IProduct } from "@/types/product.types";
import { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Fragrance | FIFTH SENSE PERFUMES",
  description: "Update fragrance formulation, imagery, and volume stock",
};

interface EditFragrancePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFragrancePage({
  params,
}: EditFragrancePageProps) {
  await connection();
  const { id } = await params;

  let product: IProduct | null = null;
  let categories: ICategory[] = [];

  try {
    const [productRes, categoryRes] = await Promise.all([
      getProductByIdOrSlug(id),
      getAllCategories({ limit: 100 }),
    ]);

    if (productRes?.data) {
      product = productRes.data;
    }
    if (categoryRes?.data) {
      categories = categoryRes.data;
    }
  } catch (err) {
    console.error("Failed to load fragrance for editing:", err);
  }

  if (!product) {
    notFound();
  }

  return (
    <FluidPage>
      <FragranceFormClient
        categories={categories}
        initialProduct={product}
      />
    </FluidPage>
  );
}
