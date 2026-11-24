"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/providers/CartProvider";
import { DUMMY_PRODUCTS } from "@/data/dummyProducts";
import ProductCard from "@/components/modules/storefront/catalog/ProductCard";
import SectionHeader from "@/components/common/SectionHeader";
import { formatFragrancePrice } from "./cartUtils";
import CartQuantityStepper from "./CartQuantityStepper";
import CartPromoBanner from "./CartPromoBanner";

export default function CartPageClient() {
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee,
    estimatedTotal,
    totalQuantity,
    activeCoupon,
    complimentaryTesterNote,
    updateQuantity,
    removeItem,
    clearCart,
    restoreSampleCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await applyCoupon(couponInput);
    if (res.ok) {
      setCouponInput("");
      toast.success(res.message, {
        style: {
          background: "#09090b",
          color: "#ffffff",
          border: "1px solid #27272a",
        },
      });
    } else {
      toast.error(res.message, {
        style: {
          background: "#18181b",
          color: "#ffffff",
          border: "1px solid #3f3f46",
        },
      });
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-[75vh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 space-y-12 sm:space-y-16">
        {/* 1. Editorial Page Header */}
        <div className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-neutral-400"
          >
            <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-neutral-800 dark:text-neutral-200">Shopping Bag</span>
          </nav>

          <SectionHeader
            scriptSubtitle="Your Selection"
            title="SHOPPING BAG"
            description={
              totalQuantity > 0
                ? `${totalQuantity} curated ${totalQuantity === 1 ? "fragrance" : "fragrances"} reserved for your order`
                : "Your fragrance bag is currently awaiting your selection"
            }
          />
        </div>

        {/* 2. Bag Content or Empty View */}
        {items.length === 0 ? (
          <div className="max-w-xl mx-auto border border-neutral-200 dark:border-neutral-800 bg-[#f9f6ed]/60 dark:bg-neutral-900/50 p-10 sm:p-14 text-center rounded-none">
            <div className="size-16 mx-auto flex items-center justify-center bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 mb-6 rounded-none">
              <ShoppingBag className="size-7 stroke-[1.25] text-[#c6b189]" />
            </div>
            <h2 className="font-heading font-serif text-2xl sm:text-3xl uppercase tracking-normal text-neutral-950 dark:text-white font-normal mb-2.5">
              YOUR FRAGRANCE BAG IS EMPTY
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
              Discover pure Grasse absolutes, smoky Cambodian oud, and alcohol-free Indian attars crafted for lasting character.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-3 bg-[#232323] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-sans font-medium uppercase tracking-normal transition-colors rounded-none inline-flex items-center justify-center gap-2"
              >
                <span>Explore Fragrances</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <button
                type="button"
                onClick={restoreSampleCart}
                className="w-full sm:w-auto px-7 py-3 border border-neutral-900 dark:border-neutral-300 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-sans font-medium uppercase tracking-normal transition-colors cursor-pointer rounded-none"
              >
                Load Sample Bag
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN (8 cols): Cart Line Items */}
            <div className="lg:col-span-8 space-y-4">
              <CartPromoBanner className="border border-neutral-200 dark:border-neutral-800" />

              <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-none">
                {/* Desktop Column Headers */}
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-sans font-medium uppercase tracking-wider text-neutral-500">
                  <div className="col-span-6">Fragrance</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:items-center"
                    >
                      {/* Product Image & Info */}
                      <div className="sm:col-span-6 flex items-start sm:items-center gap-4">
                        <Link
                          href={`/products/${item.slug}`}
                          className="relative w-20 h-26 sm:w-24 sm:h-30 shrink-0 bg-neutral-100 dark:bg-neutral-900 overflow-hidden block rounded-none"
                        >
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="96px"
                            className="object-cover w-full h-full"
                          />
                        </Link>

                        <div className="min-w-0 space-y-1">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                            {item.styleCode}
                          </p>
                          <Link
                            href={`/products/${item.slug}`}
                            className="block font-sans text-sm sm:text-[15px] font-normal text-[#1a1a1a] dark:text-neutral-100 hover:text-[#b0986b] transition-colors"
                          >
                            {item.productName}
                          </Link>
                          <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400">
                            {item.colorName} &bull; {item.size}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center gap-1 pt-1 text-[11px] font-sans text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3 stroke-[1.5]" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="hidden sm:block sm:col-span-2 text-center font-sans text-xs sm:text-[13px] text-neutral-700 dark:text-neutral-300">
                        {item.originalPrice && (
                          <span className="block text-[11px] text-neutral-400 line-through">
                            ৳{formatFragrancePrice(item.originalPrice)}
                          </span>
                        )}
                        <span>৳{formatFragrancePrice(item.unitPrice)}</span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between sm:justify-center sm:col-span-2">
                        <span className="sm:hidden text-xs text-neutral-500 font-sans">
                          Quantity
                        </span>
                        <CartQuantityStepper
                          quantity={item.quantity}
                          maxQuantity={item.stockAvailable}
                          onDecrease={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          onIncrease={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          size="md"
                        />
                      </div>

                      {/* Line Total */}
                      <div className="flex items-center justify-between sm:justify-end sm:col-span-2">
                        <span className="sm:hidden text-xs text-neutral-500 font-sans">
                          Subtotal
                        </span>
                        <span className="font-sans text-sm font-medium text-[#1a1a1a] dark:text-neutral-100">
                          ৳{formatFragrancePrice(item.itemTotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Bar: Continue Shopping & Clear Bag */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <Link
                  href="/products"
                  className="text-xs font-sans uppercase tracking-normal text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white underline underline-offset-4 transition-colors"
                >
                  &larr; Continue Exploring Fragrances
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-sans uppercase tracking-normal text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN (4 cols): Editorial Order Summary */}
            <aside className="lg:col-span-4 bg-[#f9f6ed]/75 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6 rounded-none">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <p
                  className="font-script text-xl leading-none mb-1"
                  style={{
                    color: "#c6b189",
                    fontFamily: 'var(--font-script), "BrittanySignature", cursive',
                  }}
                >
                  Summary
                </p>
                <h2 className="font-heading font-serif text-2xl uppercase tracking-normal text-neutral-950 dark:text-white font-normal">
                  ORDER SUMMARY
                </h2>
              </div>

              {/* Privilege / Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label
                  htmlFor="cart-coupon-input"
                  className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-neutral-600 dark:text-neutral-400"
                >
                  <Tag className="size-3 text-[#c6b189]" />
                  <span>Privilege Code (Try BUY2)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="cart-coupon-input"
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code (e.g. BUY2)"
                    className="flex-1 h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs font-sans text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#cfb98f] rounded-none"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 bg-[#cfb98f] hover:bg-[#bfa77a] active:bg-[#b0986b] text-white text-[11px] font-sans font-medium uppercase tracking-normal transition-colors cursor-pointer rounded-none"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {/* Cost Breakdown */}
              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs sm:text-[13px] font-sans">
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="text-[#1a1a1a] dark:text-neutral-100">
                    ৳{formatFragrancePrice(subtotal)}
                  </span>
                </div>

                {activeCoupon && discountAmount > 0 && (
                  <div className="flex items-center justify-between text-[#9d8354] dark:text-[#cfb98f]">
                    <div className="flex items-center gap-2">
                      <span>
                        {activeCoupon.code} ({activeCoupon.discountPercent}% off)
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
                      <span className="text-[#1a1a1a] dark:text-neutral-100">
                        Complimentary
                      </span>
                    ) : (
                      `৳${formatFragrancePrice(shippingFee)}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <span className="font-heading font-serif text-lg uppercase tracking-normal text-neutral-950 dark:text-white">
                    Estimated Total
                  </span>
                  <span className="text-lg font-sans font-medium text-neutral-950 dark:text-white">
                    ৳{formatFragrancePrice(estimatedTotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full h-12 px-6 bg-[#232323] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-sans font-medium uppercase tracking-normal transition-colors cursor-pointer rounded-none flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="size-3.5" />
              </button>

              {/* Editorial Luxury Guarantees */}
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2.5 text-[11px] font-sans text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-[#c6b189] shrink-0" />
                  <span>{complimentaryTesterNote}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-3.5 text-[#c6b189] shrink-0" />
                  <span>Complimentary express shipping over ৳5,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-[#c6b189] shrink-0" />
                  <span>100% authentic artisanal concentrates & packaging</span>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* 3. Curated Suggestions Strip (Matches Home Best Sellers Grid) */}
        <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-10">
          <SectionHeader
            scriptSubtitle="Curated Pairings"
            title="YOU MAY ALSO ADMIRE"
            description="Complete your olfactory wardrobe with our signature creations"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {DUMMY_PRODUCTS.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
