"use client";

import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpDown,
  X,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CatalogFilters, { CatalogFilterState } from "./CatalogFilters";

interface CatalogHeaderProps {
  filters: CatalogFilterState;
  onChange: (filters: Partial<CatalogFilterState>) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  activeFilterCount: number;
}

export default function CatalogHeader({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
  activeFilterCount,
}: CatalogHeaderProps) {
  // Label for active category
  const categoryLabel =
    filters.category === "mens-formal"
      ? "Men's Formal"
      : filters.category === "winter-collection"
      ? "Winter Collection"
      : filters.category === "womens-boots"
      ? "Women's Boots"
      : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
        <Link
          href="/"
          className="hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          HOME
        </Link>
        <ChevronRight className="size-3 text-zinc-400" />
        <span className="text-zinc-900 dark:text-zinc-100 font-medium">
          CATALOG
        </span>
        {filters.gender !== "ALL" && (
          <>
            <ChevronRight className="size-3 text-zinc-400" />
            <span className="uppercase text-zinc-600 dark:text-zinc-300">
              {filters.gender}
            </span>
          </>
        )}
      </nav>

      {/* Hero Title & Editorial Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-500 font-mono">
            <span className="size-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
            Autumn / Winter 2026 Archive
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-heading">
            {filters.category === "winter-collection"
              ? "WINTER ARCHIVE"
              : filters.gender === "MEN"
              ? "MEN'S COLLECTION"
              : filters.gender === "WOMEN"
              ? "WOMEN'S COLLECTION"
              : "FOOTWEAR ARCHIVE"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Precision engineering meets handcrafted British and Italian leathers.
            Fitted with high-density memory latex insoles and commando rubber treads.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-500">
          Showing{" "}
          <span className="font-bold text-zinc-900 dark:text-white">
            {filteredCount}
          </span>{" "}
          of {totalCount} Masterpieces
        </div>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Instant Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by leather, style, or boot name..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="pl-9 pr-8 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm focus-visible:ring-black dark:focus-visible:ring-white"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: "" })}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Right Action Controls: Mobile Filters Sheet Trigger & Sort Select */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Drawer Trigger (visible on screens < lg) */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 gap-2 font-medium text-xs font-mono"
                  />
                }
              >
                <SlidersHorizontal className="size-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="size-4 rounded-full p-0 flex items-center justify-center text-[9px] bg-black text-white dark:bg-white dark:text-black"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:max-w-md overflow-y-auto p-6 bg-white dark:bg-zinc-950"
              >
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-base font-heading uppercase tracking-wider">
                    Filter Archive
                  </SheetTitle>
                </SheetHeader>
                <CatalogFilters
                  filters={filters}
                  onChange={onChange}
                  onReset={onReset}
                  totalCount={totalCount}
                  activeFilterCount={activeFilterCount}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-mono uppercase text-zinc-400">
              Sort:
            </span>
            <Select
              value={filters.sortBy}
              onValueChange={(val) => {
                if (val) onChange({ sortBy: val });
              }}
            >
              <SelectTrigger className="h-10 w-[180px] rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Releases</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-zinc-400 font-mono">Active:</span>

          {filters.search && (
            <Badge
              variant="secondary"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
            >
              <span>&ldquo;{filters.search}&rdquo;</span>
              <button
                type="button"
                onClick={() => onChange({ search: "" })}
                className="hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {filters.gender !== "ALL" && (
            <Badge
              variant="secondary"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
            >
              <span>Gender: {filters.gender}</span>
              <button
                type="button"
                onClick={() => onChange({ gender: "ALL" })}
                className="hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {categoryLabel && (
            <Badge
              variant="secondary"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
            >
              <span>{categoryLabel}</span>
              <button
                type="button"
                onClick={() => onChange({ category: "ALL" })}
                className="hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {filters.size !== "ALL" && (
            <Badge
              variant="secondary"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-mono"
            >
              <span>EU {filters.size}</span>
              <button
                type="button"
                onClick={() => onChange({ size: "ALL" })}
                className="hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {filters.priceRange !== "ALL" && (
            <Badge
              variant="secondary"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
            >
              <span>
                {filters.priceRange === "under-8k"
                  ? "Under ৳8,000"
                  : filters.priceRange === "8k-10k"
                  ? "৳8k - ৳10k"
                  : "Above ৳10,000"}
              </span>
              <button
                type="button"
                onClick={() => onChange({ priceRange: "ALL" })}
                className="hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {filters.fitType !== "ALL" && (
            <Badge
              variant="secondary"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
            >
              <span>
                {filters.fitType === "TRUE_TO_SIZE"
                  ? "True to Size"
                  : "Runs Small"}
              </span>
              <button
                type="button"
                onClick={() => onChange({ fitType: "ALL" })}
                className="hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          {filters.inStockOnly && (
            <Badge
              variant="secondary"
              className="gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
            >
              <span>In-Stock Only</span>
              <button
                type="button"
                onClick={() => onChange({ inStockOnly: false })}
                className="hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}

          <button
            type="button"
            onClick={onReset}
            className="text-xs text-zinc-500 hover:text-black dark:hover:text-white underline font-mono ml-1"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
