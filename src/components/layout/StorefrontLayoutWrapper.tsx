"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";

interface StorefrontLayoutWrapperProps {
  children: React.ReactNode;
}

export default function StorefrontLayoutWrapper({
  children,
}: StorefrontLayoutWrapperProps) {
  const { isDrawerOpen } = useCart();
  const [originY, setOriginY] = useState<number>(0);

  useEffect(() => {
    if (isDrawerOpen) {
      setOriginY(window.scrollY + window.innerHeight / 2);
    }
  }, [isDrawerOpen]);

  return (
    <div
      style={
        isDrawerOpen && originY > 0
          ? {
              transformOrigin: `50% ${originY}px`,
            }
          : undefined
      }
      className={cn(
        "min-h-screen flex flex-col bg-white dark:bg-[#070504] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isDrawerOpen && [
          "md:scale-[0.96]",
          "md:rounded-2xl",
          "md:overflow-hidden",
          "md:shadow-[0_20px_80px_rgba(0,0,0,0.85)]",
          "md:border",
          "md:border-neutral-800/80",
          "select-none",
        ]
      )}
    >
      {children}
    </div>
  );
}
