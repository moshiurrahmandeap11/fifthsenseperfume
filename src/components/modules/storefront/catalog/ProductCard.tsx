"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Check,
  Ruler,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { IProduct } from "@/types/product.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const activeColor = product.colors?.[selectedColorIdx] || product.colors?.[0];
  const primaryImage =
    activeColor?.images?.[0] || product.thumbnailUrl || "/placeholder-shoe.png";
  const secondaryImage =
    activeColor?.images?.[1] || primaryImage;

  // Available sizes for the active color
  const availableVariants = activeColor?.variants || [];
  const inStockSizes = availableVariants
    .filter((v) => v.stockQuantity > 0)
    .map((v) => v.size);

  // Discount percentage
  const discountPercent =
    product.discountPrice && product.basePrice > product.discountPrice
      ? Math.round(
          ((product.basePrice - product.discountPrice) / product.basePrice) * 100
        )
      : null;

  const currentPrice = product.discountPrice ?? product.basePrice;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (nextState) {
      toast.success(`Saved "${product.name}" to your wishlist.`, {
        icon: "🤍",
        style: {
          background: "#000000",
          color: "#ffffff",
          border: "1px solid #27272a",
        },
      });
    } else {
      toast("Removed from wishlist.", {
        icon: "✕",
        style: {
          background: "#000000",
          color: "#a1a1aa",
          border: "1px solid #27272a",
        },
      });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Pick first available size if none selected
    const sizeToUse = selectedSize || inStockSizes[0] || "Default";

    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(
        <div className="text-xs">
          <p className="font-semibold text-white">Added to Bag</p>
          <p className="text-zinc-400">
            {product.name} &bull; EU {sizeToUse} &bull; {activeColor?.colorName}
          </p>
        </div>,
        {
          duration: 3500,
          style: {
            background: "#09090b",
            color: "#ffffff",
            border: "1px solid #27272a",
          },
        }
      );
    }, 400);
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize((prev) => (prev === size ? null : size));
  };

  const handleColorClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorIdx(idx);
    setSelectedSize(null);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-950 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Canvas Area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
      >
        {/* Main Product Image with Smooth Transition */}
        <Image
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className={cn(
            "object-cover object-center transition-all duration-700 ease-out",
            isHovered ? "scale-105" : "scale-100"
          )}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 items-center">
          {product.isBestSeller && (
            <Badge
              variant="default"
              className="bg-black text-white dark:bg-white dark:text-black font-semibold text-[10px] tracking-wider uppercase px-2.5 py-0.5 shadow-sm"
            >
              Bestseller
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge
              variant="secondary"
              className="bg-zinc-900/90 text-zinc-100 backdrop-blur-md border border-white/10 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5"
            >
              <Sparkles className="size-2.5 mr-1 text-amber-300" />
              New
            </Badge>
          )}
          {product.categoryId === "cat-winter" && (
            <Badge
              variant="outline"
              className="bg-blue-950/80 text-blue-200 border-blue-400/30 backdrop-blur-md text-[10px] uppercase tracking-wide px-2 py-0.5"
            >
              Winter Drop
            </Badge>
          )}
          {discountPercent && (
            <Badge
              variant="destructive"
              className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5"
            >
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Top Right Actions (Wishlist & Quick View) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "flex size-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200",
              isWishlisted
                ? "bg-black text-red-500 shadow-md ring-2 ring-red-500/50"
                : "bg-black/40 text-white hover:bg-black hover:text-red-400 hover:scale-110"
            )}
          >
            <Heart
              className={cn(
                "size-4 transition-transform duration-200",
                isWishlisted && "fill-current scale-110"
              )}
            />
          </button>
        </div>

        {/* Bottom Hover Action: Quick Shoe Size Selector Drawer */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent",
            "transition-all duration-300 transform",
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0 pointer-events-none md:block"
          )}
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 mb-2">
            <span className="flex items-center gap-1 uppercase tracking-wider text-[10px] font-sans">
              <Ruler className="size-3 text-zinc-400" />
              EU Sizes:
            </span>
            <span className="text-zinc-400 font-sans text-[10px]">
              {selectedSize ? `EU ${selectedSize} selected` : "Select size"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {availableVariants.map((variant) => {
              const isSelected = selectedSize === variant.size;
              const isOutOfStock = variant.stockQuantity <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={(e) => handleSizeClick(e, variant.size)}
                  className={cn(
                    "h-7 min-w-[32px] px-1.5 rounded-md text-[11px] font-mono font-medium transition-all duration-150 flex items-center justify-center",
                    isSelected
                      ? "bg-white text-black font-bold ring-2 ring-white/50"
                      : isOutOfStock
                      ? "bg-zinc-800/50 text-zinc-600 line-through cursor-not-allowed border border-zinc-800"
                      : "bg-zinc-900/90 text-zinc-200 border border-zinc-700/60 hover:border-white hover:text-white"
                  )}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        </div>
      </Link>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col p-4 bg-white dark:bg-zinc-950">
        {/* Color Palette Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              {product.colors.map((color, idx) => {
                const isActive = idx === selectedColorIdx;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={(e) => handleColorClick(e, idx)}
                    title={color.colorName}
                    className={cn(
                      "size-4 rounded-full transition-all duration-150 relative",
                      isActive
                        ? "ring-2 ring-offset-2 ring-black dark:ring-white dark:ring-offset-zinc-950 scale-110"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    )}
                    style={{
                      backgroundColor: color.colorHex || "#000000",
                      border:
                        color.colorHex === "#f0ede6" || color.colorHex === "#ffffff"
                          ? "1px solid #d4d4d8"
                          : "none",
                    }}
                  />
                );
              })}
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              {activeColor?.colorName}
            </span>
          </div>
        )}

        {/* Category & Fit Type */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 uppercase tracking-widest font-mono mb-1">
          <span>{product.category?.name || "Luxury Footwear"}</span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">
            {product.fitType === "RUNS_SMALL" ? (
              <span className="text-amber-500 dark:text-amber-400 font-sans">
                Runs Small
              </span>
            ) : (
              <span className="text-zinc-400 font-sans">True to size</span>
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-1 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Material Specs Subtitle */}
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
          {product.upperMaterial} &bull; {product.soleMaterial}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono tracking-tight text-zinc-950 dark:text-white">
                ৳{currentPrice.toLocaleString("en-BD")}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-zinc-400 line-through font-mono">
                  ৳{product.basePrice.toLocaleString("en-BD")}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">
              VAT Included &bull; Free Return
            </p>
          </div>

          {/* Quick Add Button */}
          <Button
            type="button"
            size="sm"
            onClick={handleQuickAdd}
            disabled={isAddingToCart}
            className={cn(
              "h-9 px-3.5 rounded-xl font-medium text-xs tracking-wide transition-all duration-200",
              "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-sm"
            )}
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-white dark:bg-black animate-ping" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="size-3.5" />
                <span>Bag</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
