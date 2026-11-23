"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DUMMY_PRODUCTS } from "@/data/dummyProducts";
import { IProduct } from "@/types/product.types";
import ProductCard from "./ProductCard";
import CatalogFilters, { CatalogFilterState } from "./CatalogFilters";
import CatalogHeader from "./CatalogHeader";
import {
  RotateCcw,
  Sparkles,
  Truck,
  RotateCcw as ReturnIcon,
  ShieldCheck,
  SearchX,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_FILTERS: CatalogFilterState = {
  search: "",
  gender: "ALL",
  category: "ALL",
  size: "ALL",
  priceRange: "ALL",
  fitType: "ALL",
  inStockOnly: false,
  sortBy: "featured",
};

interface CatalogViewProps {
  initialProducts?: IProduct[];
}

export default function CatalogView({ initialProducts }: CatalogViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize filters from query params
  const [filters, setFilters] = useState<CatalogFilterState>(() => {
    const genderParam = searchParams.get("gender")?.toUpperCase();
    const collectionParam = searchParams.get("collection")?.toLowerCase();
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("q") || searchParams.get("search") || "";
    const sizeParam = searchParams.get("size");

    let initialGender = "ALL";
    if (genderParam === "MEN" || genderParam === "WOMEN" || genderParam === "UNISEX") {
      initialGender = genderParam;
    }

    let initialCategory = "ALL";
    if (collectionParam === "winter") {
      initialCategory = "winter-collection";
    } else if (categoryParam) {
      initialCategory = categoryParam;
    }

    return {
      ...DEFAULT_FILTERS,
      gender: initialGender,
      category: initialCategory,
      search: searchParam,
      size: sizeParam || "ALL",
    };
  });

  // Keep state updated if URL query params change (e.g. clicking Men in navbar)
  useEffect(() => {
    const genderParam = searchParams.get("gender")?.toUpperCase();
    const collectionParam = searchParams.get("collection")?.toLowerCase();
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("q") || searchParams.get("search") || "";
    const sizeParam = searchParams.get("size");

    setFilters((prev) => ({
      ...prev,
      gender:
        genderParam === "MEN" || genderParam === "WOMEN" || genderParam === "UNISEX"
          ? genderParam
          : prev.gender,
      category:
        collectionParam === "winter"
          ? "winter-collection"
          : categoryParam || prev.category,
      search: searchParam || prev.search,
      size: sizeParam || prev.size,
    }));
  }, [searchParams]);

  // Update URL params when critical filters change without full reload
  const handleFilterChange = (partial: Partial<CatalogFilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...partial };
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    router.replace(pathname);
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.gender !== "ALL") count++;
    if (filters.category !== "ALL") count++;
    if (filters.size !== "ALL") count++;
    if (filters.priceRange !== "ALL") count++;
    if (filters.fitType !== "ALL") count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters]);

  // Filter and sort live database products (fallback to dummy if empty)
  const filteredProducts = useMemo(() => {
    const source =
      initialProducts && initialProducts.length > 0
        ? initialProducts
        : DUMMY_PRODUCTS;
    let list: IProduct[] = [...source];

    // 1. Search Filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameBn?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.styleCode.toLowerCase().includes(q) ||
          p.upperMaterial?.toLowerCase().includes(q) ||
          p.soleMaterial?.toLowerCase().includes(q)
      );
    }

    // 2. Gender Filter (unisex products match both Men and Women)
    if (filters.gender !== "ALL") {
      list = list.filter((p) => {
        if (p.gender === "UNISEX") return true;
        return p.gender === filters.gender;
      });
    }

    // 3. Category / Collection Filter
    if (filters.category !== "ALL") {
      list = list.filter(
        (p) =>
          p.category?.slug === filters.category ||
          p.categoryId === filters.category
      );
    }

    // 4. Size Filter
    if (filters.size !== "ALL") {
      list = list.filter((p) =>
        p.colors.some((c) =>
          c.variants.some(
            (v) => v.size === filters.size && v.stockQuantity > 0
          )
        )
      );
    }

    // 5. Price Range Filter
    if (filters.priceRange !== "ALL") {
      list = list.filter((p) => {
        const price = p.discountPrice ?? p.basePrice;
        if (filters.priceRange === "under-8k") return price < 8000;
        if (filters.priceRange === "8k-10k")
          return price >= 8000 && price <= 10000;
        if (filters.priceRange === "above-10k") return price > 10000;
        return true;
      });
    }

    // 6. Fit Type Filter
    if (filters.fitType !== "ALL") {
      list = list.filter((p) => p.fitType === filters.fitType);
    }

    // 7. In-Stock Only
    if (filters.inStockOnly) {
      list = list.filter((p) =>
        p.colors.some((c) => c.variants.some((v) => v.stockQuantity > 0))
      );
    }

    // 8. Sorting
    list.sort((a, b) => {
      const priceA = a.discountPrice ?? a.basePrice;
      const priceB = b.discountPrice ?? b.basePrice;

      if (filters.sortBy === "price-asc") {
        return priceA - priceB;
      }
      if (filters.sortBy === "price-desc") {
        return priceB - priceA;
      }
      if (filters.sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      // Default: Featured first
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      return 0;
    });

    return list;
  }, [filters]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Catalog Header with Breadcrumb & Controls */}
      <CatalogHeader
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalCount={DUMMY_PRODUCTS.length}
        filteredCount={filteredProducts.length}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Catalog Layout (Sticky Desktop Sidebar + Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12 items-start">
        {/* Desktop Sticky Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24 self-start">
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <CatalogFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              totalCount={DUMMY_PRODUCTS.length}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </div>

        {/* Product Cards Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx === 0}
                />
              ))}
            </div>
          ) : (
            /* Luxury Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 py-20 space-y-4">
              <div className="size-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <SearchX className="size-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-heading font-semibold text-zinc-900 dark:text-zinc-100">
                  No matching fragrances found
                </h3>
                <p className="text-sm text-zinc-500 max-w-sm">
                  We could not find any perfumes matching your specific olfactory
                  filter combination. Try clearing some filters.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="rounded-xl border-zinc-300 dark:border-zinc-700 text-xs font-mono"
                >
                  <RotateCcw className="size-3 mr-1.5" />
                  Reset All Filters
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    handleFilterChange({ category: "winter-collection" })
                  }
                  className="rounded-xl text-xs bg-black text-white dark:bg-white dark:text-black font-medium"
                >
                  <Sparkles className="size-3 mr-1.5" />
                  View Winter Scents
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Luxury Value Pillars Footer Banner */}
      <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
          <div className="p-3 rounded-xl bg-black text-white dark:bg-white dark:text-black shrink-0">
            <Truck className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold font-heading uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              White-Glove Fragrance Delivery
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Express nationwide delivery in cushioned climate-protected packaging with complimentary test strips.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
          <div className="p-3 rounded-xl bg-black text-white dark:bg-white dark:text-black shrink-0">
            <ReturnIcon className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold font-heading uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              Try-Before-Opening Exchange
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Test the matching sample vial first. If it does not match your skin chemistry, swap the unopened flacon within 7 days.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
          <div className="p-3 rounded-xl bg-black text-white dark:bg-white dark:text-black shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold font-heading uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              Pure Artisanal Maceration
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Formulated with up to 35% pure perfume oils, 90-day cold macerated for exceptional sillage and 14+ hour longevity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
