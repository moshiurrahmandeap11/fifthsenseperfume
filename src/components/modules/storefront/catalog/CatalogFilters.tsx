"use client";

import {
  RotateCcw,
  SlidersHorizontal,
  Footprints,
  Sparkles,
  Check,
  Shield,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CatalogFilterState {
  search: string;
  gender: string; // 'ALL' | 'MEN' | 'WOMEN' | 'UNISEX'
  category: string; // 'ALL' | 'mens-formal' | 'winter-collection' | 'womens-boots'
  size: string; // 'ALL' | '36' | ... | '44'
  priceRange: string; // 'ALL' | 'under-8k' | '8k-10k' | 'above-10k'
  fitType: string; // 'ALL' | 'TRUE_TO_SIZE' | 'RUNS_SMALL'
  inStockOnly: boolean;
  sortBy: string; // 'featured' | 'price-asc' | 'price-desc' | 'newest'
}

interface CatalogFiltersProps {
  filters: CatalogFilterState;
  onChange: (filters: Partial<CatalogFilterState>) => void;
  onReset: () => void;
  totalCount: number;
  activeFilterCount: number;
  className?: string;
}

const GENDER_OPTIONS = [
  { label: "All Fragrances", value: "ALL" },
  { label: "Men / Masculine", value: "MEN" },
  { label: "Women / Feminine", value: "WOMEN" },
  { label: "Unisex / Shared", value: "UNISEX" },
];

const CATEGORY_OPTIONS = [
  { label: "All Fragrance Families", value: "ALL" },
  { label: "Woody & Smoky Oud", value: "woody-smoky-oud" },
  { label: "Winter Collection", value: "winter-collection" },
  { label: "Floral & Sandalwood", value: "floral-sandalwood" },
];

const SIZES = ["50ml", "100ml"];

const PRICE_RANGES = [
  { label: "All Prices", value: "ALL" },
  { label: "Under ৳8,000", value: "under-8k" },
  { label: "৳8,000 – ৳10,000", value: "8k-10k" },
  { label: "Above ৳10,000", value: "above-10k" },
];

const FIT_OPTIONS = [
  { label: "All Concentrations", value: "ALL" },
  { label: "Extrait de Parfum (35%)", value: "TRUE_TO_SIZE" },
  { label: "Eau de Parfum Intense", value: "RUNS_SMALL" },
];

export default function CatalogFilters({
  filters,
  onChange,
  onReset,
  totalCount,
  activeFilterCount,
  className,
}: CatalogFiltersProps) {
  return (
    <aside className={cn("flex flex-col gap-6", className)}>
      {/* Header with Active Filters Badge & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-zinc-900 dark:text-zinc-100" />
          <h2 className="text-sm font-normal uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="size-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-black text-white dark:bg-white dark:text-black font-mono font-normal"
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-normal"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Gender Filter Pills */}
      <div className="space-y-2.5">
        <label className="text-xs font-normal uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
          Gender
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {GENDER_OPTIONS.map((opt) => {
            const isSelected = filters.gender === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ gender: opt.value })}
                className={cn(
                  "h-9 px-3 rounded-lg text-xs font-normal transition-all text-center flex items-center justify-center border",
                  isSelected
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xs font-normal"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Collection / Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-normal uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
          Collection
        </label>
        <div className="space-y-1">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onChange({ category: cat.value })}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs font-normal transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-zinc-900 text-white font-normal dark:bg-zinc-100 dark:text-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="size-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Flacon Volume Pills */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-normal uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
            Flacon Volume
          </label>
          {filters.size !== "ALL" && (
            <button
              type="button"
              onClick={() => onChange({ size: "ALL" })}
              className="text-[11px] text-zinc-400 hover:underline font-normal"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SIZES.map((size) => {
            const isSelected = filters.size === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() =>
                  onChange({ size: isSelected ? "ALL" : size })
                }
                className={cn(
                  "h-8 rounded-lg text-xs font-mono font-normal transition-all flex items-center justify-center border",
                  isSelected
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white ring-1 ring-black dark:ring-white"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Range */}
      <div className="space-y-2.5">
        <label className="text-xs font-normal uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
          Price Range
        </label>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isSelected = filters.priceRange === range.value;
            return (
              <button
                key={range.value}
                type="button"
                onClick={() => onChange({ priceRange: range.value })}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs font-normal transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-zinc-900 text-white font-normal dark:bg-zinc-100 dark:text-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                <span>{range.label}</span>
                {isSelected && <Check className="size-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Olfactory Concentration */}
      <div className="space-y-2.5">
        <label className="text-xs font-normal uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono">
          Concentration
        </label>
        <div className="space-y-1">
          {FIT_OPTIONS.map((fit) => {
            const isSelected = filters.fitType === fit.value;
            return (
              <button
                key={fit.value}
                type="button"
                onClick={() => onChange({ fitType: fit.value })}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs font-normal transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-zinc-900 text-white font-normal dark:bg-zinc-100 dark:text-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                )}
              >
                <span>{fit.label}</span>
                {isSelected && <Check className="size-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. In-Stock Only Toggle */}
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-xs font-normal text-zinc-800 dark:text-zinc-200">
            In-Stock Perfumes Only
          </span>
          <Switch
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => onChange({ inStockOnly: checked })}
          />
        </label>
      </div>

      {/* Bottom Service Guarantee Banner */}
      <div className="mt-4 p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] space-y-2">
        <div className="flex items-center gap-1.5 font-normal text-zinc-900 dark:text-zinc-200 font-sans">
          <Shield className="size-3.5 text-black dark:text-white" />
          <span>Haute Parfumerie Guarantee</span>
        </div>
        <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          Pure Grasse & Cambodian absolutes, macerated for 90 days. Every bottle is individually numbered with guaranteed 12+ hour longevity.
        </p>
      </div>
    </aside>
  );
}
