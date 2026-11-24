import React from "react";
import { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  MapPin,
  Package,
  Phone,
  Settings,
  Truck,
} from "lucide-react";
import { getMe } from "@/services/auth.services";
import { getMyOrders } from "@/services/order.services";
import { getMyAddresses } from "@/services/user.services";
import { formatFragrancePrice } from "@/components/modules/storefront/cart/cartUtils";

export const metadata: Metadata = {
  title: "Customer Dashboard | FIFTH SENSE PERFUMES",
  description:
    "Overview of your fragrance orders, loyalty points, saved addresses, and account settings.",
};

export default async function CustomerDashboardPage() {
  await connection();
  const [user, ordersRes, addressesRes] = await Promise.all([
    getMe(),
    getMyOrders().catch(() => ({ data: [] })),
    getMyAddresses().catch(() => ({ data: [] })),
  ]);

  const orders = ordersRes?.data || [];
  const addresses = addressesRes?.data || [];
  const activeOrdersCount = orders.filter(
    (o) => !["DELIVERED", "CANCELLED", "RETURNED"].includes(o.status)
  ).length;
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-serif text-2xl sm:text-3xl font-normal text-neutral-950 dark:text-white uppercase tracking-normal">
            Account Overview
          </h1>
          <p className="text-xs font-sans text-neutral-500 mt-1">
            Welcome back, {user?.name || "Customer"}. Manage your orders, addresses, and security.
          </p>
        </div>

        <Link
          href="/customer/settings"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-xs font-sans text-neutral-900 dark:text-neutral-100 transition-colors"
        >
          <Settings className="size-3.5" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="border border-neutral-200 dark:border-neutral-800 p-5 bg-[#f9f6ed]/40 dark:bg-neutral-900/40">
          <div className="flex items-center justify-between text-xs font-sans text-neutral-500 mb-2">
            <span className="uppercase tracking-wider text-[10px]">
              Total Orders
            </span>
            <Package className="size-4 text-[#c5a059]" />
          </div>
          <p className="text-2xl font-serif text-neutral-950 dark:text-white">
            {orders.length}
          </p>
          <p className="text-[11px] font-sans text-neutral-500 mt-1">
            Lifetime placed orders
          </p>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 p-5 bg-[#f9f6ed]/40 dark:bg-neutral-900/40">
          <div className="flex items-center justify-between text-xs font-sans text-neutral-500 mb-2">
            <span className="uppercase tracking-wider text-[10px]">
              Active Shipments
            </span>
            <Truck className="size-4 text-[#c5a059]" />
          </div>
          <p className="text-2xl font-serif text-neutral-950 dark:text-white">
            {activeOrdersCount}
          </p>
          <p className="text-[11px] font-sans text-neutral-500 mt-1">
            In processing or transit
          </p>
        </div>
