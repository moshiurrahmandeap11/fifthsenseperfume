"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/providers/CartProvider";
import { formatFragrancePrice } from "./cartUtils";
import CartQuantityStepper from "./CartQuantityStepper";
import { cn } from "@/lib/utils";

/**
 * Slide-over fragrance bag drawer with desktop side-by-side layout shrink,
 * outside-click dismissal, and direct checkout navigation.
 */
export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    subtotal,
    discountAmount,
    shippingFee,
    estimatedTotal,
    totalQuantity,
    activeCoupon,
    updateQuantity,
    removeItem,
    restoreSampleCart,
    removeCoupon,
  } = useCart();

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mq.addEventListener("change", handleMediaChange);
    return () => mq.removeEventListener("change", handleMediaChange);
  }, []);

  // Close on Escape key press or outside click
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };

    const handleOutsideMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (drawerRef.current?.contains(target)) return;
      if (target.closest('[aria-label="Open Shopping Bag"]')) return;
      closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideMouseDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Mobile Backdrop Overlay (only on mobile screens < 768px, exactly like avirocloud) */}
      <AnimatePresence>
        {isDrawerOpen && isMobile && (
          <motion.div
            key="cart-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            onClick={closeDrawer}
          />
        )}
      </AnimatePresence>

      {/* Floating Side-by-Side Docked Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.aside
            ref={drawerRef}
            key="cart-drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.38,
              ease: [0.22, 1, 0.36, 1],
              delay: isDrawerOpen ? 0.02 : 0,
            }}
            className={cn(
              "fixed z-50 bg-white dark:bg-neutral-950 flex flex-col justify-between overflow-hidden shadow-2xl select-none isolate pointer-events-auto",
              isMobile
                ? "inset-y-0 right-0 w-full sm:max-w-[420px]"
                : "right-0 top-0 bottom-0 h-screen w-[440px] border-l border-neutral-200 dark:border-neutral-800"
            )}
          >
            {/* 1. Drawer Header (height aligned with Navbar Row 1: h-18 sm:h-20) */}
            <div className="h-18 sm:h-20 px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-950 shrink-0">
              <div className="flex items-center gap-2.5">
                <h2 className="font-heading font-serif text-xl sm:text-2xl uppercase tracking-normal font-normal text-neutral-950 dark:text-white">
                  FRAGRANCE BAG
                </h2>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-none">
                  {totalQuantity}
                </span>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close bag"
                className="p-2 -mr-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer rounded-none"
              >
                <X className="size-5 stroke-[1.5]" />
              </button>
            </div>

            {/* 2. Drawer Body: Items or Editorial Empty State */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center select-none">
                <div className="size-16 flex items-center justify-center bg-[#f9f6ed] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-5 rounded-none">
                  <ShoppingBag className="size-7 stroke-[1.25] text-[#c6b189]" />
                </div>

                <h3 className="font-heading font-serif text-2xl uppercase tracking-normal text-neutral-950 dark:text-white font-normal mb-2">
                  YOUR BAG IS EMPTY
                </h3>
                <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 max-w-[260px] leading-relaxed mb-7">
                  Explore our curated collection of artisanal extraits and pure Indian attars.
                </p>

                <div className="flex flex-col gap-2.5 w-full max-w-[240px]">
                  <Link
                    href="/products"
                    onClick={closeDrawer}
                    className="w-full py-3 px-5 bg-[#232323] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-sans font-medium uppercase tracking-normal transition-colors rounded-none flex items-center justify-center gap-2"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="size-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={restoreSampleCart}
                    className="w-full py-2.5 px-4 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-[11px] font-sans uppercase tracking-normal text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer rounded-none"
                  >
                    Load Sample Bag
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Scrollable Line Items */}
                <div className="flex-1 overflow-y-auto px-6 divide-y divide-neutral-100 dark:divide-neutral-900">
                  {items.map((item) => (
                    <div key={item.id} className="py-5 flex gap-4 group">
                      {/* Product Thumbnail */}
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeDrawer}
                        className="relative w-20 h-26 shrink-0 bg-neutral-100 dark:bg-neutral-900 overflow-hidden block rounded-none"
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          sizes="80px"
                          className="object-cover w-full h-full"
                        />
                      </Link>

                      {/* Product Details & Controls */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={closeDrawer}
                              className="font-sans text-sm font-normal text-[#1a1a1a] dark:text-neutral-100 hover:text-[#b0986b] transition-colors line-clamp-1"
                            >
                              {item.productName}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              aria-label={`Remove ${item.productName}`}
                              className="p-1 -mr-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                              title="Remove"
                            >
                              <Trash2 className="size-3.5 stroke-[1.5]" />
                            </button>
                          </div>

                          <p className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400 mt-1">
                            {item.colorName} &bull; {item.size}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-3">
                          <CartQuantityStepper
                            quantity={item.quantity}
                            maxQuantity={item.stockAvailable}
                            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                            size="sm"
                          />

                          <div className="text-right">
                            {item.originalPrice && (
                              <span className="block text-[10px] text-neutral-400 line-through font-sans">
                                ৳{formatFragrancePrice(item.originalPrice * item.quantity)}
                              </span>
                            )}
                            <span className="text-xs sm:text-[13px] font-sans font-medium text-[#1a1a1a] dark:text-neutral-100">
                              ৳{formatFragrancePrice(item.itemTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Drawer Summary Footer */}
                <div className="px-6 py-5 border-t border-neutral-200 dark:border-neutral-800 bg-[#f9f6ed]/60 dark:bg-neutral-900/50 space-y-4 shrink-0">
                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Subtotal</span>
                      <span className="text-[#1a1a1a] dark:text-neutral-100">
                        ৳{formatFragrancePrice(subtotal)}
                      </span>
                    </div>

                    {activeCoupon && discountAmount > 0 && (
                      <div className="flex items-center justify-between text-[#9d8354] dark:text-[#cfb98f]">
                        <div className="flex items-center gap-1.5">
                          <span>
                            Privilege ({activeCoupon.code} -{activeCoupon.discountPercent}%)
                          </span>
                          <button
                            type="button"
                            onClick={removeCoupon}
                            className="text-[10px] underline hover:text-black dark:hover:text-white cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <span>-৳{formatFragrancePrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-[#1a1a1a] dark:text-neutral-200">
                            Complimentary
                          </span>
                        ) : (
                          `৳${formatFragrancePrice(shippingFee)}`
                        )}
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                      <span className="font-heading font-serif text-base uppercase tracking-normal text-neutral-950 dark:text-white">
                        Estimated Total
                      </span>
                      <span className="text-base font-sans font-medium text-neutral-950 dark:text-white">
                        ৳{formatFragrancePrice(estimatedTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full h-11 px-4 bg-[#232323] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-sans font-medium uppercase tracking-normal transition-colors cursor-pointer rounded-none flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="size-3.5" />
                    </button>

                    <Link
                      href="/cart"
                      onClick={closeDrawer}
                      className="w-full h-10 px-4 border border-neutral-900 dark:border-neutral-300 text-neutral-950 dark:text-neutral-100 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-sans font-medium uppercase tracking-normal transition-colors rounded-none flex items-center justify-center"
                    >
                      View Full Bag
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
