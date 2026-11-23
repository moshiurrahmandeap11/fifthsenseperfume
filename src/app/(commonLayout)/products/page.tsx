import { Suspense } from "react";
import { Metadata } from "next";
import { connection } from "next/server";
import CatalogView from "@/components/modules/storefront/catalog/CatalogView";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllProducts } from "@/services/product.services";
import { IProduct } from "@/types/product.types";

export const metadata: Metadata = {
  title: "Fragrance Catalog & Archive | FIFTH SENSE PERFUMES",
  description:
    "Explore our limited-batch luxury fragrance archive. Artisanal Extraits de Parfum, winter warm amber elixirs, and sublime floral notes.",
};

function CatalogSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 max-w-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block lg:col-span-1">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogView />
    </Suspense>
  );
}
