"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { IOrder } from "@/types/order.types";
import { formatFragrancePrice } from "@/components/modules/storefront/cart/cartUtils";
import { cn } from "@/lib/utils";

interface CustomerOrdersClientProps {
  initialOrders: IOrder[];
}

type OrderFilter = "ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED";

export default function CustomerOrdersClient({
  initialOrders,
}: CustomerOrdersClientProps) {
  const [filter, setFilter] = useState<OrderFilter>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(
    initialOrders[0]?.id || null
  );

  const filteredOrders = useMemo(() => {
    if (filter === "ALL") return initialOrders;
    if (filter === "DELIVERED") {
      return initialOrders.filter((o) => o.status === "DELIVERED");
    }
    if (filter === "CANCELLED") {
      return initialOrders.filter((o) =>
        ["CANCELLED", "RETURNED"].includes(o.status)
      );
    }
    return initialOrders.filter(
      (o) => !["DELIVERED", "CANCELLED", "RETURNED"].includes(o.status)
    );
  }, [initialOrders, filter]);

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-serif text-2xl sm:text-3xl font-normal text-neutral-950 dark:text-white uppercase">
            My Orders
          </h1>
          <p className="text-xs font-sans text-neutral-500 mt-1">
            Track shipments, review purchased fragrances, and inspect order timelines.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["ALL", "ACTIVE", "DELIVERED", "CANCELLED"] as OrderFilter[]).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-3 py-1.5 text-[11px] font-sans uppercase border transition-colors cursor-pointer",
                  filter === tab
                    ? "bg-[#09090b] text-white border-[#09090b] dark:bg-white dark:text-black dark:border-white"
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400"
                )}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="border border-neutral-200 dark:border-neutral-800 p-10 text-center space-y-4">
          <div className="size-14 mx-auto flex items-center justify-center bg-[#f9f6ed] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <Package className="size-6 text-[#c5a059]" />
          </div>
          <h2 className="font-heading font-serif text-xl font-normal text-neutral-950 dark:text-white">
            No Orders Found
          </h2>
          <p className="text-xs font-sans text-neutral-500 max-w-sm mx-auto">
            {filter === "ALL"
              ? "You haven't placed any fragrance orders yet."
              : `No orders found under the ${filter.toLowerCase()} filter.`}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#09090b] text-white dark:bg-white dark:text-black text-xs font-sans uppercase"
          >
            <span>Browse Collection</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
              >
                {/* Order Summary Row */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : order.id)
                  }
                  className="w-full p-5 flex flex-wrap items-center justify-between gap-4 text-left hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-sm font-medium text-neutral-950 dark:text-white">
                        {order.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                        {order.status.replace(/_/g, " ")}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-[#f9f6ed] dark:bg-neutral-900 text-[#9d8354] border border-[#c5a059]/30">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-neutral-500">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      &bull; {order.items?.length || 0} fragrance item(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase text-neutral-400">
                        Total
                      </span>
                      <span className="text-sm font-sans font-medium text-neutral-950 dark:text-white tabular-nums">
                        ৳{formatFragrancePrice(order.totalAmount)}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="size-4 text-neutral-500" />
                    ) : (
                      <ChevronDown className="size-4 text-neutral-500" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-neutral-200 dark:border-neutral-800 p-5 space-y-5 bg-[#f9f6ed]/25 dark:bg-neutral-900/20">
                    {/* Items */}
                    <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-14 bg-neutral-100 dark:bg-neutral-900 shrink-0 overflow-hidden">
                              {item.imageUrl && (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-sans font-medium text-neutral-950 dark:text-white">
                                {item.productName}
                              </p>
                              <p className="text-[11px] font-sans text-neutral-500 mt-0.5">
                                {item.size} &times; {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-sans font-medium text-neutral-950 dark:text-white tabular-nums">
                            ৳{formatFragrancePrice(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping & Courier Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs font-sans">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-[#c5a059]" />
                          <span>Delivery Destination</span>
                        </p>
                        <p className="text-neutral-900 dark:text-neutral-100 font-medium">
                          {order.customerName} ({order.customerPhone})
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {order.shippingAddress}, {order.thana}, {order.district},{" "}
                          {order.division}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <Truck className="size-3.5 text-[#c5a059]" />
                          <span>Shipment &amp; Breakdown</span>
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          Subtotal: ৳{formatFragrancePrice(order.subtotal)} &bull;
                          Delivery: ৳{formatFragrancePrice(order.shippingCharge)}
