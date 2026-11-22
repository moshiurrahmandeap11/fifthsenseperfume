"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartQuantityStepperProps {
  quantity: number;
  maxQuantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: "sm" | "md";
}

export default function CartQuantityStepper({
  quantity,
  maxQuantity,
  onDecrease,
  onIncrease,
  size = "sm",
}: CartQuantityStepperProps) {
  const heightClass = size === "sm" ? "h-8" : "h-9";
  const btnWidthClass = size === "sm" ? "w-7" : "w-8";
  const countWidthClass = size === "sm" ? "w-8 text-xs" : "w-10 text-xs";

  return (
    <div
      className={cn(
        "inline-flex items-center border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-none select-none",
        heightClass
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className={cn(
          "h-full flex items-center justify-center text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer rounded-none",
          btnWidthClass
        )}
      >
        <Minus className="size-3 stroke-[1.5]" />
      </button>

      <span
        className={cn(
          "h-full flex items-center justify-center font-mono text-neutral-900 dark:text-neutral-100 border-x border-neutral-200 dark:border-neutral-800",
          countWidthClass
        )}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        aria-label="Increase quantity"
        className={cn(
          "h-full flex items-center justify-center text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer rounded-none disabled:opacity-35 disabled:cursor-not-allowed",
          btnWidthClass
        )}
      >
        <Plus className="size-3 stroke-[1.5]" />
      </button>
    </div>
  );
}
