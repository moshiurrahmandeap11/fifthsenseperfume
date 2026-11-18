"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronRight,
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  Check,
  Layers,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { IProduct } from "@/types/product.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: IProduct;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const activeColor = product.colors?.[selectedColorIdx] || product.colors?.[0];
  const images =
    activeColor?.images && activeColor.images.length > 0
      ? activeColor.images
      : [product.thumbnailUrl];

  const currentImage = images[selectedImageIdx] || images[0];

  const variants = activeColor?.variants || [];
  const currentPrice = product.discountPrice ?? product.basePrice;
  const discountPercent =
    product.discountPrice && product.basePrice > product.discountPrice
      ? Math.round(
          ((product.basePrice - product.discountPrice) / product.basePrice) * 100
        )
      : null;

  const handleColorChange = (idx: number) => {
    setSelectedColorIdx(idx);
    setSelectedImageIdx(0);
    setSelectedSize(null);
  };

  const handleToggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    if (next) {
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select an EU shoe size first.", {
        style: {
          background: "#18181b",
          color: "#ffffff",
          border: "1px solid #3f3f46",
        },
      });
      return;
    }

    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(
        <div className="text-xs font-normal">
          <p className="font-normal text-white">Added to Olfactory Bag</p>
          <p className="text-zinc-400 font-normal">
            {product.name} &bull; {selectedSize} &bull; {activeColor?.colorName}
          </p>
        </div>,
        {
          duration: 4000,
          style: {
            background: "#09090b",
            color: "#ffffff",
            border: "1px solid #27272a",
          },
        }
      );
    }, 400);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!", {
        style: {
          background: "#09090b",
          color: "#ffffff",
          border: "1px solid #27272a",
        },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Breadcrumb & Back Link */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
          <Link
            href="/"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            HOME
          </Link>
          <ChevronRight className="size-3 text-zinc-400" />
          <Link
            href="/products"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            CATALOG
          </Link>
          <ChevronRight className="size-3 text-zinc-400" />
          <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Archive</span>
        </Link>
      </div>

      {/* Main Grid: Gallery on Left + Product Specs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Section (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Stage Display */}
          <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              {product.isBestSeller && (
                <Badge className="bg-black text-white dark:bg-white dark:text-black font-normal text-xs tracking-wider uppercase px-3 py-1">
                  Signature Scent
                </Badge>
              )}
              {product.isNewArrival && (
                <Badge
                  variant="secondary"
                  className="bg-zinc-900/90 text-white border border-white/20 text-xs font-normal px-2.5 py-1"
                >
                  New Arrival
                </Badge>
              )}
              {discountPercent && (
                <Badge
                  variant="destructive"
                  className="bg-red-600 text-white font-normal text-xs px-2.5 py-1"
                >
                  -{discountPercent}% OFF
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={cn(
                "absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full backdrop-blur-md transition-all",
                isWishlisted
                  ? "bg-black text-red-500 shadow-md ring-2 ring-red-500/50"
                  : "bg-black/50 text-white hover:bg-black hover:text-red-400 hover:scale-110"
              )}
            >
              <Heart
                className={cn(
                  "size-5 transition-transform",
                  isWishlisted && "fill-current scale-110"
                )}
              />
            </button>
          </div>

          {/* Thumbnail Gallery Row */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {images.map((img, i) => {
                const isActive = i === selectedImageIdx;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImageIdx(i)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                      isActive
                        ? "border-black dark:border-white ring-2 ring-black/20 dark:ring-white/20 scale-105"
                        : "border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form (5 columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Header Info */}
          <div className="space-y-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase tracking-widest font-normal">
              <span>{product.category?.name || "Haute Parfumerie"}</span>
              <span>REF: {product.styleCode}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-zinc-950 dark:text-white font-heading">
              {product.name}
            </h1>

            {product.nameBn && (
              <p className="text-sm text-zinc-500 font-sans font-normal">
                {product.nameBn}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-normal font-mono text-zinc-950 dark:text-white">
                ৳{currentPrice.toLocaleString("en-BD")}
              </span>
              {product.discountPrice && (
                <span className="text-base text-zinc-400 line-through font-mono font-normal">
                  ৳{product.basePrice.toLocaleString("en-BD")}
                </span>
              )}
              {product.discountPrice && (
                <span className="text-xs font-normal text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                  Save ৳
                  {(product.basePrice - product.discountPrice).toLocaleString(
                    "en-BD"
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Colorway Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wider font-normal">
                Flacon Edition:
              </span>
              <span className="text-zinc-900 dark:text-white font-normal">
                {activeColor?.colorName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {product.colors.map((color, idx) => {
                const isActive = idx === selectedColorIdx;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorChange(idx)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-normal",
                      isActive
                        ? "border-black dark:border-white bg-zinc-100 dark:bg-zinc-900 font-normal"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                    )}
                  >
                    <span
                      className="size-3.5 rounded-full border border-zinc-400/30"
                      style={{ backgroundColor: color.colorHex || "#000" }}
                    />
                    <span>{color.colorName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flacon Volume Selector Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-normal uppercase tracking-wider font-mono">
                <span>Select Flacon Volume</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-sans font-normal">
                {product.heelHeight?.replace("Concentration: ", "") || "Extrait de Parfum"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {variants.map((v) => {
                const isSelected = selectedSize === v.size;
                const isOut = v.stockQuantity <= 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isOut}
                    onClick={() => setSelectedSize(v.size)}
                    className={cn(
                      "h-12 rounded-xl text-xs font-mono font-normal flex flex-col items-center justify-center border transition-all relative",
                      isSelected
                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white font-normal shadow-md"
                        : isOut
                        ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 line-through border-dashed border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                        : "bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-800 hover:border-black dark:hover:border-white"
                    )}
                  >
                    <span>{v.size} Flacon</span>
                    {v.stockQuantity > 0 && v.stockQuantity <= 5 && (
                      <span className="text-[9px] text-amber-500 font-sans font-normal">
                        {v.stockQuantity} remaining
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full h-13 rounded-2xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-normal tracking-wide shadow-md flex items-center justify-center gap-2"
            >
              <span>
                {selectedSize
                  ? `Add to Bag — ${selectedSize}`
                  : "Select Volume to Add"}
              </span>
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={handleShare}
                className="flex-1 h-11 rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-medium gap-2"
              >
                <Share2 className="size-3.5" />
                <span>Share Fragrance</span>
              </Button>
            </div>
          </div>

          {/* Olfactory Pyramid & Formulation Specs Grid */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Olfactory Pyramid & Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                  Top Notes
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {product.upperMaterial?.replace("Top: ", "")}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                  Heart Notes
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {product.soleMaterial?.replace("Heart: ", "")}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                  Base Notes
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {product.insoleType?.replace("Base: ", "")}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                  Concentration & Flacon
                </span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {product.heelHeight}
                </span>
              </div>
            </div>
          </div>

          {/* Narrative / Description */}
          <div className="pt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
