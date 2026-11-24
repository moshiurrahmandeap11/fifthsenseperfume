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
