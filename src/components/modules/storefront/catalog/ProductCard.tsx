"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Heart, Star } from "lucide-react";
import { IProduct } from "@/types/product.types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
  initialWishlisted?: boolean;
}

export default function ProductCard({
  product,
  priority = false,
  initialWishlisted = false,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const activeColor = product.colors?.[0];
  const primaryImage =
    activeColor?.images?.[0] || product.thumbnailUrl || "/placeholder-shoe.png";

  const currentPrice = product.discountPrice ?? product.basePrice;
  const isSale = product.isBestSeller && product.discountPrice != null;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (nextState) {
      toast.success(`Saved "${product.name}" to your olfactory wishlist.`, {
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

    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(
        <div className="text-xs">
          <p className="font-semibold text-white">Added to Fragrance Bag</p>
          <p className="text-zinc-400">{product.name}</p>
        </div>,
        {
          duration: 3000,
          style: {
            background: "#09090b",
            color: "#ffffff",
            border: "1px solid #27272a",
          },
        }
      );
    }, 400);
  };

  const formatPrice = (val: number) => {
    return val < 100 ? val.toFixed(2) : val.toLocaleString("en-BD");
  };

  return (
    <div className="group flex flex-col w-full select-none">
      {/* 1. Image Container: Same Aspect Ratio (3/4), Zero Padding, Object Cover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-none">
        <Link
          href={`/products/${product.slug}`}
          className="relative block w-full h-full cursor-pointer overflow-hidden"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover w-full h-full select-none transition-none"
          />
        </Link>

        {/* Top-Right Heart Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3.5 right-3.5 z-10 size-8 flex items-center justify-center text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Heart
            className={cn(
              "size-4.5 stroke-[1.25] transition-transform duration-200 drop-shadow-sm",
              isWishlisted
                ? "fill-[#ffa667] text-[#ffa667] scale-110"
                : "text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
            )}
          />
        </button>

        {/* Bottom-Left SALE Capsule Badge */}
        {isSale && (
          <span
            style={{ borderRadius: "9999px" }}
            className="absolute bottom-3.5 left-3.5 z-10 px-3.5 py-1 bg-black text-white text-[10px] font-sans font-medium tracking-wider uppercase rounded-full select-none shadow-none"
          >
            SALE
          </span>
        )}
      </div>

      {/* 2. Centered Information Below Image */}
      <div className="flex flex-col items-center text-center pt-3.5 sm:pt-4 pb-0 w-full">
        {/* Product Title */}
        <h3 className="font-sans text-[15px] sm:text-base font-normal text-[#1a1a1a] dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors line-clamp-1">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Star Rating & Review Count */}
        <div className="flex items-center justify-center gap-1.5 mt-1.5 mb-1 text-[#ffa667]">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-[#ffa667] text-[#ffa667] stroke-none" />
            ))}
          </div>
          <span className="text-xs font-sans text-neutral-400 dark:text-neutral-400 font-normal">
            ({product._count?.reviews || 12})
          </span>
        </div>

        {/* Pricing: Strikethrough + Current Price */}
        <div className="flex items-center justify-center gap-2 mt-0.5 mb-0">
          {product.discountPrice && (
            <span className="text-xs sm:text-[13px] text-neutral-400 line-through font-normal">
              ৳{formatPrice(product.basePrice)}
            </span>
          )}
          <span className="text-xs sm:text-[13px] font-normal text-[#1a1a1a] dark:text-neutral-200">
            ৳{formatPrice(currentPrice)}
          </span>
        </div>

        {/* 3. Full-width ADD TO CART Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isAddingToCart}
          className="w-full mt-3 py-3 px-4 bg-[#232323] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-sans font-medium uppercase tracking-normal transition-colors rounded-none cursor-pointer flex items-center justify-center"
        >
          {isAddingToCart ? "ADDING..." : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
