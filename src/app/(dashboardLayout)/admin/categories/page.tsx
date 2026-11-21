import CategoryTreeTable from "@/components/modules/admin/category/CategoryTreeTable";
import { getCategoryTree } from "@/services/category.services";
import { ICategory } from "@/types/category.types";
import { Layers } from "lucide-react";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";
import React from "react";

export default async function AdminCategoriesPage() {
  await connection();
  let categories: ICategory[] = [];

  try {
    const res = await getCategoryTree(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Fragrance Collections &amp; Categories
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage luxury fragrance collections, olfactory families and storefront navigation menus
          </p>
        </div>
      </div>

      {/* Main Interactive Category Tree Table */}
      <CategoryTreeTable
        categories={categories}
        onRefresh={handleServerRefresh}
      />
    </div>
  );
}
