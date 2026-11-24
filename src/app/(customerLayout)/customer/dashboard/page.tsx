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
