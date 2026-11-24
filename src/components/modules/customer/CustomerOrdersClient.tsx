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
