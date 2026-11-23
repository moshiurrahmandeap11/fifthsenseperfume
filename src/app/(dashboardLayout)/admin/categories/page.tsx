import CategoryTreeTable from "@/components/modules/admin/category/CategoryTreeTable";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getCategoryTree } from "@/services/category.services";
import { ICategory } from "@/types/category.types";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";
import React from "react";

export default async function AdminCategoriesPage() {
  await connection();
  let categories: ICategory[] = [];

  try {
    const res = await getCategoryTree();
    if (res?.data) {
      categories = res.data;
    }
  } catch (err) {
    console.error("Failed to load categories server-side:", err);
  }

  const handleServerRefresh = async () => {
    "use server";
    revalidatePath("/admin/categories");
  };

  return (
    <FluidPage className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-normal tracking-tight text-foreground">
            Fragrance Collections
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Catalog categories and olfactory scent families
          </p>
        </div>
      </div>

      <CategoryTreeTable
        categories={categories}
        onRefresh={handleServerRefresh}
      />
    </FluidPage>
  );
}
