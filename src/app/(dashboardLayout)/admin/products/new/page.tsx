import FragranceFormClient from "@/components/modules/admin/product/FragranceFormClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllCategories } from "@/services/category.services";
import { ICategory } from "@/types/category.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "New Fragrance | FIFTH SENSE PERFUMES",
  description: "Add a new fragrance with flacon imagery and volume stock",
};

export default async function NewFragrancePage() {
  await connection();
  let categories: ICategory[] = [];

  try {
    const res = await getAllCategories({ limit: 100 });
    if (res?.data) {
      categories = res.data;
    }
  } catch (err) {
    console.error("Failed to fetch categories for new fragrance:", err);
  }

  return (
    <FluidPage>
      <FragranceFormClient categories={categories} />
    </FluidPage>
  );
}
