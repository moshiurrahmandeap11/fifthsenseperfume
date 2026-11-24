"use client";

import React from "react";
import { Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";

interface CartPromoBannerProps {
  className?: string;
}

export default function CartPromoBanner({ className }: CartPromoBannerProps) {
  const { totalQuantity, activeCoupon, applyCoupon } = useCart();

  const progress = Math.min(100, (totalQuantity / 2) * 100);
  const isBuy2Unlocked = totalQuantity >= 2;
  const isBuy2Applied = activeCoupon?.code === "BUY2";

  const handleQuickApplyBuy2 = async () => {
    const result = await applyCoupon("BUY2");
    if (result.ok) {
      toast.success(result.message, {
        style: {
          background: "#09090b",
          color: "#ffffff",
          border: "1px solid #27272a",
        },
      });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
      className={cn(
        "bg-[#f9f6ed] dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-5 sm:px-6 py-3 select-none rounded-none",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-sans text-neutral-800 dark:text-neutral-200">
          {isBuy2Applied ? (
            <Check className="size-3.5 text-[#b0986b] shrink-0" />
          ) : (
            <Sparkles className="size-3.5 text-[#c6b189] shrink-0" />
          )}

          {totalQuantity === 0 ? (
            <span>Add 2 fragrances & use code BUY2 for 20% off</span>
          ) : !isBuy2Unlocked ? (
            <span>
              Add <strong className="font-medium text-black dark:text-white">1 more</strong>{" "}
              fragrance to unlock <strong className="font-medium">20% off (BUY2)</strong>
            </span>
          ) : isBuy2Applied ? (
            <span>
              <strong className="font-medium text-black dark:text-white">BUY2 applied</strong>{" "}
              &mdash; 20% privilege & complimentary tester unlocked
            </span>
          ) : (
            <span>
              You qualify for <strong className="font-medium">20% off</strong> with code BUY2
            </span>
          )}
        </div>

        {isBuy2Unlocked && !isBuy2Applied && (
          <button
            type="button"
            onClick={handleQuickApplyBuy2}
            className="shrink-0 px-2.5 py-1 bg-[#cfb98f] hover:bg-[#bfa77a] text-white text-[10px] font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer rounded-none"
          >
            Apply BUY2
          </button>
        )}
      </div>

      {/* Minimal Champagne Progress Bar */}
      <div className="mt-2 h-[2px] w-full bg-neutral-200/80 dark:bg-neutral-800 overflow-hidden rounded-none">
        <div
          className="h-full bg-[#cfb98f] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
